import { Injectable, signal } from '@angular/core';

/**
 * Manages boolean values in localStorage with reactive signals.
 * Allows registering keys with default values, setting, and getting values reactively.
 */

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

    private signals = new Map<string, ReturnType<typeof signal>>();

    /**
     * Registers a key with a default value if not already set.
     * @param key The localStorage key.
     * @param defaultValue The default boolean value.
     */
    register(key: string, defaultValue: boolean) {
        if (localStorage.getItem(key) === null) {
            this.set(key, defaultValue);
        }
    }

    /**
     * Sets the value for a key and updates its signal.
     * @param key The localStorage key.
     * @param value The boolean value to set.
     */
    set(key: string, value: boolean){
        localStorage.setItem(key, String(value));
        this.getOrCreateSignal(key).set(value);
    }

    /**
     * Returns the signal for a key, creating it if necessary.
     * @param key The localStorage key.
     * @returns The signal for the key.
     */
    get(key: string){
        return this.getOrCreateSignal(key);
    }

    /**
     * Creates or retrieves a signal for a key.
     * @param key The localStorage key.
     * @returns The signal for the key.
     */
    private getOrCreateSignal(key: string) {
        if (!this.signals.has(key)) {
            const initialValue = localStorage.getItem(key) === 'true';
            const newSignal = signal(initialValue);
            this.signals.set(key, newSignal);
            return newSignal;
        }
        return this.signals.get(key)!;
    }

}
