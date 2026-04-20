import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderIssues(payload) {
    const items = payload?.items || [];
    const total = Number(payload?.summary?.total || 0);

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Ocorrencias</h1>
                    <p>${total} registro(s) visiveis para seu perfil.</p>
                </div>
            </div>
            <div class="card">
                <div class="search-row">
                    <input class="search-input" id="issue-search" type="search" placeholder="Buscar protocolo, cliente ou tipo">
                    <button class="btn" id="issue-search-button" type="button">Buscar</button>
                </div>
            </div>
            <div class="list">
                ${items.length ? items.map((item) => `
                    <article class="list-item">
                        <h3>${escapeHtml(item.protocolo || "Sem protocolo")} - ${escapeHtml(item.tipo || "Ocorrencia")}</h3>
                        <p>${escapeHtml(item.descricao || "Sem descricao.")}</p>
                        <div class="list-meta">
                            <span class="pill">${escapeHtml(item.status || "-")}</span>
                            <span class="pill">${escapeHtml(item.cliente_nome || "-")}</span>
                            <span class="pill">${escapeHtml(formatDateTime(item.criado_em || ""))}</span>
                        </div>
                    </article>
                `).join("") : `
                    <div class="empty-state">
                        <h2>Sem ocorrencias</h2>
                        <p>Nenhuma ocorrencia operacional foi localizada.</p>
                    </div>
                `}
            </div>
        </section>
    `;
}
