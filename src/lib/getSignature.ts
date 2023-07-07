import { createHash } from "crypto";
import { WxMp } from ".";

export interface GetSignatureData {
  nonceStr?: string;
  jsapiTicket?: string;
  timestamp?: string;
  url: string;
}

/**
 * url签名
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html
 */
export function getSignature(this: WxMp, data: GetSignatureData | string) {
  if (typeof data === "string") data = { url: data };
  const {
    jsapiTicket = this.ticket,
    nonceStr = this.nonceStr,
    timestamp = this.timestamp,
    url,
  } = data;
  const s = this.paramsToString({
    jsapi_ticket: jsapiTicket,
    noncestr: nonceStr,
    timestamp,
    url,
  });
  const signature = createHash("sha1").update(s).digest("hex");
  return {
    nonceStr,
    timestamp,
    url,
    signature,
  };
}

export interface GetCardSignatureData {
  apiTicket?: string;
  code?: string;
  openId?: string;
  cardId?: string;
  timestamp?: string;
  nonceStr?: string;
  signType?: "SHA1";
}

/**
 * 卡券签名
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#54
 */
export function getCardSignature(this: WxMp, data: GetCardSignatureData) {
  const {
    apiTicket = this.cardTicket,
    code = "",
    openId = "",
    cardId = "",
    timestamp = this.timestamp,
    nonceStr = this.nonceStr,
    signType = "SHA1",
  } = data;
  const s = [apiTicket, code, openId, cardId, timestamp, nonceStr]
    .sort()
    .join("");
  const signature = createHash(signType.toLowerCase()).update(s).digest("hex");
  return {
    code,
    openId,
    nonceStr,
    timestamp,
    signature,
  };
}
