import { escapeHtml } from "../utils/sanitize.js";

export function renderCustomers(payload) {
    const items = payload?.items || [];
    const page = Number(payload?.pagination?.page || 1);
    const total = Number(payload?.pagination?.total || 0);

    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Clientes</h1>
                    <p>${total} registro(s) encontrados.</p>
                </div>
            </div>
            <div class="card">
                <div class="search-row">
                    <input class="search-input" id="customer-search" type="search" placeholder="Buscar por nome ou CNPJ/CPF">
                    <button class="btn" id="customer-search-button" type="button">Buscar</button>
                </div>
            </div>
            <div class="list">
                ${items.length ? items.map((item) => `
                    <article class="list-item">
                        <h3>${escapeHtml(item.nome || "Cliente sem nome")}</h3>
                        <p>${escapeHtml(item.endereco || "Endereco nao informado.")}</p>
                        <div class="list-meta">
                            <span class="pill">${escapeHtml(item.cnpj_cpf || "-")}</span>
                            <span class="pill">${escapeHtml(item.filial || "-")}</span>
                            <span class="pill">${escapeHtml(item.vendedor_nome || "-")}</span>
                        </div>
                    </article>
                `).join("") : `
                    <div class="empty-state">
                        <h2>Nenhum cliente encontrado</h2>
                        <p>Refine a busca para localizar a carteira desejada.</p>
                    </div>
                `}
            </div>
            <div class="card">
                <p class="muted">Pagina atual: ${page}</p>
            </div>
        </section>
    `;
}
