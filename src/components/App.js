import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Posudba from '../abis/Posudba.json'

import Main from './Main'

class App extends Component {
   

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Posudba.networks[networkId]
    if(networkData) {
      const posudba = web3.eth.Contract(Posudba.abi, networkData.address)
      this.setState({ posudba })
      

      const brojPosuditelja = await posudba.methods.brojPosuditelja().call()
      this.setState({ brojPosuditelja })

      const brojPosudjivaca = await posudba.methods.brojPosudjivaca().call()
      this.setState({ brojPosudjivaca})

      // Load 
      for (var i = 1; i <= brojPosudjivaca; i++) {
        const posudjivac = await posudba.methods.pposudjivac(i).call()
        this.setState({
          posudjivaci: [...this.state.posudjivaci, posudjivac]
        })
      }

      for(var j=1;j<=brojPosuditelja;j++){
        const posuditelj = await posudba.methods.posuditelj(j).call()
        this.setState({
          posuditelji:[...this.state.posuditelji,posuditelj]
        })
      }
      this.setState({loading:false})

    } else {
      window.alert('Posudba contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      brojPosudjivaca : 0,
      brojPosuditelja : 0,
      posudjivaci: [],
      posuditelji: [],

      loading: true
    }
     this.registratePosuditelj=this.registratePosuditelj.bind(this)
      this.registratePosudjivac=this.registratePosudjivac.bind(this) 
      this.posudi=this.posudi.bind(this)
   }

    registratePosudjivac(posudjivacName){
      this.setState({loading: true})
     this.state.posudba.methods.registratePosudjivac(posudjivacName).send({ from: this.state.account })
     .once('receipt',(receipt)=>{
      this.setState({loading: false})
      })
    }

     registratePosuditelj(posuditeljName,price){
      this.setState({loading: true})
     this.state.posudba.methods.registratePosuditelj(posuditeljName,price).send({ from: this.state.account })
     .once('receipt',(receipt)=>{
      this.setState({loading: false})
      })
    }
    posudi (id, price) {
    this.setState({ loading: true })
    this.state.posudba.methods.posudi(id).send({ from: this.state.account, value: price })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }



  render() {
    return (
      <div>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                    posuditelji={this.state.posuditelji}
                    posudjivaci={this.state.posudjivaci}

                    registratePosuditelj={this.registratePosuditelj}
                    registratePosudjivac={this.registratePosudjivac}
                    posudi={this.posudi}
                    />
                  
                  
              }
            </main>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
