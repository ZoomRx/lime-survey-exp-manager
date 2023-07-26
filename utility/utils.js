/**
 * Check for empty value.
 * Verifies that a value is
 *  1. undefined or null
 *  2. Empty String
 *  3. Empty Array
 *  4. Empty Plain Object (not supported for all type of objects)
 * @param value
 * @returns {Boolean}
 */

export function isEmpty(value = null) {
    try {
        if (value === undefined || value === null) {
            return true;
        }
        if (value.length && value.length === 0) {
            return true;
        }
        if (typeof value === 'string' && (value === '' || value.trim() === '')) {
            return true;
        }
        if (typeof value === 'object' && Object.keys(value).length === 0) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}