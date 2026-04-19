import { state } from "../core/store.js";
import { icon } from "./ui.js";

export function renderFrame(content) {
    const tabBar = state.session ? `
        <nav class="tab-bar">
            ${tabButton("dashboard", "Inicio", "house")}
            ${tabButton("visits", "Visitas", "calendar")}
            ${tabButton("system", "Sistema", "grid")}
            ${tabButton("profile", "Conta", "person")}
            ${tabButton("settings", "Ajustes", "sliders")}
        </nav>
    ` : "";

    return `${content}${tabBar}`;
}

function tabButton(route, label, iconName) {
    const active = state.currentRoute === route ? "active" : "";
    return `
        <button class="tab-button ${active}" data-route="${route}" type="button">
            <span class="icon">${icon(iconName)}</span>
            <span>${label}</span>
        </button>
    `;
}
