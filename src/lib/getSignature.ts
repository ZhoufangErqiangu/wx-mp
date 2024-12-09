import { createHash } from "crypto";
import { WxMp } from "..";
import { nonceStr } from "../util/nonceStr";
import { paramsToString } from "../util/paramsToString";
import { timestamp } from "../util/timestamp";

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
  const { jsapiTicket: jt, nonceStr: n, timestamp: t, url } = data;
  const s = paramsToString({
    jsapi_ticket: jt ?? this.ticket,
    noncestr: n ?? nonceStr(),
    timestamp: t ?? timestamp(),
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
    apiTicket: ct,
    code = "",
    openId = "",
    cardId = "",
    timestamp: t,
    nonceStr: n,
    signType = "SHA1",
  } = data;
  const tt = t ?? timestamp();
  const nn = n ?? nonceStr();
  const s = [ct, code, openId, cardId, tt, nn].sort().join("");
  const signature = createHash(signType.toLowerCase()).update(s).digest("hex");
  return {
    code,
    openId,
    timestamp: tt,
    nonceStr: nn,
    signature,
  };
}
