import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderDashboard(session, dashboard, online) {
    const total = Number(dashboard?.metrics?.find((item) => item.label === "Total")?.value || 0);
    const hoje = Number(dashboard?.metrics?.find((item) => item.label === "Hoje")?.value || 0);
    const pendentes = Number(dashboard?.metrics?.find((item) => item.label === "Pendentes")?.value || 0);
    const atrasadas = Number(dashboard?.metrics?.find((item) => item.label === "Atrasadas")?.value || 0);
    const realizadas = Number(dashboard?.highlights?.realizadas || 0);

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
            <h2>Sem visitas agendadas</h2>
            <p>Nenhuma visita pendente ou atrasada foi encontrada para exibir neste resumo.</p>
        </div>
    `;

    return `
        <section class="screen">
            <div class="dashboard-header-site">
                <div class="dashboard-header-site__title">
                    <h1>Dashboard</h1>
                    <p>${escapeHtml(session?.nome || "usuario")} • ${online ? "Online" : "Offline"}</p>
                </div>
            </div>
            <div class="dashboard-cards-site">
                ${metricCard("Total Visitas", total, "neutral")}
                ${metricCard("Visitas de Hoje", hoje, "info")}
                ${metricCard("Visitas Realizadas", realizadas, "success")}
                ${metricCard("Visitas Pendentes", pendentes, "warning")}
                ${metricCard("Visitas Atrasadas", atrasadas, "danger")}
            </div>
            <div class="card">
                <div class="section-title">
                    <h2>Proximas Visitas</h2>
                    <button class="ghost-btn" type="button" data-route="visits">Ver lista</button>
                </div>
                <div class="list">${visits}</div>
            </div>
        </section>
    `;
}

function metricCard(label, value, tone) {
    return `
        <div class="metric-card metric-card--${tone}">
            <div class="metric-card__title">${escapeHtml(label)}</div>
            <div class="metric-card__value">${escapeHtml(value)}</div>
        </div>
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
