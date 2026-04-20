import { escapeHtml } from "../utils/sanitize.js";

export function renderCustomers(payload) {
    const items = payload?.items || [];
    const page = Number(payload?.pagination?.page || 1);
    const total = Number(payload?.pagination?.total || 0);

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>Clientes</h1>
                    <p>${total} registro(s) encontrados na carteira.</p>
                </div>
                <button class="ghost-btn" type="button" data-system-path="gerenciar_clientes.php">Abrir completo</button>
            </div>
            <div class="site-filter-card">
                <div class="site-filter-grid">
                    <input class="search-input" id="customer-search" type="search" placeholder="Buscar por nome ou CNPJ/CPF">
                    <button class="btn" id="customer-search-button" type="button">Buscar</button>
                </div>
            </div>
            <div class="site-table-card">
                <div class="site-table-card__header">
                    <h2>Lista de clientes</h2>
                    <span>Pagina ${page}</span>
                </div>
                <div class="site-list">
                    ${items.length ? items.map((item) => `
                        <article class="site-list-row">
                            <div class="site-list-row__main">
                                <strong>${escapeHtml(item.nome || "Cliente sem nome")}</strong>
                                <p>${escapeHtml(item.endereco || "Endereco nao informado.")}</p>
                            </div>
                            <div class="site-list-row__meta">
                                <span class="site-badge">${escapeHtml(item.cnpj_cpf || "-")}</span>
                                <span class="site-badge">${escapeHtml(item.filial || "-")}</span>
                                <span class="site-badge">${escapeHtml(item.vendedor_nome || "-")}</span>
                            </div>
                        </article>
                    `).join("") : `
                        <div class="empty-state">
                            <h2>Nenhum cliente encontrado</h2>
                            <p>Refine a busca para localizar a carteira desejada.</p>
                        </div>
                    `}
                </div>
            </div>
        </section>
    `;
}
