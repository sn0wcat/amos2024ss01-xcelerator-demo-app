import { effect, Injectable, signal } from '@angular/core';
import { themeSwitcher } from '@siemens/ix';

/**
 * Service that stores the current theme in the browsers localStorage as a boolean "lightMode"
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeStorageService {

    // like this lightMode is false by default because getItem will return null
    private lightMode = signal(window.localStorage.getItem('lightMode') === 'true');

    constructor() {
        effect(() => {
            const lm = this.lightMode();
            window.localStorage.setItem('lightMode', lm ? 'true' : 'false');
            themeSwitcher.setTheme(lm ? 'theme-classic-light' : 'theme-classic-dark');
        })
    }

    /**
     * flips the lightMode signal and thus results in
     * the "lightMode" in the localStorage to be changed
     * and also calls the Siemens themeSwitcher
     */
    toggleTheme() {
        this.lightMode.update(value => !value);
    }

    /**
     * returns the lightMode Signal for easy use in components
     * f.e. to change an icon depending on the mode
     */
    getLightMode() {
        return this.lightMode;
    }

}
