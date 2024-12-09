import { WxMp } from "..";
import { BaseRes } from "./baseRes";

export type OAuthScope = "snsapi_base" | "snsapi_userinfo";

export interface GenerateUrlParam {
  redirectUrl?: string;
  scope: OAuthScope;
  state?: string;
  forcePopup?: boolean;
}
/**
 * 网页授权
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function generateOAuthUrl(
  this: WxMp,
  param: GenerateUrlParam | OAuthScope,
) {
  if (typeof param === "string") param = { scope: param };
  const { redirectUrl = this.redirectUrl, scope, state, forcePopup } = param;
  if (!redirectUrl) throw new Error("必须输入redirectUrl");
  const url = new URL("https://open.weixin.qq.com/connect/oauth2/authorize");
  url.hash = "#wechat_redirect";
  url.searchParams.set("appid", this.appId);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("scope", scope);
  if (state) url.searchParams.set("state", state);
  if (forcePopup) url.searchParams.set("forcePopup", "true");
  return url.toString();
}

export interface GetOAuthAccessTokenRes extends BaseRes {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  is_snapshotuser?: number;
  unionid?: string;
}
/**
 * 通过code换取网页授权access_token
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export async function getOAuthAccessToken(this: WxMp, code: string) {
  const { status, data } = await this.request<GetOAuthAccessTokenRes>({
    url: "/sns/oauth2/access_token",
    method: "GET",
    params: {
      appid: this.appId,
      secret: this.appSecret,
      grant_type: "authorization_code",
      code,
    },
  });
  if (status !== 200)
    throw new Error(`通过code换取网页授权access_token 失败 ${status}`);
  if (data.errcode) {
    throw new Error(
      `通过code换取网页授权access_token 错误 ${data.errcode} ${data.errmsg}`,
    );
  }
  return data;
}

export interface GetRefreshOAuthAccessTokenRes extends BaseRes {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
}
/**
 * 刷新access_token
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export async function getRefreshOAuthAccessToken(
  this: WxMp,
  refreshToken: string,
) {
  const { status, data } = await this.request<GetOAuthAccessTokenRes>({
    url: "/sns/oauth2/refresh_token",
    method: "GET",
    params: {
      appid: this.appId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  });
  if (status !== 200) throw new Error(`刷新access_token 失败 ${status}`);
  if (data.errcode) {
    throw new Error(`刷新access_token 错误 ${data.errcode} ${data.errmsg}`);
  }
  return data;
}

export interface GetOAuthUserInfoParam {
  accessToken: string;
  openid: string;
  lang?: string;
}
export interface GetOAuthUserInfoRes extends BaseRes {
  openid: string;
  nickname: string;
  sex: number;
  province: string;
  city: string;
  country: string;
  headimgurl: string;
  privilege: string[];
  unionid?: string;
}
/**
 * 拉取用户信息
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export async function getOAuthUserInfo(
  this: WxMp,
  param: GetOAuthUserInfoParam,
) {
  const { accessToken, openid, lang = "zh_CN" } = param;
  const { status, data } = await this.request<GetOAuthUserInfoRes>({
    url: "/sns/userinfo",
    method: "GET",
    params: {
      access_token: accessToken,
      openid,
      lang,
    },
  });
  if (status !== 200) throw new Error(`拉取用户信息 失败 ${status}`);
  if (data.errcode) {
    throw new Error(`拉取用户信息 错误 ${data.errcode} ${data.errmsg}`);
  }
  return data;
}

export interface CheckOAuthAccessTokenParam extends BaseRes {
  accessToken: string;
  openid: string;
}
/**
 * 检验授权凭证
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export async function checkOAuthAccessToken(
  this: WxMp,
  param: CheckOAuthAccessTokenParam,
) {
  const { accessToken, openid } = param;
  const { status, data } = await this.request<BaseRes>({
    url: "/sns/auth",
    method: "GET",
    params: {
      access_token: accessToken,
      openid,
    },
  });
  if (status !== 200) throw new Error(`检验授权凭证 失败 ${status}`);
  return data;
}
