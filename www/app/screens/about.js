import { escapeHtml } from "../utils/sanitize.js";

export function renderAbout(payload) {
    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Sobre o app</h1>
                    <p>Uma camada mobile propria, pensada para iOS e integrada ao CRM por API.</p>
                </div>
            </div>
            <div class="card">
                <h2>${escapeHtml(payload?.name || "SIGEV Mobile")}</h2>
                <p>${escapeHtml(payload?.description || "")}</p>
            </div>
            <div class="card">
                <h2>Dados tratados</h2>
                <div class="list-meta">
                    ${(payload?.privacy?.collects || []).map((entry) => `<span class="pill">${escapeHtml(entry)}</span>`).join("")}
                </div>
            </div>
            <div class="card">
                <h2>Dados nao tratados</h2>
                <div class="list-meta">
                    ${(payload?.privacy?.does_not_collect || []).map((entry) => `<span class="pill">${escapeHtml(entry)}</span>`).join("")}
                </div>
            </div>
        </section>
    `;
}
