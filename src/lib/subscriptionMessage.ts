import { WxMp } from "..";
import { BaseRes } from "./baseRes";

export interface SendSubscriptionMessageData {
  /**
   * 接收者（用户）的 openid
   */
  touser: string;
  /**
   * 所需下发的订阅模板id
   */
  template_id: string;
  /**
   * 跳转网页时填写
   *
   * page 和 miniprogram 同时不填, 无跳转
   *
   * page 和 miniprogram 同时填写, 优先跳转小程序
   */
  page?: string;
  /**
   * 跳转小程序时填写, 格式如{ "appid": "pagepath": { "value": any } }
   *
   * page 和 miniprogram 同时不填, 无跳转
   *
   * page 和 miniprogram 同时填写, 优先跳转小程序
   */
  miniprogram?: {
    appid: string;
    pagepath: string;
  };
  /**
   * 模板内容, 格式形如 { "key1": { "value": any }, "key2": { "value": any } }
   */
  data: {
    [key: string]: { value: string | number | boolean };
  };
}

/**
 * 发送订阅通知
 *
 * https://developers.weixin.qq.com/doc/offiaccount/Subscription_Messages/api.html#send%E5%8F%91%E9%80%81%E8%AE%A2%E9%98%85%E9%80%9A%E7%9F%A5
 */
export async function sendSubscriptionMessage(
  this: WxMp,
  data: SendSubscriptionMessageData,
) {
  const { status, data: res } = await this.request<BaseRes>({
    url: "/cgi-bin/message/subscribe/bizsend",
    method: "POST",
    params: {
      access_token: this.accessToken,
    },
    data,
  });
  if (status !== 200) throw new Error(`发送订阅通知 失败 ${status}`);
  if (res.errcode) {
    throw new Error(`发送订阅通知 错误 ${res.errcode} ${res.errmsg}`);
  }
  return res;
}
