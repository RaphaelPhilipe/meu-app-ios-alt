import { formatDate } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderFreightAdjustments(payload) {
    const items = payload?.items || [];
    const total = Number(payload?.summary?.total || 0);

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Reajuste de frete</h1>
                    <p>${total} solicitacao(oes) encontradas.</p>
                </div>
            </div>
            <div class="card">
                <div class="search-row">
                    <input class="search-input" id="freight-search" type="search" placeholder="Buscar cliente, vendedor ou motivo">
                    <button class="btn" id="freight-search-button" type="button">Buscar</button>
                </div>
            </div>
            <div class="list">
                ${items.length ? items.map((item) => `
                    <article class="list-item">
                        <h3>${escapeHtml(item.cliente_nome || "Cliente")} - ${escapeHtml(item.status || "-")}</h3>
                        <p>${escapeHtml(item.motivo || "Motivo nao informado.")}</p>
                        <div class="list-meta">
                            <span class="pill">${escapeHtml(item.vendedor_nome || "-")}</span>
                            <span class="pill">${escapeHtml(item.gerente_nome || "-")}</span>
                            <span class="pill">${escapeHtml(formatDate(item.data_solicitacao || ""))}</span>
                        </div>
                    </article>
                `).join("") : `
                    <div class="empty-state">
                        <h2>Sem reajustes</h2>
                        <p>Nenhuma solicitacao de reajuste foi localizada.</p>
                    </div>
                `}
            </div>
        </section>
    `;
}
