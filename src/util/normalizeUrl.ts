/**
 * 删除 url 中的 hash
 */
export function normalizeUrl(url: string): string {
  return url.split("#")[0];
}
