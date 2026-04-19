export function renderOffline() {
    return `
        <section class="screen">
            <div class="offline-card">
                <h1>Sem internet</h1>
                <p>O app continua com cara de aplicativo mesmo offline. Quando houver cache local, mostramos os ultimos dados validos.</p>
                <div class="button-row">
                    <button id="retry-connection" class="btn" type="button">Tentar novamente</button>
                </div>
            </div>
        </section>
    `;
}
