import React, { Component } from 'react';

class Main extends Component {


  render() {

    return (
      <div id="content">
        <h1>Dodaj Posuditelja</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          
          const ime = this.ime.value
           const price = window.web3.utils.toWei(this.price.value.toString(), 'Ether')
           this.props.registratePosuditelj(ime, price)
        }}>

          <div className="form-group mr-sm-2">
            <input

              id="ime"
              type="text"
              ref={(input) => { this.ime = input }}
              className="form-control"
              placeholder="Ime"
              required />
          </div>

          <div className="form-group mr-sm-2">
            <input
              id="price"
              type="text"
              ref={(input) => { this.price = input }}
              className="form-control"
              placeholder="Koliko bi posudio?"
              required />
          </div>

          <button type="submit" className="btn btn-primary">dodaj posuditelja</button>
        </form>



         <h1>Dodaj Posuđivaća</h1>

		<form onSubmit={(event) => {
          event.preventDefault()
          const ime = this.ime.value
          this.props.registratePosudjivac(ime)
        }}>

          <div className="form-group mr-sm-2">
            <input
              id="ime"
              type="text"
              ref={(input) => { this.ime = input }}
              className="form-control"
              placeholder="Ime"
              required />
          </div>

      
          <button type="submit" className="btn btn-primary">dodaj posuđivaća</button>
        </form>







        <h2>posudi</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Ime</th>
              <th scope="col">price</th>

              <th scope="col"></th>
            </tr>
          </thead>


           <tbody id="posudbaList">
            { this.props.posuditelji.map((posuditelj, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{posuditelj.id.toString()}</th>
                  <td>{posuditelj.id.toString()}</td>
                  <td>{posuditelj.ime}</td>
                  <td>{window.web3.utils.fromWei(posuditelj.treba.toString(), 'Ether')} Eth</td>
  
                  <td>
                  {!posuditelj.posudio
                  	?<button
                          name={posuditelj.id}
                          value={posuditelj.trba}
                          onClick={(event) => {
                            this.props.posudi(event.target.name,event.target.value)
                            // triba adresa ne name
                            }
                        }
                        >
                          posudi
                        </button>

                           :null
                         }           
                    </td>
                    
                </tr>
              );
            })}


            
          </tbody>



    
        </table>
      </div>
    );
  }
}

export default Main;
