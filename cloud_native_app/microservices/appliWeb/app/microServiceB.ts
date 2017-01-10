import {Component, Injectable} from "@angular/core";
import {Http,Headers} from '@angular/http';
import {Dns} from "./dns";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';



@Injectable()
export class MicroServiceB {


    
    constructor(private http: Http){ }


    play(id:number){
		console.log("debut play")
        let res = Dns.getServiceAddrByName(this.http,"b");
		res.subscribe(
			data=>{
				console.log("Reponse du DNS : [b] "+data)
                let urlws : string= data+'/play/'+id ;
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
		);
		return res;
	}




}