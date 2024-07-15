import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IxModule } from '@siemens/ix-angular';
import { AuthenticationService } from 'common-frontend-models';

@Component({
    selector: 'lib-account-login',
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
    protected showPassword = false;

    private readonly _emailRegExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    protected readonly formValid = signal(false);
    protected readonly loginSuccess = signal(false);

    constructor(
        private readonly _router: Router,
        private readonly _authenticationService: AuthenticationService,
    ) {}

    onSubmit() {
        this.wasValidated = true;

        const formValid = this._emailRegExp.test(this.email) && this.password !== '';
        this.formValid.set(formValid);
        if(!formValid){
            return;
        }

        const loginSuccess = this._authenticationService.login(this.email, this.password);
        this.loginSuccess.set(loginSuccess);
        if(loginSuccess){
            this._router.navigate([ '/' ]);
        }

    }

    togglePassword() {
        const passwordElement = document.getElementById('passwordElement');
        if(!passwordElement) {
            return;
        }

        this.showPassword = !this.showPassword;
        const typeVal =  this.showPassword ? 'text' : 'password';
        passwordElement.setAttribute('type',  typeVal);
    }

}
