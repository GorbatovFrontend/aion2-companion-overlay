import type { SearchResult } from "../../types";

function distance(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => Array<number>(a.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[0]![i] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[j]![0] = j;
  for (let j = 1; j <= b.length; j += 1) for (let i = 1; i <= a.length; i += 1) matrix[j]![i] = Math.min(matrix[j - 1]![i] + 1, matrix[j]![i - 1] + 1, matrix[j - 1]![i - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return matrix[b.length]![a.length]!;
}

export function rankResults(query: string, results: SearchResult[]): SearchResult[] {
  const normalized = query.toLocaleLowerCase("ru").trim();
  return [...results].sort((a, b) => {
    const left = a.nameRu.toLocaleLowerCase("ru");
    const right = b.nameRu.toLocaleLowerCase("ru");
    const score = (value: string) => value.startsWith(normalized) ? -100 : value.includes(normalized) ? -50 : distance(normalized, value.slice(0, normalized.length + 2));
    return score(left) - score(right);
  });
}
