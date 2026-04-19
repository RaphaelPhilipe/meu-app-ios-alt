import { escapeHtml } from "../utils/sanitize.js";

export function renderSettings(payload) {
    const items = payload?.toggles || [];
    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Configuracoes</h1>
                    <p>Preferencias do app, timeout e comportamento offline.</p>
                </div>
            </div>
            <div class="list">
                ${items.map((item) => `
                    <div class="settings-item">
                        <h3>${escapeHtml(item.label)}</h3>
                        <p class="muted">${item.enabled ? "Ativado por padrao" : "Desativado por padrao"}</p>
                    </div>
                `).join("")}
                <div class="settings-item">
                    <h3>Timeout da API</h3>
                    <p class="muted">${escapeHtml(payload?.limits?.api_timeout_seconds || 20)} segundos</p>
                </div>
                <div class="settings-item">
                    <h3>Retry automatico</h3>
                    <p class="muted">${escapeHtml(payload?.limits?.retry_attempts || 0)} tentativa(s)</p>
                </div>
            </div>
        </section>
    `;
}
