import {Component} from "@angular/core";
import {MicroServiceI} from "./microServiceI";
import {MicroServiceB} from "./microServiceB";
import {MicroServiceP} from "./microServiceP";
import {MicroServiceS} from "./microServiceS";

@Component({
   selector: 'home',
   templateUrl : 'app/home.html', 
   styleUrls:["app/css/home.css"],
   providers: [MicroServiceB,MicroServiceI, MicroServiceP,MicroServiceS]
})



export class Home {
  

    id : number = -1;

    name : string = "";
    password : string = "";;
    errorI = false;
    errorMsgI = "";

    errorB = false;
    errorMsgB = "";

	errorS = false;
    errorMsgS = "";

    errorP = false;
    errorMsgP = "";
    hasPlayed : boolean = null;
	hasWon : boolean = false;

    gift:string= null;

    constructor(private microServiceB : MicroServiceB,
                private microServiceI : MicroServiceI,
                private microServiceP : MicroServiceP,
                private microServiceS : MicroServiceS){

    }

	play(){
		this.microServiceB.play(this.id).subscribe(
			data=>{
				console.log("Réponse du service B : " + JSON.stringify(data))
				this.getStatus();
			},
			error=>{
				console.log("Le service B ne répond pas... "+JSON.stringify(error));
			}
		);
	}

    identification(){
		this.microServiceI.identification(this.name, this.password).subscribe(
			data=>{
				console.log("Réponse du service I :" +JSON.stringify(data))
				if(data && data.error==undefined){
					this.id = data[0]["id_customer"];
					this.getStatus();
				}else{
					this.errorI = true;
					this.errorMsgI = "Identifiant incorrect"
				}
			},
			error=>{
				console.log("Le service I ne répond pas... "+JSON.stringify(error))
				this.errorI=true;
				this.errorMsgI = "Le service I ne répond pas..."
			}
		);
	}

	getStatus(){
		this.microServiceS.getStatus(this.id.toString()).subscribe(
			data=>{
				console.log("Reponse du service S : "+JSON.stringify(data))
				this.hasPlayed = data["hasPlayed"];
				this.hasWon = data["hasWon"];
				if(this.hasWon){
					this.getPrice();
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
				this.gift = data["_body"]
			},
			error=>{
				console.log("Le service P ne répond pas... "+JSON.stringify(error))
				this.errorS=true;
				this.errorMsgS = "Le service P ne répond pas..."
			}
		)
	}

}
