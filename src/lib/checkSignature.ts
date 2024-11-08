import { WxMp } from ".";
import { createHash } from "crypto";

export function checkSignature(
  this: WxMp,
  signature: string,
  timestamp: string,
  nonce: string,
): boolean {
  if (!this.token) throw new Error("must input token");
  const c = [this.token, timestamp, nonce].sort().join("");
  const s = createHash("sha1").update(c).digest("hex");
  return s === signature;
}
