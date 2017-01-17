import {Component} from "@angular/core";
import {MicroServiceI} from "./microServiceI";
import {MicroServiceB} from "./microServiceB";
import {MicroServiceP} from "./microServiceP";
import {MicroServiceS} from "./microServiceS";
import {Dns} from "./dns";

@Component({
   selector: 'home',
   templateUrl : 'app/home.html', 
   styleUrls:["app/css/home.css"],
   providers: [MicroServiceB,MicroServiceI, MicroServiceP,MicroServiceS,Dns]
})



export class Home {
  

    id : number = -1;

    firstname : string = "";
	lastname : string = "";
	mail : string = "";
    password : string = "";;
    errorI = false;
    errorMsgI = "";
	errorLogin = false;
    errorB = false;
    errorMsgB = "";

	errorS = false;
    errorMsgS = "";

    errorP = false;
    errorMsgP = "";
    hasPlayed : boolean = null;
	hasWon : boolean = false;
	playing : boolean = false;
    gift:string= null;

    constructor(private microServiceB : MicroServiceB,
                private microServiceI : MicroServiceI,
                private microServiceP : MicroServiceP,
                private microServiceS : MicroServiceS,
                private dns : Dns){
		this.getAllServices()
    }

	play(){
		this.playing = true;
		this.microServiceB.play(this.id).subscribe(
			data=>{
				console.log("Réponse du service B : " + JSON.stringify(data))
				if(data && data.error==undefined && data.errno==undefined && data.message==='done'){
					this.getStatus();
					this.errorB = false;
				}else{
					this.errorB = true;
					this.errorMsgB = "Le service B a rencontré une erreur"
				}
				this.playing = false;
			},
			error=>{
				console.log("Le service B a mis trop de temps à répondre "+JSON.stringify(error));
				this.errorB = true;
				this.errorMsgB = "Le service B a mis trop de temps à répondre"
				this.playing = false;
			}
		);
	}

    identification(){
		this.microServiceI.identification(this.mail, this.password).subscribe(
			data=>{
				console.log("Réponse du service I :" +JSON.stringify(data))
				if(data && data.error==undefined && data.errno==undefined){
					this.id = data[0]["id_customer"];
					this.firstname = data[0]["firstname"];
					this.lastname = data[0]["lastname"];
					this.errorI=false;
					this.errorLogin = false;
					this.getStatus();
				}else if(data.errno){
					this.errorLogin = false;
					this.errorI = true;
					this.errorMsgI = "Service indisponible"
				}else if(data.error==="Pas de correspondance"){
					this.errorLogin = true;
					this.errorI = false;
					this.errorMsgI = "Identifiant incorrect"
				}
			},
			error=>{
				console.log("Le service I ne répond pas... "+JSON.stringify(error))
				this.errorI=true;
				this.errorLogin = false;
				this.errorMsgI = "Le service I ne répond pas..."
			}
		);
	}

	deconnexion(){
		this.id = -1;
		this.firstname = "";
		this.lastname = "";
		this.mail = "";
		this.password = "";;
		this.errorI = false;
		this.errorMsgI = "";
		this.errorB = false;
		this.errorMsgB = "";
		this.errorS = false;
		this.errorMsgS = "";
		this.errorP = false;
		this.errorMsgP = "";
		this.hasPlayed = null;
		this.hasWon = false;
		this.gift= null;
	}

	getStatus(){
		this.microServiceS.getStatus(this.id.toString()).subscribe(
			data=>{
				console.log("Reponse du service S : "+JSON.stringify(data))
				if(data && data.error==undefined && data.errno==undefined){
					this.hasPlayed = data["hasPlayed"];
					this.hasWon = data["hasWon"];
					if(this.hasWon){
						this.getPrice();
					}
					this.errorS=false;
				}else{
					console.log("Le service S ne répond pas... ")
					this.errorS=true;
					this.errorMsgS = "Le service S ne répond pas..."
				}
			},
			error=>{
				console.log("Le service S ne répond pas... "+JSON.stringify(error))
				this.errorS=true;
				this.errorMsgS = "Le service S ne répond pas..."
			}
		)
	}

	getPrice(){
		this.microServiceP.getPrice(this.id.toString()).subscribe(
			data=>{
				console.log("Reponse du service P : "+JSON.stringify(data))
				if(data && data.error==undefined && data.errno==undefined &&
					data["_body"] && data["_body"].substr(data["_body"].length-1)==="="){
					this.gift = data["_body"]
					this.errorP=false;
				}else{
					this.errorP=true;
					this.errorMsgP = "Le service P ne répond pas..."
				}
			},
			error=>{
				console.log("Le service P ne répond pas... "+JSON.stringify(error))
				this.errorP=true;
				this.errorMsgP = "Le service P ne répond pas..."
			}
		)
	}


	getAllServices(){
		this.dns.allServices().subscribe(
			data=>{
				if(data.b){
					this.errorB = false;
				}else{
					this.errorB=true;
					this.errorMsgB="Service B est introuvable";
				}
				if(data.i){
					this.errorI = false;
				}else{
					this.errorI=true;
					this.errorMsgI="Service I est introuvable";
				}
				if(data.s){
					this.errorS = false;
				}else{
					this.errorS=true;
					this.errorMsgS="Service S est introuvable";
				}
				if(data.p){
					this.errorP = false;
				}else{
					this.errorP=true;
					this.errorMsgP="Service P est introuvable";
				}
			},
			error=>{

			}
		)
	}

}
