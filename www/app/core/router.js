import { setState, state } from "./store.js";

const protectedRoutes = new Set(["dashboard", "visits", "profile", "settings", "support", "about", "visit-detail"]);

export function initRouter(onRouteChange) {
    window.addEventListener("hashchange", () => handleRoute(onRouteChange));
    handleRoute(onRouteChange);
}

export function navigate(route, params = {}) {
    const hash = new URLSearchParams({ route, ...params });
    window.location.hash = hash.toString();
}

export function readRoute() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return {
        route: params.get("route") || "splash",
        params
    };
}

function handleRoute(onRouteChange) {
    const { route, params } = readRoute();
    const target = protectedRoutes.has(route) && !state.session ? "login" : route;
    setState({
        currentRoute: target,
        visitDetailId: params.get("id")
    });
    onRouteChange(target, params);
}
