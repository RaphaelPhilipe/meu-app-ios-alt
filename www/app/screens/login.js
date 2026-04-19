export function renderLogin() {
    return `
        <section class="screen login-shell">
            <div class="login-backdrop"></div>
            <div class="card login-card login-card--site">
                <h2 class="login-title-site">Login</h2>
                <div class="login-divider"></div>
                <form id="login-form">
                    <div class="field">
                        <label for="login">Usuario</label>
                        <input id="login" name="login" type="text" autocapitalize="none" autocomplete="username" spellcheck="false" placeholder="Nome de usuario">
                    </div>
                    <div class="field">
                        <label for="senha">Senha</label>
                        <div class="password-field-wrap">
                            <input id="senha" name="senha" type="password" autocomplete="current-password" placeholder="Digite sua senha">
                            <button type="button" id="toggle-password" class="toggle-password-btn" aria-label="Mostrar ou ocultar senha">Ver</button>
                        </div>
                    </div>
                    <div class="field">
                        <button type="submit" class="btn full">Entrar</button>
                    </div>
                </form>
                <div class="login-brand-footer">
                    <img src="https://sigevalt.com/img/icon.png" alt="SIGEV ALT" class="login-brand-image" onerror="this.style.display='none'">
                </div>
                <p class="muted login-card__hint">Mesmo login do sistema web. Se houver erro de acesso, o app mostrara a mensagem retornada pelo servidor.</p>
            </div>
        </section>
    `;
}
