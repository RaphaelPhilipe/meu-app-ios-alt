const iconMap = {
    house: "⌂",
    calendar: "◷",
    person: "◉",
    sliders: "≡"
};

export function icon(name) {
    return iconMap[name] || "•";
}

export function renderToasts() {
    const stack = document.createElement("div");
    stack.className = "toast-stack";
    stack.id = "toast-stack";
    return stack;
}

export function showToast(message, tone = "info") {
    const stack = document.getElementById("toast-stack");
    if (!stack) {
        return;
    }

    const item = document.createElement("div");
    item.className = `toast ${tone}`;
    item.textContent = message;
    stack.appendChild(item);
    window.setTimeout(() => item.remove(), 2800);
}

export function renderLoader() {
    const wrapper = document.createElement("div");
    wrapper.className = "loader-overlay";
    wrapper.id = "loader-overlay";
    wrapper.innerHTML = `
        <div class="loader-card">
            <div class="spinner" aria-hidden="true"></div>
            <div>Carregando...</div>
        </div>
    `;
    return wrapper;
}

export function setLoader(visible) {
    const overlay = document.getElementById("loader-overlay");
    if (overlay) {
        overlay.classList.toggle("visible", visible);
    }
}
