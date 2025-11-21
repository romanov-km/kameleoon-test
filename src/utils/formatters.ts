export function formatPercent(
  value: number | null | undefined,
  fractionDigits = 1
): string {
  if (value == null || Number.isNaN(value)) {
    return "-";
  }
  const fixed = value.toFixed(fractionDigits).replace(".", ",");
  return `${fixed}%`;
}

export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function formatTooltipDate(date: Date): string {
  // 23/02/2024
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
