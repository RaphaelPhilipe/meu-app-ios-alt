import { escapeHtml } from "../utils/sanitize.js";

export function renderProfile(payload) {
    const user = payload?.user || {};
    const account = payload?.account || {};
    return `
        <section class="screen">
            <div class="screen-header">
                <div>
                    <h1>Conta</h1>
                    <p>Resumo do perfil autenticado e da estrutura do acesso.</p>
                </div>
            </div>
            <div class="card">
                <div class="detail-grid">
                    <div class="kv"><strong>Nome</strong><span>${escapeHtml(user.nome || "-")}</span></div>
                    <div class="kv"><strong>Login</strong><span>${escapeHtml(account.login || "-")}</span></div>
                    <div class="kv"><strong>Tipo</strong><span>${escapeHtml(account.role || "-")}</span></div>
                    <div class="kv"><strong>Filial</strong><span>${escapeHtml(account.branch || "-")}</span></div>
                    <div class="kv"><strong>Cargo</strong><span>${escapeHtml(account.cargo || "-")}</span></div>
                    <div class="kv"><strong>Subcargo</strong><span>${escapeHtml(account.subcargo || "-")}</span></div>
                </div>
            </div>
            <div class="button-row">
                <button class="ghost-btn" data-route="support" type="button">Ajuda</button>
                <button class="ghost-btn" data-route="about" type="button">Sobre</button>
                <button class="btn" id="logout-button" type="button">Sair</button>
            </div>
        </section>
    `;
}
