import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly tokenKey = 'authToken';

    constructor(
       private _router: Router,
    ) {}

    login(email: string, password: string) {
        if(password === 'siemens') {
            sessionStorage.setItem(this.tokenKey, email);
            return true;
        }
        return false;
    }

    logout(){
        sessionStorage.removeItem(this.tokenKey);
        this._router.navigate(['account/login'])
    }

    isLoggedIn() {
        const token = sessionStorage.getItem(this.tokenKey);
        if(!token){
            return false;
        }

        try {
            // jwt.verify(token, this.secretKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    getUserMail() {
        return sessionStorage.getItem(this.tokenKey)
    }

}
