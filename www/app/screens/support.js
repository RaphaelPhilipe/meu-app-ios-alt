import { escapeHtml } from "../utils/sanitize.js";

export function renderSupport(payload) {
    const contact = payload?.contact || {};
    const faq = payload?.faq || [];
    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Ajuda e suporte</h1>
                    <p>Canais claros para o usuario e conteudo que melhora a percepcao de produto real.</p>
                </div>
            </div>
            <div class="support-item">
                <h3>Email</h3>
                <p>${escapeHtml(contact.email || "-")}</p>
            </div>
            <div class="support-item">
                <h3>WhatsApp</h3>
                <p>${escapeHtml(contact.whatsapp || "-")}</p>
            </div>
            <div class="support-item">
                <h3>Central de ajuda</h3>
                <p>${escapeHtml(contact.help_url || "-")}</p>
            </div>
            ${faq.map((item) => `
                <div class="support-item">
                    <h3>${escapeHtml(item.question)}</h3>
                    <p>${escapeHtml(item.answer)}</p>
                </div>
            `).join("")}
        </section>
    `;
}
