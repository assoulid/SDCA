import {Component, Injectable} from "@angular/core";
import {Utils} from "./utils";
import {Http,Headers} from '@angular/http';
import {Config} from './config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Component({
   selector: 'micro-service-I',
   templateUrl : 'app/microServiceI.html',
   styleUrls : ['app/css/microService.css']
})

@Injectable()
export class MicroServiceI {

    id:number = -1;
    name:string="";
	error:boolean = true;
	errorMsg:string = "";

    constructor(private http: Http){
	//constructor(){
        // Récupération du paramètre "id" dans l'URL
        let aux:string = Utils.getParameterByName("id");
        console.log("Param id : "+aux)
        if(aux != null && aux !== ""){
            this.id = +aux;
			this.authentification()
        }
    }


	authentificationService(id:string){
		let method = '/login'+'/'+id;
		let  urlws : string= Config.addrServiceI + method ;
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		console.log("Acces à l'adresse : "+urlws);
		return this.http.get(urlws,{headers:headers})
			.timeout(5000)
            .map(res => res.json())
			.map((res: any) => {
				return res;
			})
	}

	authentification(){
		this.authentificationService(this.id.toString()).subscribe(
			data=>{
				console.log("donnée de l'auth :" +JSON.stringify(data))
				this.error = !data.estPresent;
				if(data.estPresent){
					this.name = data.name;
				}else{
					this.errorMsg = "Identifiant incorrect"
				}
			},
			error=>{
				console.log("Le service I ne répond pas...")
				this.error=true;
				this.errorMsg = "Le service I ne répond pas..."
			}
		);
	}

}