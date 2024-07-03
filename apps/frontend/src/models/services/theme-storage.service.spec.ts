import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ThemeStorageService } from './theme-storage.service';

describe('ThemeStorageService', () => {
    let service: ThemeStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: []
        });
        service = TestBed.inject(ThemeStorageService);

        jest.spyOn(Storage.prototype, 'setItem');
        Storage.prototype.setItem = jest.fn();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set lightmode to false initially and change it when toggled', fakeAsync(() => {
        // we need to wait for the effect to be done
        tick();
        expect(service.getLightMode()()).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith('lightMode', 'false');

        service.toggleTheme();

        tick();
        expect(service.getLightMode()()).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith('lightMode', 'true');
    }));

});
