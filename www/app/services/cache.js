import { storage } from "./storage.js";
import { APP_CONFIG } from "../core/config.js";

export function getCached(key, ttlMs = APP_CONFIG.cacheTtlMs) {
    const entry = storage.get(`cache:${key}`);
    if (!entry || !entry.timestamp) {
        return null;
    }
    if (Date.now() - entry.timestamp > ttlMs) {
        storage.remove(`cache:${key}`);
        return null;
    }
    return entry.data;
}

export function setCached(key, data) {
    storage.set(`cache:${key}`, {
        timestamp: Date.now(),
        data
    });
}
