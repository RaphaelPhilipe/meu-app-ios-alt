export const APP_CONFIG = {
    appName: "SIGEV ALT",
    version: "1.0.0",
    apiBaseUrl: "https://sigevalt.com",
    apiRoutePrefix: "index.php?r=",
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
