import { apiRequest } from "./api.js";
import { storage } from "./storage.js";
import { setState } from "../core/store.js";

const SESSION_KEY = "session_snapshot";

export async function login(loginValue, password) {
    const data = await apiRequest("api/mobile/auth/login", {
        method: "POST",
        body: {
            login: loginValue,
            senha: password
        }
    });

    storage.set(SESSION_KEY, data.user);
    setState({
        session: data.user,
        bootstrap: data.bootstrap
    });
    return data;
}

export async function restoreSession() {
    try {
        const data = await apiRequest("api/mobile/auth/session");
        storage.set(SESSION_KEY, data.user);
        setState({ session: data.user });
        return data.user;
    } catch (error) {
        storage.remove(SESSION_KEY);
        setState({ session: null });
        return null;
    }
}

export async function logout() {
    try {
        await apiRequest("api/mobile/auth/logout", {
            method: "POST"
        });
    } finally {
        storage.remove(SESSION_KEY);
        setState({
            session: null,
            bootstrap: null,
            visits: [],
            dashboard: null
        });
    }
}

export function getStoredSession() {
    return storage.get(SESSION_KEY);
}
