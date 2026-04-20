import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderVisits(items = []) {
    const list = renderVisitsList(items);

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>Minhas visitas</h1>
                    <p>Consulta operacional no visual do responsivo.</p>
                </div>
            </div>
            <div class="site-filter-card">
                <div class="site-filter-grid">
                    <input class="search-input" id="visit-search" type="search" placeholder="Buscar cliente ou objetivo">
                    <select id="visit-status">
                        <option value="">Todos</option>
                        <option value="Pendente">Pendentes</option>
                        <option value="Realizada">Realizadas</option>
                        <option value="Atrasada">Atrasadas</option>
                    </select>
                </div>
            </div>
            <div class="site-table-card">
                <div class="site-table-card__header">
                    <h2>Agenda de visitas</h2>
                </div>
                <div class="site-list" id="visits-list">${list}</div>
            </div>
        </section>
    `;
}

export function renderVisitsList(items = []) {
    if (!items.length) {
        return `
            <div class="empty-state">
                <h2>Nenhuma visita encontrada</h2>
                <p>Experimente buscar por cliente ou trocar o status das visitas.</p>
            </div>
        `;
    }

    return items.map((item) => `
        <article class="site-list-row" data-visit-id="${item.id}">
            <div class="site-list-row__main">
                <strong>${escapeHtml(item.cliente_nome || "Cliente sem nome")}</strong>
                <p>${escapeHtml(item.objetivo || "Sem objetivo informado.")}</p>
            </div>
            <div class="site-list-row__meta">
                <span class="site-badge">${escapeHtml(formatDateTime(item.data_visita, item.hora_visita || ""))}</span>
                <span class="site-badge">${escapeHtml(item.vendedor_nome || "-")}</span>
                <span class="site-badge ${statusTone(item.status || "")}">${escapeHtml(item.status || "-")}</span>
            </div>
        </article>
    `).join("");
}

function statusTone(status) {
    if (status === "Atrasada") {
        return "danger";
    }
    if (status === "Pendente") {
        return "warning";
    }
    if (status === "Realizada") {
        return "success";
    }
    return "";
}
