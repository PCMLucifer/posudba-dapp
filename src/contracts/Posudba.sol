pragma solidity ^0.5.0;

contract Posudba {
   struct Posuditelj{
       uint id;
       address payable adresaPosuditelja;
       string Name;
       uint treba;
       bool posudjeno;
   }
   uint public brojPosuditelja=0;
   mapping(uint=>Posuditelj) public posuditelj;
   
    struct Posudjivac{
       uint id;
       address adresaPosudjivaca;
       string Name;
       uint[] posudio;
   }
   uint public brojPosudjivaca=0;
   mapping(uint=>Posudjivac) public posudjivac;
   
   
     function registratePosuditelj (string memory _name, uint _treba) public{
        require(bytes(_name).length>0);
        require(_treba>0);
        for(uint i=0;i<=brojPosuditelja;i++){
            Posuditelj storage test=posuditelj[i];
            require(test.adresaPosuditelja!=msg.sender,"posuditelj već registriran");
        }
        brojPosuditelja++;
        posuditelj[brojPosuditelja]=Posuditelj(brojPosuditelja,msg.sender,_name,_treba,false);
     }
   
     function registratePosudjivac (string memory _name) public{
        require(bytes(_name).length>0);
        for(uint i=0;i<=brojPosudjivaca;i++){
            Posudjivac storage test=posudjivac[i];
            require(test.adresaPosudjivaca!=msg.sender,"posuditelj već registriran");
        }
        brojPosudjivaca++;
        posudjivac[brojPosudjivaca]=Posudjivac(brojPosudjivaca,msg.sender,_name,new uint[](0));
     }
     
     
     function posudi (uint _id) public payable{
         address _Posudjivac=msg.sender;
         uint _posid=0;
         
         for(uint i=0;i<=brojPosuditelja;i++){
             if(posudjivac[i].adresaPosudjivaca==_Posudjivac){
                _posid=i;
                break;
             }else if(i==brojPosudjivaca&&posudjivac[i].adresaPosudjivaca!=_Posudjivac){
                 require(posudjivac[i].adresaPosudjivaca==_Posudjivac,"neregistriran Posudjivac");
             }
         }
         
         require(posuditelj[_id].id==_id,"invalid id");
          require(posuditelj[_id].posudjeno==false,"vec posudjeno");
         require(posuditelj[_id].adresaPosuditelja!=_Posudjivac,"posuđivać i Posudjivac ne mogu biti ist");
         
         require(msg.value==(posuditelj[_id].treba*1000000000000000000),"nevaljani iznos");
         posuditelj[_id].adresaPosuditelja.transfer(msg.value);
         posuditelj[_id].posudjeno=true;
         posudjivac[_posid].posudio.push(_id);
         
     }
   
}
