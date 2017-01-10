import {Injectable, Component} from "@angular/core";
import {Http,Headers} from '@angular/http';


@Injectable()
export class MicroServiceP {

    host:string = window.location.protocol+"//"+window.location.hostname+":"+window.location.port;

    constructor(private http: Http){}

	getPrice(id:number){
        let method : string = "getPrice"+'/'+id 
        let urlws : string= this.host+method ;
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