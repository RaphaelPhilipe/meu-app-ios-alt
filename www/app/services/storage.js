const memoryFallback = new Map();

function hasLocalStorage() {
    try {
        return Boolean(window.localStorage);
    } catch (error) {
        return false;
    }
}

export const storage = {
    get(key, fallback = null) {
        if (hasLocalStorage()) {
            const value = window.localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        }
        return memoryFallback.has(key) ? memoryFallback.get(key) : fallback;
    },
    set(key, value) {
        if (hasLocalStorage()) {
            window.localStorage.setItem(key, JSON.stringify(value));
            return;
        }
        memoryFallback.set(key, value);
    },
    remove(key) {
        if (hasLocalStorage()) {
            window.localStorage.removeItem(key);
            return;
        }
        memoryFallback.delete(key);
    }
};
