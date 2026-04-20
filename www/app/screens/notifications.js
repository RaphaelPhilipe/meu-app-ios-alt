import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderNotifications(payload) {
    const items = payload?.items || [];
    const unread = Number(payload?.summary?.unread || 0);

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Notificacoes</h1>
                    <p>${unread} nao lida(s) no momento.</p>
                </div>
                <button class="ghost-btn" id="notifications-read-all" type="button">Marcar todas</button>
            </div>
            <div class="list">
                ${items.length ? items.map((item) => `
                    <article class="list-item ${Number(item.lida || 0) === 0 ? "list-item--unread" : ""}">
                        <h3>${escapeHtml(item.mensagem || "Notificacao")}</h3>
                        <div class="list-meta">
                            <span class="pill">${escapeHtml(formatDateTime(item.data_criacao || ""))}</span>
                            <span class="pill ${Number(item.lida || 0) === 0 ? "warning" : "success"}">${Number(item.lida || 0) === 0 ? "Nao lida" : "Lida"}</span>
                        </div>
                        ${Number(item.lida || 0) === 0 ? `<div class="button-row"><button class="ghost-btn" data-mark-notification="${item.id}" type="button">Marcar como lida</button></div>` : ""}
                    </article>
                `).join("") : `
                    <div class="empty-state">
                        <h2>Sem notificacoes</h2>
                        <p>Nenhum aviso foi encontrado para esta conta.</p>
                    </div>
                `}
            </div>
        </section>
    `;
}
