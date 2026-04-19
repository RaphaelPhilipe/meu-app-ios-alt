import { storage } from "./storage.js";

const QUEUE_KEY = "offline_queue";

export function readQueue() {
    return storage.get(QUEUE_KEY, []);
}

export function enqueueRequest(item) {
    const queue = readQueue();
    queue.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        ...item
    });
    storage.set(QUEUE_KEY, queue);
}

export function clearQueue() {
    storage.remove(QUEUE_KEY);
}

export async function flushQueue(executor) {
    const queue = readQueue();
    if (!queue.length) {
        return { flushed: 0 };
    }

    const pending = [];
    let flushed = 0;
    for (const item of queue) {
        try {
            await executor(item);
            flushed += 1;
        } catch (error) {
            pending.push(item);
        }
    }

    storage.set(QUEUE_KEY, pending);
    return { flushed, pending: pending.length };
}
