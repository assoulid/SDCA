import {Injectable} from "@angular/core";


@Injectable()
export class CookieManager {
    
    static setCookie(cname:string, cvalue:string):void {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }

    static getCookie(cname:string):string{
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    static deleteCookie(cname:string):void {
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    static checkCookie(cname:string):boolean{
        return CookieManager.getCookie(cname) == '';
    }

}