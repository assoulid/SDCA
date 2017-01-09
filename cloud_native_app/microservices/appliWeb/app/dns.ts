import {Injectable} from '@angular/core'
import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';


@Injectable()
export class Dns {

    constructor(){
    }

    static getServiceAddrByName(http: Http, name:string){

		let urlws : string= "http://localhost:8500/v1/catalog/service/"+name;
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return http.get(urlws,{headers:headers})
            .map(res => res.json())
			.map((res: Array<any>) => {
				if(res && res.length > 0){
					return res[0]["Address"]+":"+res[0]["ServicePort"];
				}
				return null;
			})
    }




}