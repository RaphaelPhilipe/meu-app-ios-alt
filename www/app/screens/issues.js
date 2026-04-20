import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderIssues(payload) {
    const items = payload?.items || [];
    const total = Number(payload?.summary?.total || 0);

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>Ocorrencias</h1>
                    <p>${total} registro(s) visiveis para seu perfil.</p>
                </div>
                <button class="ghost-btn" type="button" data-system-path="ocorrencias.php">Abrir completo</button>
            </div>
            <div class="site-filter-card">
                <div class="site-filter-grid">
                    <input class="search-input" id="issue-search" type="search" placeholder="Buscar protocolo, cliente ou tipo">
                    <button class="btn" id="issue-search-button" type="button">Buscar</button>
                </div>
            </div>
            <div class="site-table-card">
                <div class="site-table-card__header">
                    <h2>Fila operacional</h2>
                </div>
                <div class="site-list">
                    ${items.length ? items.map((item) => `
                        <article class="site-list-row" data-issue-id="${item.id}">
                            <div class="site-list-row__main">
                                <strong>${escapeHtml(item.protocolo || "Sem protocolo")} - ${escapeHtml(item.tipo || "Ocorrencia")}</strong>
                                <p>${escapeHtml(item.descricao || "Sem descricao.")}</p>
                            </div>
                            <div class="site-list-row__meta">
                                <span class="site-badge ${statusTone(item.status || "")}">${escapeHtml(item.status || "-")}</span>
                                <span class="site-badge">${escapeHtml(item.cliente_nome || "-")}</span>
                                <span class="site-badge">${escapeHtml(formatDateTime(item.criado_em || ""))}</span>
                            </div>
                        </article>
                    `).join("") : `
                        <div class="empty-state">
                            <h2>Sem ocorrencias</h2>
                            <p>Nenhuma ocorrencia operacional foi localizada.</p>
                        </div>
                    `}
                </div>
            </div>
        </section>
    `;
}

export function renderIssueDetail(payload) {
    const item = payload?.issue || null;
    const history = payload?.history || [];
    if (!item) {
        return `
            <section class="screen">
                <div class="empty-state">
                    <h2>Ocorrencia nao encontrada</h2>
                    <p>O protocolo solicitado nao esta disponivel.</p>
                </div>
            </section>
        `;
    }

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>${escapeHtml(item.protocolo || "Ocorrencia")}</h1>
                    <p>${escapeHtml(item.cliente_nome || "-")} | ${escapeHtml(item.tipo || "-")}</p>
                </div>
                <button class="ghost-btn" type="button" data-route="issues">Voltar</button>
            </div>
            <div class="site-table-card">
                <div class="detail-grid">
                    <div class="kv"><strong>Status</strong><span>${escapeHtml(item.status || "-")}</span></div>
                    <div class="kv"><strong>Supervisor</strong><span>${escapeHtml(item.supervisor_nome || "-")}</span></div>
                    <div class="kv"><strong>Responsavel</strong><span>${escapeHtml(item.responsavel_nome || "-")}</span></div>
                    <div class="kv"><strong>Abertura</strong><span>${escapeHtml(formatDateTime(item.criado_em || ""))}</span></div>
                </div>
                <div class="site-description-block">
                    <strong>Descricao</strong>
                    <p>${escapeHtml(item.descricao || "-")}</p>
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
                            <p>${escapeHtml(entry.detalhes || "-")}</p>
                            <span>${escapeHtml(entry.usuario_nome || "-")} | ${escapeHtml(formatDateTime(entry.criado_em || ""))}</span>
                        </article>
                    `).join("") : `<p class="site-empty-inline">Sem historico recente.</p>`}
                </div>
            </div>
        </section>
    `;
}

function statusTone(status) {
    const normalized = String(status).toLowerCase();
    if (normalized.includes("aberta")) {
        return "danger";
    }
    if (normalized.includes("analise")) {
        return "warning";
    }
    if (normalized.includes("resolvida")) {
        return "success";
    }
    return "";
}
