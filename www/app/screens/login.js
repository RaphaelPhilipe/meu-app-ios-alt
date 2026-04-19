export function renderLogin() {
    return `
        <section class="screen login-shell">
            <div class="login-backdrop"></div>
            <div class="card login-card login-card--site">
                <div class="login-brand-top">
                    <img src="./assets/images/sigev-alt-logo.png" alt="SIGEV ALT" class="login-brand-image login-brand-image--top">
                    <div class="login-brand-caption">SIGEV ALT</div>
                </div>
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
                <p class="muted login-card__hint">Redirecionando para o login oficial do sistema.</p>
            </div>
        </section>
    `;
}
