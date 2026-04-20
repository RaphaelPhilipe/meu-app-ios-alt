export const APP_CONFIG = {
    appName: "SIGEV ALT",
    version: "1.0.0",
    apiBaseUrl: "https://sigevalt.com",
    apiRoutePrefix: "index.php?r=",
    webAppEntryPath: "login.php",
    webSessionEndpoint: "api/mobile/auth/web-session",
    requestTimeoutMs: 20000,
    retryAttempts: 1,
    cacheTtlMs: 5 * 60 * 1000,
    supportEmail: "suporte@sigevalt.com"
};

export function resolveApiUrl(endpoint) {
    const cleanBase = APP_CONFIG.apiBaseUrl.replace(/\/+$/, "");
    const prefix = APP_CONFIG.apiRoutePrefix.replace(/^\/+/, "");
    return `${cleanBase}/${prefix}${endpoint}`;
}

export function resolveWebUrl(path = "") {
    const cleanBase = APP_CONFIG.apiBaseUrl.replace(/\/+$/, "");
    const cleanPath = String(path).replace(/^\/+/, "");
    return `${cleanBase}/${cleanPath}`;
}
