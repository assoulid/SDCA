import {Injectable} from "@angular/core";
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class MicroServiceS {

    host:string;

    constructor(private http: Http){ 
        this.host = window.location.protocol+"//"+window.location.hostname;
        if(window.location.port){
            this.host += ":"+window.location.port
        }
    }

	getStatus(id:string){
		let method = '/status/'+id;
		let urlws : string= this.host + method ;
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