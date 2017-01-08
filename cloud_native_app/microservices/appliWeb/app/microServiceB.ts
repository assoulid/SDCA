import {Component, Injectable} from "@angular/core";
import {Utils} from "./utils";
import {Http,Headers} from '@angular/http';
import {Config} from './config';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Component({
   selector: 'micro-service-B',
   templateUrl : 'app/microServiceB.html',
   styleUrls : ['app/css/microService.css']
})

export class MicroServiceB {


    id = -1;
    error = false;
    errorMsg = "";

    aJoue : boolean = false;

    constructor(private http: Http){
       let aux:string = Utils.getParameterByName("id");
        console.log("Param id : "+aux)
        if(aux != null && aux !== ""){
            this.id = +aux;
			this.getStatus(aux).subscribe(data=>{
                this.aJoue = data.aJoue;
			})
        }
    }


	getStatus(id:string){
		let method = '/status'+'/'+id;
		let urlws : string= Config.addrServiceS + method ;
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

    serviceButton(id:string){
        let method = '/play'+'/'+id;
		let urlws : string= Config.addrServiceB + method ;
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

	jouer(){
		this.serviceButton(this.id.toString()).subscribe(
			data=>{
                console.log("OK");
			},
			error=>{
				console.log("Le service B ne répond pas...");
			}
		);
	}



}