import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly tokenKey = 'authToken';

    login(email: string, password: string) {
        if(password === 'siemens') {
            localStorage.setItem(this.tokenKey, email);
            return true;
        }
        return false;
    }

    logout(){
        localStorage.removeItem(this.tokenKey);
    }

    isLoggedIn() {
        const token = localStorage.getItem(this.tokenKey);
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
        return localStorage.getItem(this.tokenKey)
    }

}
