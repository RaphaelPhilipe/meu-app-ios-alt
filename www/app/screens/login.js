export function renderLogin() {
    return `
        <section class="screen login-shell">
            <div class="login-hero-card">
                <div class="login-hero-card__eyebrow">SIGEV ALT</div>
                <h1>Acesse sua conta</h1>
                <p>Use o mesmo usuario e senha do sistema SIGEVALT para entrar no app.</p>
            </div>
            <div class="card login-card login-card--brand">
                <div class="login-card__brand">
                    <div class="logo-mark">S</div>
                    <div>
                        <strong>SIGEV ALT</strong>
                        <div class="muted">Ambiente comercial mobile</div>
                    </div>
                </div>
                <form id="login-form">
                    <div class="field">
                        <label for="login">Usuario</label>
                        <input id="login" name="login" type="text" autocapitalize="none" autocomplete="username" spellcheck="false" placeholder="Digite seu usuario">
                    </div>
                    <div class="field">
                        <label for="senha">Senha</label>
                        <input id="senha" name="senha" type="password" autocomplete="current-password" placeholder="Digite sua senha">
                    </div>
                    <div class="field">
                        <button type="submit" class="btn full">Entrar</button>
                    </div>
                </form>
                <p class="muted login-card__hint">Mesmo login do sistema web. Se houver erro de acesso, o app mostrara a mensagem retornada pelo servidor.</p>
            </div>
        </section>
    `;
}
