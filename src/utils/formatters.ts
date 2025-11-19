export function formatPercent(value: number | null | undefined, fractionDigits = 1): string {
    if (value == null || Number.isNaN(value)) {
        return "-";
    } 
    return `${value.toFixed(fractionDigits)} %`;
}

export function formatDateShort(date: Date): string {
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short"
    });
}