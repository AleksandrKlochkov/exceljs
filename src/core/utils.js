// Pure functions
export function capitalize(string) {
    if (typeof string !== 'string') {
        return ''
    }

    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function storage(key, data = null) {
    if (!data) {
       return JSON.parse(localStorage.getItem(key))
    } else {
        localStorage.setItem(key, JSON.stringify(data))
    }
}

export function isEqual(a, b) {
    if (typeof a === 'object' && typeof b === 'object') {
        return JSON.stringify(a) === JSON.stringify(b)
    }
    return a === b
}
