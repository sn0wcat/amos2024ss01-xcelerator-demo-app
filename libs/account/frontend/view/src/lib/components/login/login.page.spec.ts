import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthenticationService } from 'common-frontend-models';

import { LoginPage } from './login.page';

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let authServiceMock: jest.Mocked<AuthenticationService>;
    let routerMock: jest.Mocked<Router>;

    beforeEach(async () => {
        authServiceMock = {
            login: jest.fn().mockReturnValue(true),
            isLoggedIn: jest.fn().mockReturnValue(false),
        } as unknown as jest.Mocked<AuthenticationService>;

        routerMock = {
            navigate: jest.fn(),
        } as unknown as jest.Mocked<Router>;

        await TestBed.configureTestingModule({
            imports: [ LoginPage ],
            providers: [
                { provide: AuthenticationService, useValue: authServiceMock },
                { provide: Router, useValue: routerMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onSubmit', () => {
        it('should not validate form if email or password is invalid', () => {
            // bypass protected attribute using bracket notation
            component['email'] = 'invalid-email';
            component['password'] = '';
            component.onSubmit();

            expect(routerMock.navigate).not.toHaveBeenCalled();
        });

        it('should validate form and login successfully', () => {
            component['email']= 'test@example.com';
            component['password'] = 'password';
            component.onSubmit();

            expect(routerMock.navigate).toHaveBeenCalledWith([ '/' ]);
        });
    });
});
