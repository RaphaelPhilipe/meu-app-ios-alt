const listeners = new Set();

export const state = {
    online: navigator.onLine,
    session: null,
    bootstrap: null,
    currentRoute: "splash",
    drawerOpen: false,
    visitDetailId: null,
    visitDetail: null,
    visits: [],
    dashboard: null,
    notifications: null,
    agenda: null,
    customers: null,
    issues: null,
    issueDetailId: null,
    issueDetail: null,
    freightAdjustments: null,
    freightAdjustmentDetailId: null,
    freightAdjustmentDetail: null,
    profile: null,
    settings: null,
    about: null,
    help: null,
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
