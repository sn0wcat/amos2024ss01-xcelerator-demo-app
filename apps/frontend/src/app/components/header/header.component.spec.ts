import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { IxModule, themeSwitcher } from '@siemens/ix-angular';
import { AuthenticationService, LocalStorageService } from 'common-frontend-models';

const HEADER_ROUTES = {
    snapshot: {
        firstChild: {
            routeConfig: {
                path: ''
            }
        },
    },
    root: {
        snapshot: {
            data: {
                breadcrumb: 'Layer 1',
            },
        },
        firstChild: {
            snapshot: {
                data: {
                    breadcrumb: 'Layer 2',
                },
            },
        },
    },
};

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;
    const eventsSubject = new ReplaySubject<RouterEvent>(1);
    let routerMock: Router;
    let localStorageServiceMock: LocalStorageService;
    let authenticationServiceMock: AuthenticationService;

    beforeEach(async () => {
        routerMock = {
            events: eventsSubject.asObservable(),
            url: '/Layer1/Layer2',
            navigate: jest.fn()
        } as unknown as Router;

        localStorageServiceMock = {
            getOrCreate: jest.fn().mockReturnValue(jest.fn().mockReturnValue('theme-classic-dark')),
            set: jest.fn()
        } as unknown as LocalStorageService;

        authenticationServiceMock = {
            getUserMail: jest.fn().mockReturnValue('test@example.com'),
            logout: jest.fn()
        } as unknown as AuthenticationService;

        await TestBed.configureTestingModule({
            imports: [HeaderComponent],
            providers: [
                { provide: ActivatedRoute, useValue: HEADER_ROUTES },
                { provide: Router, useValue: routerMock },
                { provide: LocalStorageService, useValue: localStorageServiceMock },
                { provide: AuthenticationService, useValue: authenticationServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should trigger router events correctly', () => {
        eventsSubject.next(new NavigationEnd(1, '', ''));

        const routerEvents = component.routerEvents();
        expect(routerEvents).toBeInstanceOf(NavigationEnd);
    });

    it('should compute breadcrumbs correctly', () => {
        eventsSubject.next(new NavigationEnd(1, '', ''));

        const breadcrumbs = component.breadcrumbs();
        expect(breadcrumbs).toEqual(['Layer 1', 'Layer 2']);
    });

    it('should determine if it is home page correctly', () => {
        eventsSubject.next(new NavigationEnd(1, '', ''));

        const isHomePage = component.isHomePage();
        expect(isHomePage).toBe(true);
    });

    it('should toggle theme mode', () => {
        component.toggleMode();
        expect(localStorageServiceMock.set).toHaveBeenCalledWith('theme', 'theme-classic-light');
    });

    it('should logout and navigate to login', () => {
        component.logout();
        expect(authenticationServiceMock.logout).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/account/login']);
    });

    it('should cut URL correctly', () => {
        const cutUrl = component.cutUrl(1);
        expect(cutUrl).toBe('/Layer1');
    });
});
