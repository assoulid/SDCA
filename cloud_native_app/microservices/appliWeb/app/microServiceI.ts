import {Injectable} from "@angular/core";
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class MicroServiceI {

    host:string = window.location.protocol+"//"+window.location.hostname+":"+window.location.port;

    constructor(private http: Http){}


	identification(id:string){
		let method = '/login/'+id;
		let  urlws : string= this.host + method ;
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