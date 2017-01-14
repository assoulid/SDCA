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
    played : boolean = null;

    gift:string= null;

    constructor(private microServiceB : MicroServiceB,
                private microServiceI : MicroServiceI,
                private microServiceP : MicroServiceP,
                private microServiceS : MicroServiceS){

    }

	play(){
		this.microServiceB.play(this.id).subscribe(
			data=>{
				console.log("Resultat final du PLAY")
                console.log(data);
			},
			error=>{
				console.log("Le service B ne répond pas...");
			}
		);
	}

    identification(){
		this.microServiceI.identification(this.name, this.password).subscribe(
			data=>{
				console.log("donnée de l'auth :" +JSON.stringify(data))
				if(data && data.error==undefined){
					console.log(JSON.stringify(data));
					this.id = data[0]["id_customer"];
					this.getPrice();
				}else{
					this.errorI = true;
					this.errorMsgI = "Identifiant incorrect"
				}
			},
			error=>{
				console.log("Le service I ne répond pas...")
				this.errorI=true;
				this.errorMsgI = "Le service I ne répond pas..."
			}
		);
	}

	getStatus(){
		this.microServiceS.getStatus(this.id.toString()).subscribe(
			data=>{
				console.log("Reponse du service S : ")
				console.log(JSON.stringify(data))
			},
			error=>{
				console.log("Le service S ne répond pas...")
				this.errorS=true;
				this.errorMsgS = "Le service S ne répond pas..."
			}
		)
	}

	getPrice(){
		this.microServiceP.getPrice(this.id.toString()).subscribe(
			data=>{
				console.log("Reponse du service P : ")
				console.log(JSON.stringify(data))
			},
			error=>{
				console.log("Le service P ne répond pas...")
				this.errorS=true;
				this.errorMsgS = "Le service P ne répond pas..."
			}
		)
	}

}
