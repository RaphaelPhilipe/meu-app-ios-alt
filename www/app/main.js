import { APP_CONFIG } from "./core/config.js";

const app = document.getElementById("app");

document.addEventListener("deviceready", boot, false);
window.addEventListener("load", () => {
    if (!window.cordova) {
        boot();
    }
});

function boot() {
    if (boot.done) {
        return;
    }
    boot.done = true;

    if (app) {
        app.innerHTML = `
            <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f7a5a;color:#fff;text-align:center;">
                <div>
                    <img src="./assets/images/sigev-alt-logo.png" alt="SIGEV ALT" style="max-width:140px;width:100%;height:auto;display:block;margin:0 auto 18px;">
                    <div style="font-size:28px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;">SIGEV ALT</div>
                    <div style="margin-top:12px;opacity:.9;">Abrindo o sistema...</div>
                </div>
            </div>
        `;
    }

    const entryUrl = `${APP_CONFIG.apiBaseUrl.replace(/\/+$/, "")}/${APP_CONFIG.webAppEntryPath.replace(/^\/+/, "")}`;
    window.setTimeout(() => {
        window.location.replace(entryUrl);
    }, 250);
}
