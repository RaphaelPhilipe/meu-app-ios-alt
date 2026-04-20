import { escapeHtml } from "../utils/sanitize.js";

export function renderSystem(modules = []) {
    const grouped = modules.reduce((acc, item) => {
        const section = item.section || "Outros";
        acc[section] = acc[section] || [];
        acc[section].push(item);
        return acc;
    }, {});

    const content = Object.entries(grouped).map(([section, items]) => `
        <div class="site-table-card">
            <div class="site-table-card__header">
                <h2>${escapeHtml(section)}</h2>
            </div>
            <div class="system-grid">
                ${items.map((item) => `
                    <button class="system-link-card" type="button" data-system-path="${escapeHtml(item.path)}">
                        <strong>${escapeHtml(item.label)}</strong>
                        <span>${escapeHtml(item.description || "Abrir tela responsiva do sistema.")}</span>
                    </button>
                `).join("")}
            </div>
        </div>
    `).join("");

    return `
        <section class="screen">
            <div class="site-page-header">
                <div>
                    <h1>Sistema</h1>
                    <p>Atalhos para as telas responsivas reais do SIGEV dentro do app.</p>
                </div>
            </div>
            ${content}
        </section>
    `;
}
