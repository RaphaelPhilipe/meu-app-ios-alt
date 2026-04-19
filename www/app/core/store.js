const listeners = new Set();

export const state = {
    online: navigator.onLine,
    session: null,
    bootstrap: null,
    currentRoute: "splash",
    visitDetailId: null,
    visits: [],
    dashboard: null,
    systemModules: []
};

export function setState(patch) {
    Object.assign(state, patch);
    listeners.forEach((listener) => listener(state));
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
