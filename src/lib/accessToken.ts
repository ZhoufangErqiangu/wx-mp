import { WxMp } from ".";
import { BaseRes } from "./baseRes";

export interface AccessToken {
  token: string;
  expireAt: number;
}

export function checkAccessTokenExpire(this: WxMp) {
  return Date.now() + 5 * 60 * 1000 > this.accessTokenStore.expireAt;
}

export interface GetAccessTokenRes extends BaseRes {
  access_token?: string;
  expires_in?: number;
}
/**
 * 获取接口调用凭据
 * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Get_access_token.html
 * https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/mp-access-token/getAccessToken.html
 */
export async function getAccessToken(this: WxMp) {
  const { status, data } = await this.request<GetAccessTokenRes>({
    url: "/cgi-bin/token",
    method: "GET",
    params: {
      grant_type: "client_credential",
      appid: this.appId,
      secret: this.appSecret,
    },
  });
  if (status !== 200) throw new Error(`获取接口调用凭据 失败 ${status}`);
  if (data.errcode) {
    throw new Error(`获取接口调用凭据 错误 ${data.errcode} ${data.errmsg}`);
  }
  if (data.access_token && data.expires_in) {
    this.accessTokenStore.token = data.access_token;
    this.accessTokenStore.expireAt = Date.now() + data.expires_in * 1000;
  }
  return this.accessToken;
}
