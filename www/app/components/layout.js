import { state } from "../core/store.js";
import { icon } from "./ui.js";

export function renderFrame(content) {
    if (!state.session) {
        return content;
    }

    const menuSections = buildMenuSections(state.bootstrap?.navigation?.sections || []);
    const drawerClass = state.drawerOpen ? "drawer-shell open" : "drawer-shell";

    return `
        <div class="${drawerClass}">
            <header class="topbar">
                <button class="topbar-button" id="menu-toggle" type="button" aria-label="Abrir menu">
                    <span class="icon">${icon("menu")}</span>
                </button>
                <div class="topbar-brand">
                    <img src="./assets/images/sigev-alt-logo.png" alt="SIGEV ALT" class="topbar-brand__logo">
                    <div>
                        <strong>${state.bootstrap?.branding?.system_name || "SIGEV ALT"}</strong>
                        <span>${state.session?.nome || "Usuario"}</span>
                    </div>
                </div>
                <div class="topbar-status ${state.online ? "online" : "offline"}">${state.online ? "Online" : "Offline"}</div>
            </header>
            <div class="drawer-backdrop" data-drawer-close="true"></div>
            <aside class="drawer-panel">
                <div class="drawer-panel__header">
                    <div>
                        <div class="drawer-company">${state.bootstrap?.app?.name || "SIGEV ALT"}</div>
                        <div class="drawer-company-subtitle">${state.bootstrap?.branding?.company_name || "RPGC Systems"}</div>
                    </div>
                    <button class="topbar-button" data-drawer-close="true" type="button" aria-label="Fechar menu">
                        <span class="icon">${icon("close")}</span>
                    </button>
                </div>
                <nav class="drawer-nav">
                    ${menuSections}
                </nav>
                <div class="drawer-footer">
                    <button class="ghost-btn full" id="logout-button" type="button">Sair</button>
                </div>
            </aside>
            <main class="app-content">${content}</main>
        </div>
    `;
}

function buildMenuSections(sections) {
    return sections.map((section) => `
        <div class="drawer-section">
            <div class="drawer-section__title">${section.title || "Menu"}</div>
            <div class="drawer-section__items">
                ${(section.items || []).map((item) => menuButton(item)).join("")}
            </div>
        </div>
    `).join("");
}

function menuButton(item) {
    const route = normalizeItemRoute(item);
    const active = state.currentRoute === route ? "active" : "";
    return `
        <button class="drawer-link ${active}" data-route="${route}" type="button">
            <span class="drawer-link__icon">${icon(item.icon || "grid")}</span>
            <span class="drawer-link__body">
                <strong>${item.label || "Modulo"}</strong>
                <span>${item.implemented ? "Tela local pronta" : "Abrir modulo web responsivo"}</span>
            </span>
        </button>
    `;
}

function normalizeItemRoute(item) {
    if (item?.screen === "priceAdjustments") {
        return "freight-adjustments";
    }
    if (item?.screen === "help") {
        return "support";
    }
    return item?.screen || "dashboard";
}
