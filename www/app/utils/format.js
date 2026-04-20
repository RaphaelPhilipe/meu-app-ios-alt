export function formatDate(dateValue) {
    if (!dateValue) {
        return "-";
    }
    const date = new Date(`${dateValue}T00:00:00`);
    return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatDateTime(dateValue, timeValue = "") {
    return [formatDate(dateValue), timeValue].filter(Boolean).join(" • ");
}
