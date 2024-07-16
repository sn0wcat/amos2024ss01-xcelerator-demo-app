import { TestBed } from '@angular/core/testing';

import { APP_CONFIG } from '../tokens';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    const mockSecretKey = 'test_secret_key';
    const mockConfig = { secretKey: mockSecretKey };

    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            },
            writable: true
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: APP_CONFIG, useValue: mockConfig }
            ]
        });
        service = TestBed.inject(AuthenticationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('login', () => {
        it('should return true for valid credentials', () => {
            jest.spyOn(service as any, 'checkCredentials').mockReturnValue(true);
            expect(service.login('test@example.com', 'password')).toBe(true);
        });

        it('should return false for invalid credentials', () => {
            jest.spyOn(service as any, 'checkCredentials').mockReturnValue(false);
            expect(service.login('test@example.com', 'wrong_password')).toBe(false);
        });
    });

    describe('logout', () => {
        it('should remove token from localStorage', () => {
            const removeItemSpy = jest.spyOn(localStorage, 'removeItem');
            service.logout();
            expect(removeItemSpy).toHaveBeenCalledWith('authToken');
        });
    });

    describe('isLoggedIn', () => {
        it('should return false if no token in localStorage', () => {
            jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should return false if token cannot be decrypted', () => {
            jest.spyOn(localStorage, 'getItem').mockReturnValue('invalid_token');
            jest.spyOn(service as any, 'decryptToken').mockReturnValue(null);
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should return false if credentials are invalid', () => {
            const token = 'valid_encrypted_token';
            const userData = { userMail: 'test@example.com', password: 'password', time: new Date().getTime() };
            jest.spyOn(localStorage, 'getItem').mockReturnValue(token);
            jest.spyOn(service as any, 'decryptToken').mockReturnValue(userData);
            jest.spyOn(service as any, 'checkCredentials').mockReturnValue(false);
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should return false if token is expired', () => {
            const token = 'valid_encrypted_token';
            const expiredTime = new Date().getTime() - 1000 * 60 * 60 - 1000;
            const userData = { userMail: 'test@example.com', password: 'password', time: expiredTime };
            jest.spyOn(localStorage, 'getItem').mockReturnValue(token);
            jest.spyOn(service as any, 'decryptToken').mockReturnValue(userData);
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should return true for valid token and credentials', () => {
            const token = 'valid_encrypted_token';
            const userData = { userMail: 'test@example.com', password: 'password', time: new Date().getTime() };
            jest.spyOn(localStorage, 'getItem').mockReturnValue(token);
            jest.spyOn(service as any, 'decryptToken').mockReturnValue(userData);
            jest.spyOn(service as any, 'checkCredentials').mockReturnValue(true);
            expect(service.isLoggedIn()).toBe(true);
        });
    });

    describe('getUserMail', () => {
        it('should return false if no token in localStorage', () => {
            jest.spyOn(localStorage, 'getItem').mockReturnValue(null);
            expect(service.getUserEmail()).toBe(false);
        });

        it('should return false if token cannot be decrypted', () => {
            jest.spyOn(localStorage, 'getItem').mockReturnValue('invalid_token');
            jest.spyOn(service as any, 'decryptToken').mockReturnValue(null);
            expect(service.getUserEmail()).toBe(false);
        });

        it('should return user email if token is valid', () => {
            const token = 'valid_encrypted_token';
            const userData = { userMail: 'test@example.com', password: 'password', time: new Date().getTime() };
            jest.spyOn(localStorage, 'getItem').mockReturnValue(token);
            jest.spyOn(service as any, 'decryptToken').mockReturnValue(userData);
            expect(service.getUserEmail()).toBe('test@example.com');
        });
    });
});
