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

    errorP = false;
    errorMsgP = "";
    played : boolean = null;


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
		this.microServiceI.identification(this.id.toString()).subscribe(
			data=>{
				console.log("donnée de l'auth :" +JSON.stringify(data))
				this.errorI = !data.estPresent;
				if(data.estPresent){
					this.name = data.name;
				}else{
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


}