import { WxMp } from ".";
import { createHash } from "crypto";

export function verifyToken(
  this: WxMp,
  signature: string,
  echostr: string,
  timestamp: string,
  nonce: string,
) {
  if (!this.token) throw new Error("must input token");
  const c = [this.token, timestamp, nonce].sort().join("");
  const s = createHash("sha1").update(c).digest("hex");
  if (s === signature) {
    return echostr;
  } else {
    return "error";
  }
}
