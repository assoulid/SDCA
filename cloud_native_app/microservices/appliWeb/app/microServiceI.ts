import {Injectable} from "@angular/core";
import {Http,Headers} from '@angular/http';
import {Config} from "./config";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class MicroServiceI {


    constructor(private http: Http){}


	identification(id:string){
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



}