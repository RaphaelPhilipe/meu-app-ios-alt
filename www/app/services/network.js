import { setState } from "../core/store.js";

export function initNetworkMonitoring(onReconnect) {
    const update = (online) => setState({ online });

    document.addEventListener("online", async () => {
        update(true);
        if (onReconnect) {
            await onReconnect();
        }
    }, false);

    document.addEventListener("offline", () => update(false), false);
    update(navigator.onLine);
}
