import { formatDate } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderAgenda(payload) {
    const filters = payload?.filters || {};
    const items = payload?.days || [];

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Agenda</h1>
                    <p>Sugestoes de visitas para ${escapeHtml(String(filters.month || ""))}/${escapeHtml(String(filters.year || ""))}</p>
                </div>
                <button class="btn" id="agenda-schedule" type="button">Agendar mes</button>
            </div>
            <div class="card">
                <div class="detail-grid">
                    <div class="kv"><strong>Vendedor</strong><span>${escapeHtml(payload?.seller?.nome || "-")}</span></div>
                    <div class="kv"><strong>Criterio</strong><span>${escapeHtml(filters.criteria || "-")}</span></div>
                </div>
            </div>
            <div class="list">
                ${items.length ? items.map((day) => `
                    <article class="list-item">
                        <h3>${escapeHtml(formatDate(day.date || ""))}</h3>
                        <p>${escapeHtml(String(day.count || 0))} visita(s) sugerida(s)</p>
                        <div class="list-meta">
                            ${(day.items || []).slice(0, 5).map((item) => `<span class="pill">${escapeHtml(item.nome || item.cliente_nome || "Cliente")}</span>`).join("")}
                        </div>
                    </article>
                `).join("") : `
                    <div class="empty-state">
                        <h2>Sem sugestoes</h2>
                        <p>Nenhuma agenda sugerida foi retornada para os filtros atuais.</p>
                    </div>
                `}
            </div>
        </section>
    `;
}
