import { TestBed } from '@angular/core/testing';

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

    it('should set lightmode to false initially and change it when toggled', async () => {
        // we need to wait for the effect to be done
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(service.getLightMode()()).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith('lightMode', 'false');

        service.toggleTheme();
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(service.getLightMode()()).toBeTruthy();
        expect(localStorage.setItem).toHaveBeenCalledWith('lightMode', 'true');
    });

});
