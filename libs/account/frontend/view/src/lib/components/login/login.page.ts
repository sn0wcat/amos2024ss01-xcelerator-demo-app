import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IxModule } from '@siemens/ix-angular';
import { AuthenticationService } from 'common-frontend-models';

@Component({
    selector: 'lib-login',
    standalone: true,
    imports: [ CommonModule, FormsModule, IxModule ],
    templateUrl: './login.page.html',
    styleUrls: [ './login.page.scss' ],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
    protected email = '';
    protected password = '';
    protected wasValidated = false;
    protected formValid = signal(false);
    protected loginSuccess = signal(false);
    private readonly emailRegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}


    onSubmit() {
        this.wasValidated = true;

        const formValid = this.emailRegExp.test(this.email) && this.password !== '';
        this.formValid.set(formValid);
        if(!formValid){
            return;
        }

        const loginSuccess = this.authenticationService.login(this.email, this.password);
        this.loginSuccess.set(loginSuccess);
        if(loginSuccess){
            this.router.navigate([ '/' ]);
        }

    }

}
