// src/lib/utils/formatters.ts
export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

export function formatCount(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
