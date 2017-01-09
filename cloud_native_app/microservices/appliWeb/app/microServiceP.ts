import {Injectable, Component} from "@angular/core";
import {Http,Headers} from '@angular/http';
import {Dns} from './dns';

/*
@Component({
   providers: [Dns]
})
*/


@Injectable()
export class MicroServiceP {

/*
    constructor(private http: Http, private dns : Dns){}

	getPrice(id:number){
        this.dns.getServiceAddrByName("p").subscribe(
			data=>{
                let urlws : string= data+'/'+id ;
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
	}*/

}