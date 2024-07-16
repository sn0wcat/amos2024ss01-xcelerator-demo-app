/**
 * We want to show different icons and since it is not stored in the backend we have to generate it
 * Since we always want the same icon for the same facility we can generate a random value from some
 * string of the facility

 * @param str
 * @private
 */
export function randomIconFromString(str: string) {
    const options = [ 'water-fish', 'water-plant', 'global-plant', 'building-2' ];
    const number = randomNumberFromString(str);
    return options[number % options.length];
}

/**
 * Generates a random number from a string, hashing would be better but this is enough
 * @param str
 * @private
 */
export function randomNumberFromString(str: string){
    let total = 0;
    for (let i = 0; i < str.length; i++) {
        total += str.charCodeAt(i);
    }
    return total;
}
