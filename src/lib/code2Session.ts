import { WxMp } from ".";

export interface Code2SessionParam {
  js_code: string;
}
export interface Code2SessionRes {
  session_key: string;
  unionid: string;
  openid: string;
  errcode: number;
  errmsg: string;
}
/**
 * 小程序登录
 * https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
 */
export async function code2Session(this: WxMp, param: Code2SessionParam) {
  const { status, data } = await this.request<Code2SessionRes>({
    url: "/sns/jscode2session",
    method: "GET",
    params: {
      appid: this.appId,
      secret: this.appSecret,
      grant_type: "authorization_code",
      ...param,
    },
  });
  if (status !== 200) throw new Error(`小程序登录 失败 ${status}`);
  if (data.errcode) {
    throw new Error(`小程序登录 错误 ${data.errcode} ${data.errmsg}`);
  }
  return data;
}
