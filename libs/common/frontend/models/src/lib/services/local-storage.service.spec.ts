import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
    let service: LocalStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LocalStorageService);

        jest.spyOn(Storage.prototype, 'setItem');
        Storage.prototype.setItem = jest.fn();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('register should set it to the default value if it is not set', () => {
        service.register('test', 'false');

        expect(localStorage.setItem).toHaveBeenCalledWith('test', 'false');
    });

    it('register should not overwrite values if they are already set', () => {

        Storage.prototype.getItem = jest.fn().mockReturnValue("true");

        service.register('test', 'false');
        expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it('set should correctly set the localStorage and signal', () => {
        service.set('test', 'true');

        expect(localStorage.setItem).toHaveBeenCalledWith('test', 'true');
        expect(service.get('test')()).toBe(true);
    });

    it('set should correctly update signal', () => {

        service.set('test', 'true');

        const signal = service.get('test')
        expect(signal()).toBe('true');

        service.set('test', 'false');
        expect(signal()).toBe('false');
    });


});
