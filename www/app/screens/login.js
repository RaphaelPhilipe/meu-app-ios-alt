export function renderLogin() {
    return `
        <section class="screen login-shell">
            <div class="hero-card">
                <div class="badge">Experiencia mobile local</div>
                <h1>Entrar no SIGEV</h1>
                <p>Interface desenhada para iPhone, conectada por API JSON ao backend PHP.</p>
            </div>
            <div class="card login-card">
                <div class="logo-mark">S</div>
                <form id="login-form">
                    <div class="field">
                        <label for="login">Usuario</label>
                        <input id="login" name="login" type="text" autocomplete="username" inputmode="email" placeholder="Seu login">
                    </div>
                    <div class="field">
                        <label for="senha">Senha</label>
                        <input id="senha" name="senha" type="password" autocomplete="current-password" placeholder="Sua senha">
                    </div>
                    <div class="field">
                        <button type="submit" class="btn full">Entrar</button>
                    </div>
                </form>
                <p class="muted">Se a sessao expirar, o app retorna para esta tela e preserva o contexto visual.</p>
            </div>
        </section>
    `;
}
