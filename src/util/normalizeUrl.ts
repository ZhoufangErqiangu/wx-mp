import { parse } from "url";

/**
 * 删除 url 中的 hash
 */
export function normalizeUrl(url: string) {
  const temp = parse(url);
  const hashIndex = !temp.hash ? -1 : url.indexOf(temp.hash);
  //remove hash from url
  return hashIndex > 0 ? url.substring(0, hashIndex) : url;
}
