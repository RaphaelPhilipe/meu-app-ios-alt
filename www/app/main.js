import { initRouter, navigate } from "./core/router.js";
import { setState, state, subscribe } from "./core/store.js";
import { renderFrame } from "./components/layout.js";
import { renderLoader, renderToasts, setLoader, showToast } from "./components/ui.js";
import { renderSplash } from "./screens/splash.js";
import { renderLogin } from "./screens/login.js";
import { renderDashboard } from "./screens/dashboard.js";
import { renderVisits, renderVisitsList } from "./screens/visits.js";
import { renderSystem } from "./screens/system.js";
import { renderVisitDetail } from "./screens/visit-detail.js";
import { renderProfile } from "./screens/profile.js";
import { renderSettings } from "./screens/settings.js";
import { renderSupport } from "./screens/support.js";
import { renderAbout } from "./screens/about.js";
import { renderOffline } from "./screens/offline.js";
import { initNetworkMonitoring } from "./services/network.js";
import { flushQueue } from "./services/offline-queue.js";
import { apiRequest } from "./services/api.js";
import { login, logout, restoreSession } from "./services/auth.js";
import { APP_CONFIG } from "./core/config.js";
import { getCached, setCached } from "./services/cache.js";
import { storage } from "./services/storage.js";

const app = document.getElementById("app");

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

    app.after(renderToasts());
    app.after(renderLoader());

    subscribe(() => renderCurrentScreen());
    renderCurrentScreen();

    initRouter(async (route) => {
        if (route === "splash") {
            return;
        }
        renderCurrentScreen();
        await hydrateRoute(route);
    });

    initNetworkMonitoring(async () => {
        const result = await flushQueue(async (item) => {
            await apiRequest(item.endpoint, {
                method: item.method,
                body: item.body
            });
        });
        if (result.flushed) {
            showToast(`${result.flushed} operacao(oes) offline reenviadas.`, "success");
        }
    });

    const session = await restoreSession();
    setState({ systemModules: buildSystemModules(session) });
    if (session) {
        redirectToWebApp(APP_CONFIG.webAppEntryPath);
    } else {
        navigate("login");
    }
}

async function hydrateRoute(route) {
    try {
        setLoader(true);
        if (route === "dashboard") {
            const cached = getCached("dashboard");
            if (cached) {
                setState({ dashboard: cached });
            }
            if (!state.online && !cached) {
                navigate("offline");
                return;
            }
            const data = await apiRequest("api/mobile/dashboard");
            setCached("dashboard", data);
            setState({ dashboard: data });
            return;
        }

        if (route === "visits") {
            if (!state.online && !(state.visits || []).length) {
                navigate("offline");
                return;
            }
            const data = await apiRequest("api/mobile/visits");
            setState({ visits: data.items || [] });
            return;
        }

        if (route === "visit-detail" && state.visitDetailId) {
            const data = await apiRequest(`api/mobile/visits/show&id=${encodeURIComponent(state.visitDetailId)}`);
            setState({ visitDetail: data.item });
            return;
        }

        if (route === "profile") {
            const data = await apiRequest("api/mobile/profile");
            setState({ profile: data });
            return;
        }

        if (route === "settings") {
            const data = await apiRequest("api/mobile/settings");
            setState({ settings: data });
            return;
        }

        if (route === "support") {
            const data = await apiRequest("api/mobile/help");
            setState({ support: data });
            return;
        }

        if (route === "about") {
            const data = await apiRequest("api/mobile/about");
            setState({ about: data });
        }
    } catch (error) {
        if (error.code === "SESSION_EXPIRED") {
            showToast("Sessao expirada. Entre novamente.", "error");
            await logout();
            navigate("login");
            return;
        }
        showToast(error.message || "Nao foi possivel carregar os dados.", "error");
    } finally {
        setLoader(false);
        renderCurrentScreen();
    }
}

function renderCurrentScreen(overrideRoute = null) {
    const route = overrideRoute || state.currentRoute;
    const online = state.online;

    let content = renderSplash();
    if (route === "login") {
        content = renderLogin();
    } else if (route === "dashboard") {
        content = renderDashboard(state.session, state.dashboard, online);
    } else if (route === "visits") {
        content = renderVisits(state.visits);
    } else if (route === "system") {
        content = renderSystem(state.systemModules || []);
    } else if (route === "visit-detail") {
        content = renderVisitDetail(state.visitDetail);
    } else if (route === "profile") {
        content = renderProfile(state.profile);
    } else if (route === "settings") {
        content = renderSettings(state.settings);
    } else if (route === "support") {
        content = renderSupport(state.support);
    } else if (route === "about") {
        content = renderAbout(state.about);
    } else if (route === "offline") {
        content = renderOffline();
    }

    app.innerHTML = renderFrame(content);
    bindCommonEvents();
}

function bindCommonEvents() {
    document.querySelectorAll("[data-route]").forEach((button) => {
        button.addEventListener("click", () => {
            const route = button.getAttribute("data-route");
            navigate(route);
        });
    });

    document.querySelectorAll("[data-visit-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-visit-id");
            navigate("visit-detail", { id });
        });
    });

    const retryButton = document.getElementById("retry-connection");
    if (retryButton) {
        retryButton.addEventListener("click", () => navigate(state.session ? "dashboard" : "login"));
    }

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);
            try {
                setLoader(true);
                await login(formData.get("login"), formData.get("senha"));
                setState({ systemModules: buildSystemModules(state.session) });
                showToast("Login efetuado com sucesso.", "success");
                redirectToWebApp(APP_CONFIG.webAppEntryPath);
            } catch (error) {
                showToast(error.message || "Falha ao autenticar.", "error");
            } finally {
                setLoader(false);
            }
        });
    }

    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const passwordInput = document.getElementById("senha");
            if (!passwordInput) {
                return;
            }

            const show = passwordInput.type === "password";
            passwordInput.type = show ? "text" : "password";
            togglePassword.textContent = show ? "Ocultar" : "Ver";
        });
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            await logout();
            setState({ systemModules: [] });
            showToast("Sessao encerrada.", "success");
            navigate("login");
        });
    }

    document.querySelectorAll("[data-system-path]").forEach((button) => {
        button.addEventListener("click", () => {
            const path = button.getAttribute("data-system-path");
            if (path) {
                openSystemPage(path);
            }
        });
    });

    const searchInput = document.getElementById("visit-search");
    const statusSelect = document.getElementById("visit-status");
    if (searchInput && statusSelect) {
            const filterList = () => {
                const term = (searchInput.value || "").trim().toLowerCase();
                const status = statusSelect.value;
                const filtered = (state.visits || []).filter((item) => {
                    const matchTerm = !term || [item.cliente_nome, item.objetivo].some((value) => String(value || "").toLowerCase().includes(term));
                const matchStatus = !status || item.status === status;
                return matchTerm && matchStatus;
                });
                const container = document.getElementById("visits-list");
                if (container) {
                    container.innerHTML = renderVisitsList(filtered);
                    bindCommonEvents();
                }
            };
            searchInput.addEventListener("input", filterList);
            statusSelect.addEventListener("change", filterList);
    }
}

function openSystemPage(path) {
    const accessToken = storage.get("access_token");
    if (!accessToken) {
        showToast("Sessao mobile indisponivel. Entre novamente.", "error");
        return;
    }

    const cleanPath = String(path || "").replace(/^\/+/, "");
    const bridgeUrl = `${APP_CONFIG.apiBaseUrl}/index.php?r=api/mobile/auth/web-session&token=${encodeURIComponent(accessToken)}&redirect=${encodeURIComponent(cleanPath)}`;
    window.location.replace(bridgeUrl);
}

function redirectToWebApp(path) {
    openSystemPage(path || APP_CONFIG.webAppEntryPath);
}

function buildSystemModules(session) {
    const tipo = String(session?.tipo_usuario || "").toLowerCase();
    const modules = [
        { section: "Principal", label: "Dashboard", path: "index.php", description: "Tela inicial responsiva do sistema." },
        { section: "Principal", label: "Minhas Visitas", path: "minhas_visitas.php", description: "Lista completa de visitas." },
        { section: "Principal", label: "Agendar Visita", path: "gerenciar_visitas.php", description: "Cadastro e gestao de visitas." },
        { section: "Principal", label: "Carteira de Clientes", path: "carteira_clientes.php", description: "Clientes e carteira comercial." },
        { section: "Relatorios", label: "Relatorio de Visitas", path: "relatorio_visitas.php", description: "Relatorio detalhado." },
        { section: "Relatorios", label: "Agenda de Visitas", path: "agenda_visitas.php", description: "Agenda comercial responsiva." },
        { section: "Relatorios", label: "Historico Comercial", path: "historico_comercial.php", description: "Historico de relacionamento." },
        { section: "Relatorios", label: "SLA Comercial", path: "sla_comercial.php", description: "Indicadores e acompanhamento." },
        { section: "Operacao", label: "Ocorrencias", path: "ocorrencias.php", description: "Ocorrencias operacionais." },
        { section: "Operacao", label: "Reajuste de Frete", path: "reajuste_frete.php", description: "Solicitacoes e ajustes." },
        { section: "Operacao", label: "Notificacoes", path: "notificacoes.php", description: "Avisos e alertas do sistema." },
        { section: "Operacao", label: "Chat Interno", path: "chat_interno.php", description: "Comunicacao interna." },
        { section: "Configuracao", label: "Configuracoes", path: "configuracoes.php", description: "Preferencias do sistema." },
        { section: "Novas Areas", label: "Prospeccao", path: "prospeccao", description: "Modulo de prospeccao." },
        { section: "Novas Areas", label: "Oportunidades", path: "oportunidades", description: "Pipeline e oportunidades." },
        { section: "Novas Areas", label: "Operacional", path: "operacional", description: "Modulo operacional." }
    ];

    if (tipo === "admin" || tipo === "gerente") {
        modules.push(
            { section: "Gestao", label: "Solicitacoes", path: "solicitacoes_supervisor.php", description: "Liberacao e acompanhamento." },
            { section: "Gestao", label: "Mapa Supervisores", path: "mapa_visitas_supervisores.php", description: "Mapa de visitas de supervisao." },
            { section: "Gestao", label: "Gerenciar Clientes", path: "gerenciar_clientes.php", description: "Cadastro e manutencao de clientes." },
            { section: "Gestao", label: "Gerenciar Vendedores", path: "gerenciar_vendedores.php", description: "Administracao comercial." }
        );
    }

    return modules;
}
