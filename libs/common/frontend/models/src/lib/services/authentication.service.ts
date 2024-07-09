import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {

    private readonly tokenKey = 'authToken';
    private readonly tokenExpirationTime = 1000 * 60 * 60;

    // this is a demo app, don't actually store these things in the code
    private readonly secretKey = 'XceleratorDemoApp';
    private readonly userDataBase = [
        { userMail: 'alex.lorenz.1@gmx.de', password: 'siemens' },
        { userMail: 'lama.l.rajjo@fau.de', password: 'siemens' },
        { userMail: 'ingo.sternberg@fau.de', password: 'siemens' },
        { userMail: 'cecilia.betancourt@fau.de', password: 'siemens' },
        { userMail: 'jonas@mennicke.com', password: 'siemens' },
        { userMail: 'krugm03@gmail.com', password: 'siemens' },
        { userMail: 'nasirsharaz@gmail.com', password: 'siemens' },
        { userMail: 'patrick.m.schmidt@fau.de', password: 'siemens' },
        { userMail: 'saleb2k@gmail.com', password: 'siemens' },
        { userMail: 'd.schmidt@campus.tu-berlin.de', password: 'siemens' },
        { userMail: 'david_schmidt_privat@outlook.com', password: 'siemens' },
        { userMail: 'igor.milovanovic@siemens.com', password: 'siemens' },
        { userMail: 'buchner@group.riehle.org', password: 'siemens' },
        { userMail: 'riehle@group.riehle.org', password: 'siemens' },
    ];

    login(email: string, password: string) {

        if (this.checkCredentials(email, password)) {
            const token = this.generateToken(email, password);
            localStorage.setItem(this.tokenKey, token);
            return true;
        }

        return false;
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
    }

    isLoggedIn() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) {
            return false;
        }

        const userData = this.decryptToken(token);
        if (!userData) {
            return false;
        }

        if (!this.checkCredentials(userData.userMail, userData.password)) {
            return false;
        }

        if (new Date().getTime() - userData.time > this.tokenExpirationTime) {
            this.logout();
            return false;
        }

        return true;
    }

    getUserMail() {
        const token = localStorage.getItem(this.tokenKey);
        if (!token) {
            return false;
        }

        const userData = this.decryptToken(token);
        if (!userData) {
            return false;
        }

        return userData.userMail;
    }

    private checkCredentials(email: string, password: string) {
        return this.userDataBase.some(user => user.userMail === email && user.password === password);
    }

    private generateToken(email: string, password: string) {
        // ':' is not allowed in the email, so we can use it as a separator
        const time = new Date().getTime();
        const tokenData = `${email}:${password}:${time}`;
        return CryptoJS.AES.encrypt(tokenData, this.secretKey).toString();
    }

    private decryptToken(token: string) {
        try {
            const bytes = CryptoJS.AES.decrypt(token, this.secretKey);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            // the token should have the format email:password:time, where password could contain :
            const firstColonIndex = decryptedData.indexOf(':');
            const userMail = decryptedData.slice(0, firstColonIndex);

            const lastColonIndex = decryptedData.lastIndexOf(':');
            const password = decryptedData.slice(firstColonIndex + 1, lastColonIndex);
            const time = decryptedData.slice(lastColonIndex + 1);

            return { userMail: userMail, password: password, time: parseInt(time) };
        } catch (error) {
            return null;
        }
    }

}
