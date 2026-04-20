import { formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderNotifications(payload) {
    const items = payload?.items || [];
    const unread = Number(payload?.summary?.unread || 0);

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>Notificacoes</h1>
                    <p>${unread} nao lida(s) no momento.</p>
                </div>
                <button class="ghost-btn" id="notifications-read-all" type="button">Marcar todas</button>
            </div>
            <div class="site-table-card">
                <div class="site-list">
                    ${items.length ? items.map((item) => `
                        <article class="site-notification-row ${Number(item.lida || 0) === 0 ? "is-unread" : ""}">
                            <div class="site-notification-row__text">
                                <strong>${escapeHtml(item.mensagem || "Notificacao")}</strong>
                                <span>${escapeHtml(formatDateTime(item.data_criacao || ""))}</span>
                            </div>
                            <div class="site-notification-row__actions">
                                <span class="site-badge ${Number(item.lida || 0) === 0 ? "warning" : "success"}">${Number(item.lida || 0) === 0 ? "Nao lida" : "Lida"}</span>
                                ${Number(item.lida || 0) === 0 ? `<button class="ghost-btn" data-mark-notification="${item.id}" type="button">Marcar</button>` : ""}
                            </div>
                        </article>
                    `).join("") : `
                        <div class="empty-state">
                            <h2>Sem notificacoes</h2>
                            <p>Nenhum aviso foi encontrado para esta conta.</p>
                        </div>
                    `}
                </div>
            </div>
        </section>
    `;
}
