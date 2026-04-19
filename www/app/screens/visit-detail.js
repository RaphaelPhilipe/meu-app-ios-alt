import { formatDate, formatDateTime } from "../utils/format.js";
import { escapeHtml } from "../utils/sanitize.js";

export function renderVisitDetail(item) {
    if (!item) {
        return `
            <section class="screen">
                <div class="empty-state">
                    <h2>Visita nao encontrada</h2>
                    <p>O item solicitado nao existe mais ou nao esta disponivel para seu perfil.</p>
                </div>
            </section>
        `;
    }

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>${escapeHtml(item.cliente_nome || "Detalhe da visita")}</h1>
                    <p>${escapeHtml(item.objetivo || "Sem objetivo informado.")}</p>
                </div>
                <button class="ghost-btn" type="button" data-route="visits">Voltar</button>
            </div>
            <div class="card">
                <div class="detail-grid">
                    <div class="kv"><strong>Status</strong><span>${escapeHtml(item.status || "-")}</span></div>
                    <div class="kv"><strong>Data e hora</strong><span>${escapeHtml(formatDateTime(item.data_visita, item.hora_visita || ""))}</span></div>
                    <div class="kv"><strong>Vendedor</strong><span>${escapeHtml(item.vendedor_nome || "-")}</span></div>
                    <div class="kv"><strong>Cliente</strong><span>${escapeHtml(item.cliente_nome || "-")}</span></div>
                    <div class="kv"><strong>CNPJ/CPF</strong><span>${escapeHtml(item.cnpj_cpf || "-")}</span></div>
                    <div class="kv"><strong>Endereco</strong><span>${escapeHtml(item.endereco || "-")}</span></div>
                    <div class="kv"><strong>Observacao data</strong><span>${escapeHtml(formatDate(item.data_visita || ""))}</span></div>
                    <div class="kv"><strong>ID</strong><span>${escapeHtml(item.id || "-")}</span></div>
                </div>
            </div>
        </section>
    `;
}
