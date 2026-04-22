export function normalizeKeywordQuery(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ')
}

