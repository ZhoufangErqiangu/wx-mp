import { WxMp } from ".";

export interface GetUserPhoneNumberData {
  code: string;
}
export interface GetUserPhoneNumberRes {
  errcode: number;
  errmsg: string;
  phone_info?: {
    phoneNumber: string;
    purePhoneNumber: string;
    countryCode: string;
    watermark: {
      timestamp: number;
      appid: string;
    };
  };
}
/**
 * 获取手机号
 * https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-info/phone-number/getPhoneNumber.html
 */
export async function getUserPhoneNumber(
  this: WxMp,
  data: GetUserPhoneNumberData | string,
) {
  if (typeof data === "string") data = { code: data };
  const { status, data: res } = await this.request<GetUserPhoneNumberRes>({
    url: "/wxa/business/getuserphonenumber",
    method: "POST",
    params: {
      access_token: this.accessToken,
    },
    data,
  });
  if (status !== 200) throw new Error(`获取手机号 失败 ${status}`);
  if (res.errcode) {
    throw new Error(`获取手机号 错误 ${res.errcode} ${res.errmsg}`);
  }
  return res;
}
