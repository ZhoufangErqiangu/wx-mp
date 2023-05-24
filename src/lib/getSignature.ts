import { createHash } from "crypto";
import { WxMp } from ".";

export interface GetSignatureData {
  noncestr?: string;
  jsapi_ticket?: string;
  timestamp?: string;
  url: string;
}

/**
 * url签名
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 */
export function getSignature(this: WxMp, data: GetSignatureData | string) {
  if (typeof data === "string") data = { url: data };
  const jsapi_ticket = data.jsapi_ticket ?? this.ticket;
  const url = this.normalizeUrl(data.url);
  const nonceStr = data.noncestr ?? this.nonceStr;
  const timestamp = data.timestamp ?? this.timestamp;
  const s = this.paramsToString({
    jsapi_ticket,
    noncestr: nonceStr,
    timestamp,
    url,
  });
  const c = createHash("sha1");
  c.update(s);
  const signature = c.digest("hex");
  return {
    jsapi_ticket,
    nonceStr,
    timestamp,
    url,
    signature,
  };
}
