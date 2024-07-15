/**
 * We want to show different icons and since it is not stored in the backend we have to generate it
 * Since we always want the same icon for the same facility we can generate a random value from the title
 * it would be the best to use hashing but this is good enough
 * @param str
 * @private
 */
export function randomIconFromString(str: string) {
    let total = 0;
    for (let i = 0; i < str.length; i++) {
        total += str.charCodeAt(i);
    }
    const options = [ 'water-fish', 'water-plant', 'global-plant', 'building-2' ];
    return options[total % options.length];
}
