import {Injectable} from "@angular/core";
import {Http,Headers} from '@angular/http';
import {Config} from "./Config";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class MicroServiceS {


    constructor(private http: Http){ }


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

  

}