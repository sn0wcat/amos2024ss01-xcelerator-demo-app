import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IxModule } from '@siemens/ix-angular';

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
    protected loginSuccess = false;

    constructor(
        private router: Router
    ) {}


    onSubmit(form: NgForm) {
        this.wasValidated = true;

        if (!form.valid) {
            return;
        }

        this.loginSuccess = this.password === 'siemens';
        if(this.loginSuccess){
            this.router.navigate([ '/' ]);
        }

    }

}
