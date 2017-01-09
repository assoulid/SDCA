import {Component, Injectable} from "@angular/core";
import {Http,Headers} from '@angular/http';
import {Config} from "./Config";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class MicroServiceB {


    
    constructor(private http: Http){}


    play(id:number){
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




}