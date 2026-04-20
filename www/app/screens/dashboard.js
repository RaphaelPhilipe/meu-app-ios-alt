import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderDashboard(session, dashboard, online) {
    const total = Number(dashboard?.metrics?.find((item) => item.label === "Total")?.value || 0);
    const hoje = Number(dashboard?.metrics?.find((item) => item.label === "Hoje")?.value || 0);
    const pendentes = Number(dashboard?.metrics?.find((item) => item.label === "Pendentes")?.value || 0);
    const atrasadas = Number(dashboard?.metrics?.find((item) => item.label === "Atrasadas")?.value || 0);
    const realizadas = Number(dashboard?.highlights?.realizadas || 0);
    const notifications = dashboard?.notifications || [];

    const visits = dashboard?.upcoming_visits?.length ? dashboard.upcoming_visits.map((item) => `
        <article class="site-list-row" data-visit-id="${item.id}">
            <div class="site-list-row__main">
                <strong>${escapeHtml(item.cliente_nome || "Cliente sem nome")}</strong>
                <p>${escapeHtml(item.objetivo || "Sem objetivo informado.")}</p>
            </div>
            <div class="site-list-row__meta">
                <span class="site-badge ${pillTone(item.status)}">${escapeHtml(item.status)}</span>
                <span class="site-badge">${escapeHtml(formatDateTime(item.data_visita, item.hora_visita || ""))}</span>
            </div>
        </article>
    `).join("") : emptyBlock("Sem visitas agendadas", "Nenhuma visita pendente ou atrasada foi encontrada para exibir neste resumo.");

    const alerts = notifications.length ? notifications.map((item) => `
        <article class="site-notification-row">
            <strong>${escapeHtml(item.mensagem || "Notificacao")}</strong>
            <span>${escapeHtml(formatDateTime(item.data_criacao || ""))}</span>
        </article>
    `).join("") : `<p class="site-empty-inline">Sem alertas recentes.</p>`;

    return `
        <section class="screen">
            <div class="site-hero-card">
                <div class="site-hero-card__eyebrow">Painel comercial</div>
                <div class="site-hero-card__title-row">
                    <div>
                        <h1>Dashboard</h1>
                        <p>${escapeHtml(session?.nome || "usuario")} | ${online ? "Online" : "Offline"}</p>
                    </div>
                    <div class="site-status-dot ${online ? "online" : "offline"}">${online ? "Conectado" : "Sem rede"}</div>
                </div>
            </div>

            <div class="site-card-grid">
                ${metricCard("Total Visitas", total, "neutral", "visits")}
                ${metricCard("Visitas de Hoje", hoje, "info", "visits")}
                ${metricCard("Visitas Realizadas", realizadas, "success", "visits")}
                ${metricCard("Visitas Pendentes", pendentes, "warning", "visits")}
                ${metricCard("Visitas Atrasadas", atrasadas, "danger", "visits")}
            </div>

            <div class="site-section-card">
                <div class="site-section-card__header">
                    <div>
                        <h2>Atalhos</h2>
                        <p>Mesma organizacao do sistema para agilizar a operacao.</p>
                    </div>
                </div>
                <div class="site-shortcut-grid">
                    ${shortcutButton("Visitas", "Agenda comercial e carteira do dia", "visits")}
                    ${shortcutButton("Clientes", "Cadastro e consulta da carteira", "customers")}
                    ${shortcutButton("Ocorrencias", "Operacao e tratativas", "issues")}
                    ${shortcutButton("Reajuste", "Fluxo de frete e assinaturas", "freight-adjustments")}
                    ${shortcutButton("Notificacoes", "Avisos do sistema", "notifications")}
                    ${shortcutButton("Sistema", "Abrir modulos responsivos", "system")}
                </div>
            </div>

            <div class="site-section-card">
                <div class="site-section-card__header">
                    <div>
                        <h2>Proximas visitas</h2>
                        <p>Resumo no mesmo estilo de cards do web responsivo.</p>
                    </div>
                    <button class="ghost-btn" type="button" data-route="visits">Ver lista</button>
                </div>
                <div class="site-list">${visits}</div>
            </div>

            <div class="site-section-card">
                <div class="site-section-card__header">
                    <div>
                        <h2>Alertas recentes</h2>
                        <p>Notificacoes mais novas da sua conta.</p>
                    </div>
                    <button class="ghost-btn" type="button" data-route="notifications">Abrir</button>
                </div>
                <div class="site-notification-list">${alerts}</div>
            </div>
        </section>
    `;
}

function metricCard(label, value, tone, route) {
    return `
        <button class="site-kpi-card site-kpi-card--${tone}" type="button" data-route="${route}">
            <span class="site-kpi-card__label">${escapeHtml(label)}</span>
            <strong class="site-kpi-card__value">${escapeHtml(value)}</strong>
        </button>
    `;
}

function shortcutButton(label, description, route) {
    return `
        <button class="site-shortcut-card" type="button" data-route="${route}">
            <strong>${escapeHtml(label)}</strong>
            <span>${escapeHtml(description)}</span>
        </button>
    `;
}

function emptyBlock(title, message) {
    return `
        <div class="empty-state">
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(message)}</p>
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
