import { WxMp } from ".";
import { BaseRes } from "./baseRes";

export type OAuthScope = "snsapi_base" | "snsapi_userinfo";

export interface GenerateUrlParam {
  redirectUrl?: string;
  scope: OAuthScope;
  state?: string;
  forcePopup?: boolean;
}
/**
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function generateOAuthUrl(
  this: WxMp,
  param: GenerateUrlParam | OAuthScope,
) {
  const url = new URL("https://open.weixin.qq.com/connect/oauth2/authorize");
  url.hash = "#wechat_redirect";
  url.searchParams.set("appid", this.appId);
  url.searchParams.set("response_type", "code");
  if (typeof param === "string") {
    if (!this.redirectUrl) throw new Error("必须输入redirectUrl");
    url.searchParams.set("redirect_uri", this.redirectUrl);
    url.searchParams.set("scope", param);
  } else {
    if (!param.redirectUrl && !this.redirectUrl) {
      throw new Error("必须输入redirectUrl");
    }
    url.searchParams.set(
      "redirect_uri",
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (param.redirectUrl ?? this.redirectUrl)!,
    );
    url.searchParams.set("scope", param.scope);
    if (param.state) url.searchParams.set("state", param.state);
    if (param.forcePopup) url.searchParams.set("forcePopup", "true");
  }
  return url.toString();
}

export interface GetOAuthAccessTokenRes {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
  is_snapshotuser?: number;
  unionid?: string;
}
/**
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function getOAuthAccessToken(this: WxMp, code: string) {
  return this.request<GetOAuthAccessTokenRes>({
    url: "/sns/oauth2/access_token",
    method: "GET",
    params: {
      appid: this.appId,
      secret: this.appSecret,
      grant_type: "authorization_code",
      code,
    },
  });
}

export interface GetRefreshOAuthAccessTokenRes {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
}
/**
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function getRefreshOAuthAccessToken(this: WxMp, refreshToken: string) {
  return this.request<GetOAuthAccessTokenRes>({
    url: "/sns/oauth2/refresh_token",
    method: "GET",
    params: {
      appid: this.appId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
  });
}

export interface GetOAuthUserInfoParam {
  accessToken: string;
  openid: string;
  lang?: string;
}
export interface GetOAuthUserInfoRes {
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
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function getOAuthUserInfo(this: WxMp, param: GetOAuthUserInfoParam) {
  const { accessToken, openid, lang = "zh_CN" } = param;
  return this.request<GetOAuthUserInfoRes>({
    url: "/sns/userinfo",
    method: "GET",
    params: {
      access_token: accessToken,
      openid,
      lang,
    },
  });
}

export interface CheckOAuthAccessTokenParam {
  accessToken: string;
  openid: string;
}
/**
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html
 */
export function checkOAuthAccessToken(
  this: WxMp,
  param: CheckOAuthAccessTokenParam,
) {
  const { accessToken, openid } = param;
  return this.request<BaseRes>({
    url: "/sns/auth",
    method: "GET",
    params: {
      access_token: accessToken,
      openid,
    },
  });
}
