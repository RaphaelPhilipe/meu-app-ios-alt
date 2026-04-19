import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderDashboard(session, dashboard, online) {
    const metrics = (dashboard?.metrics || []).map((metric) => `
        <div class="metric-card">
            <div class="metric-label">${escapeHtml(metric.label)}</div>
            <div class="metric-value">${escapeHtml(metric.value)}</div>
        </div>
    `).join("");

    const visits = dashboard?.upcoming_visits?.length ? dashboard.upcoming_visits.map((item) => `
        <article class="list-item" data-visit-id="${item.id}">
            <h3>${escapeHtml(item.cliente_nome || "Cliente sem nome")}</h3>
            <p>${escapeHtml(item.objetivo || "Sem objetivo informado.")}</p>
            <div class="list-meta">
                <span class="pill ${pillTone(item.status)}">${escapeHtml(item.status)}</span>
                <span class="pill">${escapeHtml(formatDateTime(item.data_visita, item.hora_visita || ""))}</span>
                <span class="pill">${escapeHtml(item.vendedor_nome || "-")}</span>
            </div>
        </article>
    `).join("") : `
        <div class="empty-state">
            <h2>Nenhuma visita proxima</h2>
            <p>Quando surgirem visitas pendentes ou atrasadas, elas aparecerao aqui.</p>
        </div>
    `;

    return `
        <section class="screen">
            <div class="hero-card">
                <div class="screen-header">
                    <div>
                        <div class="badge">${online ? "Online" : "Offline"}</div>
                        <h1>Ola, ${escapeHtml(session?.nome || "usuario")}</h1>
                        <p>Resumo rapido do dia com foco em mobilidade e leitura facil.</p>
                    </div>
                </div>
            </div>
            <div class="grid-metrics">${metrics}</div>
            <div class="card">
                <div class="section-title">
                    <h2>Proximas visitas</h2>
                    <button class="ghost-btn" type="button" data-route="visits">Ver lista</button>
                </div>
                <div class="list">${visits}</div>
            </div>
        </section>
    `;
}

function pillTone(status) {
    const map = {
        Realizada: "success",
        Pendente: "warning",
        Atrasada: "danger"
    };
    return map[status] || "";
}
