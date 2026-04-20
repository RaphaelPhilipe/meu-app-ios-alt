import { renderFrame } from "./components/layout.js";
import { renderLoader, renderToasts, setLoader, showToast } from "./components/ui.js";
import { APP_CONFIG, resolveWebUrl } from "./core/config.js";
import { initRouter, navigate, readRoute } from "./core/router.js";
import { setState, state, subscribe } from "./core/store.js";
import { renderAbout } from "./screens/about.js";
import { renderAgenda } from "./screens/agenda.js";
import { renderCustomers } from "./screens/customers.js";
import { renderDashboard } from "./screens/dashboard.js";
import { renderFreightAdjustments } from "./screens/freight-adjustments.js";
import { renderIssues } from "./screens/issues.js";
import { renderLogin } from "./screens/login.js";
import { renderNotifications } from "./screens/notifications.js";
import { renderProfile } from "./screens/profile.js";
import { renderSettings } from "./screens/settings.js";
import { renderSplash } from "./screens/splash.js";
import { renderSupport } from "./screens/support.js";
import { renderSystem } from "./screens/system.js";
import { renderVisitDetail } from "./screens/visit-detail.js";
import { renderVisits, renderVisitsList } from "./screens/visits.js";
import { apiRequest } from "./services/api.js";
import { login, logout, restoreSession } from "./services/auth.js";
import { getCached, setCached } from "./services/cache.js";
import { initNetworkMonitoring } from "./services/network.js";
import { flushQueue } from "./services/offline-queue.js";
import { storage } from "./services/storage.js";

const app = document.getElementById("app");
const ACCESS_TOKEN_KEY = "access_token";

document.addEventListener("deviceready", boot, false);
window.addEventListener("load", () => {
    if (!window.cordova) {
        boot();
    }
});

async function boot() {
    if (boot.done) {
        return;
    }
    boot.done = true;

    if (!app) {
        return;
    }

    app.innerHTML = renderSplash();
    document.body.append(renderToasts(), renderLoader());

    subscribe(() => renderCurrentRoute());
    initRouter(async (route) => {
        await ensureRouteData(route);
        renderCurrentRoute();
    });
    initNetworkMonitoring(async () => {
        await flushQueue((item) => apiRequest(item.endpoint, {
            method: item.method,
            body: item.body
        }));
        showToast("Conexao restabelecida.", "success");
    });

    const restored = await restoreSession();
    if (restored) {
        await loadBootstrap();
        await preloadHomeData();
        const current = readRoute().route;
        navigate(current === "login" || current === "splash" ? defaultRoute() : current, routeParamsToObject(readRoute().params));
        return;
    }

    navigate("login");
}

function renderCurrentRoute() {
    if (!app) {
        return;
    }

    let markup = "";

    switch (state.currentRoute) {
        case "login":
            markup = renderLogin();
            break;
        case "dashboard":
            markup = renderDashboard(state.session, state.dashboard, state.online);
            break;
        case "visits":
            markup = renderVisits(state.visits);
            break;
        case "visit-detail":
            markup = renderVisitDetail(state.visitDetail);
            break;
        case "notifications":
            markup = renderNotifications(state.notifications);
            break;
        case "agenda":
            markup = renderAgenda(state.agenda);
            break;
        case "customers":
            markup = renderCustomers(state.customers);
            break;
        case "issues":
            markup = renderIssues(state.issues);
            break;
        case "freight-adjustments":
            markup = renderFreightAdjustments(state.freightAdjustments);
            break;
        case "profile":
            markup = renderProfile(state.profile);
            break;
        case "settings":
            markup = renderSettings(state.settings);
            break;
        case "support":
            markup = renderSupport(state.help);
            break;
        case "about":
            markup = renderAbout(state.about);
            break;
        case "system":
            markup = renderSystem(flattenModules(state.bootstrap?.navigation?.sections || []));
            break;
        default:
            markup = renderSplash();
            break;
    }

    app.innerHTML = renderFrame(markup);
    bindEvents();
}

function bindEvents() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const input = document.getElementById("senha");
            if (!input) {
                return;
            }
            input.type = input.type === "password" ? "text" : "password";
        });
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    const menuToggle = document.getElementById("menu-toggle");
    if (menuToggle) {
        menuToggle.addEventListener("click", () => setState({ drawerOpen: true }));
    }

    document.querySelectorAll("[data-drawer-close='true']").forEach((node) => {
        node.addEventListener("click", () => setState({ drawerOpen: false }));
    });

    document.querySelectorAll("[data-route]").forEach((node) => {
        node.addEventListener("click", () => {
            const route = node.getAttribute("data-route");
            setState({ drawerOpen: false });
            navigate(route || defaultRoute());
        });
    });

    document.querySelectorAll("[data-visit-id]").forEach((node) => {
        node.addEventListener("click", () => {
            const visitId = node.getAttribute("data-visit-id");
            if (visitId) {
                navigate("visit-detail", { id: visitId });
            }
        });
    });

    document.querySelectorAll("[data-system-path]").forEach((node) => {
        node.addEventListener("click", () => {
            const path = node.getAttribute("data-system-path");
            if (path) {
                openSystemRoute(path);
            }
        });
    });

    const visitSearch = document.getElementById("visit-search");
    const visitStatus = document.getElementById("visit-status");
    if (visitSearch && visitStatus) {
        const updateVisits = async () => {
            const payload = await fetchVisits({
                q: visitSearch.value,
                status: visitStatus.value
            }, true);
            const list = document.getElementById("visits-list");
            if (list) {
                list.innerHTML = renderVisitsList(payload.items || []);
                bindEvents();
            }
        };
        visitSearch.addEventListener("input", debounce(updateVisits, 300));
        visitStatus.addEventListener("change", updateVisits);
    }

    bindSearchButton("customer-search-button", "customer-search", async (value) => {
        await fetchCustomers({ q: value }, true);
        renderCurrentRoute();
    });
    bindSearchButton("issue-search-button", "issue-search", async (value) => {
        await fetchIssues({ q: value }, true);
        renderCurrentRoute();
    });
    bindSearchButton("freight-search-button", "freight-search", async (value) => {
        await fetchFreightAdjustments({ q: value }, true);
        renderCurrentRoute();
    });

    const readAll = document.getElementById("notifications-read-all");
    if (readAll) {
        readAll.addEventListener("click", async () => {
            await apiRequest("api/mobile/notifications/read-all", { method: "POST", body: {} });
            await fetchNotifications(true);
            renderCurrentRoute();
        });
    }

    document.querySelectorAll("[data-mark-notification]").forEach((node) => {
        node.addEventListener("click", async () => {
            const id = Number(node.getAttribute("data-mark-notification"));
            if (!id) {
                return;
            }
            await apiRequest("api/mobile/notifications/read", { method: "POST", body: { id } });
            await fetchNotifications(true);
            renderCurrentRoute();
        });
    });

    const agendaSchedule = document.getElementById("agenda-schedule");
    if (agendaSchedule) {
        agendaSchedule.addEventListener("click", async () => {
            if (!state.agenda?.filters) {
                return;
            }
            setLoader(true);
            try {
                await apiRequest("api/mobile/agenda/schedule", {
                    method: "POST",
                    body: state.agenda.filters,
                    queueable: true
                });
                showToast("Agenda enviada para processamento.", "success");
            } catch (error) {
                showToast(error.message || "Nao foi possivel agendar.", "error");
            } finally {
                setLoader(false);
            }
        });
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const loginInput = document.getElementById("login");
    const passwordInput = document.getElementById("senha");
    const loginValue = loginInput?.value?.trim() || "";
    const passwordValue = passwordInput?.value || "";

    if (!loginValue || !passwordValue) {
        showToast("Informe usuario e senha.", "error");
        return;
    }

    setLoader(true);
    try {
        const data = await login(loginValue, passwordValue);
        setState({
            bootstrap: data.bootstrap,
            systemModules: flattenModules(data.bootstrap?.navigation?.sections || []),
            drawerOpen: false
        });
        await preloadHomeData();
        showToast("Login realizado com sucesso.", "success");
        navigate(defaultRoute());
    } catch (error) {
        showToast(error.message || "Falha ao autenticar.", "error");
    } finally {
        setLoader(false);
    }
}

async function handleLogout() {
    setLoader(true);
    try {
        await logout();
        clearCachedAppData();
        showToast("Sessao encerrada.", "info");
        navigate("login");
    } finally {
        setLoader(false);
    }
}

async function ensureRouteData(route) {
    if (!state.session) {
        return;
    }

    switch (route) {
        case "dashboard":
            if (!state.dashboard) {
                await fetchDashboard();
            }
            break;
        case "visits":
            if (!state.visits.length) {
                await fetchVisits();
            }
            break;
        case "visit-detail":
            await fetchVisitDetail(state.visitDetailId);
            break;
        case "notifications":
            if (!state.notifications) {
                await fetchNotifications();
            }
            break;
        case "agenda":
            if (!state.agenda) {
                await fetchAgenda();
            }
            break;
        case "customers":
            if (!state.customers) {
                await fetchCustomers();
            }
            break;
        case "issues":
            if (!state.issues) {
                await fetchIssues();
            }
            break;
        case "freight-adjustments":
            if (!state.freightAdjustments) {
                await fetchFreightAdjustments();
            }
            break;
        case "profile":
            if (!state.profile) {
                await fetchProfile();
            }
            break;
        case "settings":
            if (!state.settings) {
                await fetchSettings();
            }
            break;
        case "support":
            if (!state.help) {
                await fetchHelp();
            }
            break;
        case "about":
            if (!state.about) {
                await fetchAbout();
            }
            break;
        default:
            break;
    }
}

async function preloadHomeData() {
    await Promise.all([
        fetchDashboard(),
        fetchVisits(),
        fetchProfile(),
        fetchSettings(),
        fetchHelp(),
        fetchAbout(),
        fetchNotifications(),
        fetchAgenda(),
        fetchCustomers(),
        fetchIssues(),
        fetchFreightAdjustments()
    ]);
}

async function loadBootstrap(force = false) {
    const cached = !force ? getCached("bootstrap") : null;
    if (cached) {
        setState({
            bootstrap: cached,
            systemModules: flattenModules(cached.navigation?.sections || [])
        });
        return cached;
    }

    const payload = await apiRequest("api/mobile/bootstrap");
    setCached("bootstrap", payload);
    setState({
        bootstrap: payload,
        systemModules: flattenModules(payload.navigation?.sections || [])
    });
    return payload;
}

async function fetchDashboard(force = false) {
    const payload = await fetchWithCache("dashboard", "api/mobile/dashboard", force);
    setState({ dashboard: payload });
    return payload;
}

async function fetchVisits(filters = {}, force = false) {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `api/mobile/visits&${query}` : "api/mobile/visits";
    const payload = await fetchWithCache(`visits:${query || "all"}`, endpoint, force);
    setState({ visits: payload.items || [] });
    return payload;
}

async function fetchVisitDetail(id) {
    if (!id) {
        setState({ visitDetail: null });
        return null;
    }
    const payload = await fetchWithCache(`visit:${id}`, `api/mobile/visits/show&id=${encodeURIComponent(id)}`, true);
    setState({ visitDetail: payload.item || null });
    return payload;
}

async function fetchNotifications(force = false) {
    const payload = await fetchWithCache("notifications", "api/mobile/notifications", force);
    setState({ notifications: payload });
    return payload;
}

async function fetchAgenda(force = false) {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const payload = await fetchWithCache(`agenda:${month}:${year}`, `api/mobile/agenda&month=${month}&year=${year}`, force);
    setState({ agenda: payload });
    return payload;
}

async function fetchCustomers(filters = {}, force = false) {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `api/mobile/customers&${query}` : "api/mobile/customers";
    const payload = await fetchWithCache(`customers:${query || "all"}`, endpoint, force);
    setState({ customers: payload });
    return payload;
}

async function fetchIssues(filters = {}, force = false) {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `api/mobile/issues&${query}` : "api/mobile/issues";
    const payload = await fetchWithCache(`issues:${query || "all"}`, endpoint, force);
    setState({ issues: payload });
    return payload;
}

async function fetchFreightAdjustments(filters = {}, force = false) {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `api/mobile/freight-adjustments&${query}` : "api/mobile/freight-adjustments";
    const payload = await fetchWithCache(`freight:${query || "all"}`, endpoint, force);
    setState({ freightAdjustments: payload });
    return payload;
}

async function fetchProfile(force = false) {
    const payload = await fetchWithCache("profile", "api/mobile/profile", force);
    setState({ profile: payload });
    return payload;
}

async function fetchSettings(force = false) {
    const payload = await fetchWithCache("settings", "api/mobile/settings", force);
    setState({ settings: payload });
    return payload;
}

async function fetchHelp(force = false) {
    const payload = await fetchWithCache("help", "api/mobile/help", force);
    setState({ help: payload });
    return payload;
}

async function fetchAbout(force = false) {
    const payload = await fetchWithCache("about", "api/mobile/about", force);
    setState({ about: payload });
    return payload;
}

async function fetchWithCache(cacheKey, endpoint, force = false) {
    const cached = !force ? getCached(cacheKey) : null;
    if (cached) {
        return cached;
    }
    const payload = await apiRequest(endpoint);
    setCached(cacheKey, payload);
    return payload;
}

function flattenModules(sections) {
    return sections.flatMap((section) => (section.items || []).map((item) => ({
        ...item,
        section: section.title,
        path: item.web_route || item.screen || ""
    })));
}

function bindSearchButton(buttonId, inputId, handler) {
    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    if (!button || !input) {
        return;
    }

    const execute = async () => {
        setLoader(true);
        try {
            await handler(input.value.trim());
        } finally {
            setLoader(false);
        }
    };

    button.addEventListener("click", execute);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            execute();
        }
    });
}

function openSystemRoute(path) {
    const token = storage.get(ACCESS_TOKEN_KEY);
    if (!token) {
        showToast("Sessao nao encontrada para abrir o modulo web.", "error");
        return;
    }

    const redirectPath = String(path).replace(/^\/+/, "") || APP_CONFIG.webAppEntryPath;
    const endpoint = `${APP_CONFIG.webSessionEndpoint}&token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}`;
    const url = resolveWebUrl(`index.php?r=${endpoint}`);

    if (window.cordova?.InAppBrowser) {
        window.cordova.InAppBrowser.open(url, "_blank", "location=yes,toolbar=yes,presentationstyle=pagesheet");
        return;
    }

    window.open(url, "_blank");
}

function clearCachedAppData() {
    [
        "bootstrap",
        "dashboard",
        "notifications",
        "profile",
        "settings",
        "help",
        "about"
    ].forEach((key) => storage.remove(`cache:${key}`));
}

function defaultRoute() {
    return state.bootstrap?.navigation?.default_route || "dashboard";
}

function routeParamsToObject(params) {
    return Object.fromEntries(params.entries());
}

function debounce(fn, wait) {
    let timeoutId = 0;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => fn(...args), wait);
    };
}
