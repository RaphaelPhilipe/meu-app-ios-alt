import { APP_CONFIG, resolveApiUrl } from "../core/config.js";
import { enqueueRequest } from "./offline-queue.js";
import { storage } from "./storage.js";

const ACCESS_TOKEN_KEY = "access_token";

function timeoutSignal(ms) {
    const controller = new AbortController();
    const id = window.setTimeout(() => controller.abort(), ms);
    return {
        signal: controller.signal,
        clear: () => window.clearTimeout(id)
    };
}

async function parseResponse(response) {
    const json = await response.json().catch(() => ({
        ok: false,
        error: {
            code: "INVALID_JSON",
            message: "Resposta invalida do servidor.",
            retryable: true
        }
    }));

    if (!response.ok || !json.ok) {
        const error = new Error(json?.error?.message || "Falha na API.");
        error.code = json?.error?.code || "API_ERROR";
        error.status = response.status;
        error.retryable = Boolean(json?.error?.retryable);
        throw error;
    }

    return json.data;
}

export async function apiRequest(endpoint, options = {}) {
    const {
        method = "GET",
        body,
        queueable = false,
        retries = APP_CONFIG.retryAttempts
    } = options;

    const url = resolveApiUrl(endpoint);
    const request = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };

    const accessToken = storage.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
        request.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (body !== undefined) {
        request.body = JSON.stringify(body);
    }

    let attempt = 0;
    while (attempt <= retries) {
        const timer = timeoutSignal(APP_CONFIG.requestTimeoutMs);
        try {
            const response = await fetch(url, {
                ...request,
                signal: timer.signal
            });
            timer.clear();
            return await parseResponse(response);
        } catch (error) {
            timer.clear();
            const offline = !navigator.onLine;
            const canRetry = attempt < retries && (offline === false) && (error.name === "AbortError" || error.retryable);

            if (offline && queueable && method !== "GET") {
                enqueueRequest({ endpoint, method, body });
            }

            if (!canRetry) {
                throw error;
            }
            attempt += 1;
        }
    }
}
