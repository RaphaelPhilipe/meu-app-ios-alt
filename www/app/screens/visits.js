import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderVisits(items = []) {
    const list = renderVisitsList(items);

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Visitas</h1>
                    <p>Lista mobile com busca local, estado vazio e abertura de detalhe.</p>
                </div>
            </div>
            <div class="card">
                <div class="search-row">
                    <input class="search-input" id="visit-search" type="search" placeholder="Buscar cliente ou objetivo">
                    <select id="visit-status">
                        <option value="">Todos</option>
                        <option value="Pendente">Pendentes</option>
                        <option value="Realizada">Realizadas</option>
                        <option value="Atrasada">Atrasadas</option>
                    </select>
                </div>
            </div>
            <div class="list" id="visits-list">${list}</div>
        </section>
    `;
}

export function renderVisitsList(items = []) {
    if (!items.length) {
        return `
            <div class="empty-state">
                <h2>Nenhum dado encontrado</h2>
                <p>Experimente buscar por cliente ou trocar o status das visitas.</p>
            </div>
        `;
    }

    return items.map((item) => `
        <article class="list-item" data-visit-id="${item.id}">
            <h3>${escapeHtml(item.cliente_nome || "Cliente sem nome")}</h3>
            <p>${escapeHtml(item.objetivo || "Sem objetivo informado.")}</p>
            <div class="list-meta">
                <span class="pill">${escapeHtml(formatDateTime(item.data_visita, item.hora_visita || ""))}</span>
                <span class="pill">${escapeHtml(item.vendedor_nome || "-")}</span>
                <span class="pill">${escapeHtml(item.status || "-")}</span>
            </div>
        </article>
    `).join("");
}
