import { formatDate, formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderFreightAdjustments(payload) {
    const items = payload?.items || [];
    const total = Number(payload?.summary?.total || 0);

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>Reajuste de frete</h1>
                    <p>${total} solicitacao(oes) encontradas.</p>
                </div>
                <button class="ghost-btn" type="button" data-system-path="reajuste_frete.php">Abrir completo</button>
            </div>
            <div class="site-filter-card">
                <div class="site-filter-grid">
                    <input class="search-input" id="freight-search" type="search" placeholder="Buscar cliente, vendedor ou motivo">
                    <button class="btn" id="freight-search-button" type="button">Buscar</button>
                </div>
            </div>
            <div class="site-table-card">
                <div class="site-table-card__header">
                    <h2>Solicitacoes</h2>
                </div>
                <div class="site-list">
                    ${items.length ? items.map((item) => `
                        <article class="site-list-row" data-freight-id="${item.id}">
                            <div class="site-list-row__main">
                                <strong>${escapeHtml(item.cliente_nome || "Cliente")} - ${escapeHtml(item.status || "-")}</strong>
                                <p>${escapeHtml(item.motivo || "Motivo nao informado.")}</p>
                            </div>
                            <div class="site-list-row__meta">
                                <span class="site-badge">${escapeHtml(item.vendedor_nome || "-")}</span>
                                <span class="site-badge">${escapeHtml(item.gerente_nome || "-")}</span>
                                <span class="site-badge">${escapeHtml(formatDate(item.data_solicitacao || ""))}</span>
                            </div>
                        </article>
                    `).join("") : `
                        <div class="empty-state">
                            <h2>Sem reajustes</h2>
                            <p>Nenhuma solicitacao de reajuste foi localizada.</p>
                        </div>
                    `}
                </div>
            </div>
        </section>
    `;
}

export function renderFreightAdjustmentDetail(payload) {
    const item = payload?.adjustment || null;
    const history = payload?.history || [];
    if (!item) {
        return `
            <section class="screen">
                <div class="empty-state">
                    <h2>Reajuste nao encontrado</h2>
                    <p>O registro solicitado nao esta disponivel.</p>
                </div>
            </section>
        `;
    }

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>${escapeHtml(item.cliente_nome || "Reajuste")}</h1>
                    <p>${escapeHtml(item.status || "-")} | ${escapeHtml(item.tipo_solicitacao || "-")}</p>
                </div>
                <button class="ghost-btn" type="button" data-route="freight-adjustments">Voltar</button>
            </div>
            <div class="site-table-card">
                <div class="detail-grid">
                    <div class="kv"><strong>Vendedor</strong><span>${escapeHtml(item.vendedor_nome || "-")}</span></div>
                    <div class="kv"><strong>Gerente</strong><span>${escapeHtml(item.gerente_nome || "-")}</span></div>
                    <div class="kv"><strong>Supervisor</strong><span>${escapeHtml(item.supervisor_nome || "-")}</span></div>
                    <div class="kv"><strong>Solicitacao</strong><span>${escapeHtml(formatDateTime(item.data_solicitacao || ""))}</span></div>
                    <div class="kv"><strong>Vencimento</strong><span>${escapeHtml(formatDate(item.data_vencimento || ""))}</span></div>
                    <div class="kv"><strong>Cliente</strong><span>${escapeHtml(item.cliente_nome || "-")}</span></div>
                </div>
                <div class="site-description-block">
                    <strong>Motivo</strong>
                    <p>${escapeHtml(item.motivo || "-")}</p>
                </div>
            </div>
            <div class="site-table-card">
                <div class="site-table-card__header">
                    <h2>Historico</h2>
                </div>
                <div class="site-list">
                    ${history.length ? history.map((entry) => `
                        <article class="site-history-row">
                            <strong>${escapeHtml(entry.acao || "-")}</strong>
                            <p>${escapeHtml(entry.descricao || "-")}</p>
                            <span>${escapeHtml(entry.usuario_nome || "-")} | ${escapeHtml(formatDateTime(entry.data || ""))}</span>
                        </article>
                    `).join("") : `<p class="site-empty-inline">Sem historico recente.</p>`}
                </div>
            </div>
        </section>
    `;
}
