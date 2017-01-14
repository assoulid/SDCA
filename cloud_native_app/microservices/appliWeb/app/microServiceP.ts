import {Injectable, Component} from "@angular/core";
import {Http,Headers} from '@angular/http';


@Injectable()
export class MicroServiceP {

    host:string;

    constructor(private http: Http){ 
        this.host = window.location.protocol+"//"+window.location.hostname;
        if(window.location.port){
            this.host += ":"+window.location.port
        }
    }

    
	getPrice(id:string){
        let method : string = "/getPrice"+'/'+id 
        let urlws : string= this.host+method ;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        console.log("Acces à l'adresse : "+urlws);
        return this.http.get(urlws,{headers:headers})
            .timeout(5000)
            .map((res: any) => {
                return res;
            })
			
	}

}