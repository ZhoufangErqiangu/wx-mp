import { WxMp } from ".";
import { BaseRes } from "./baseRes";

/**
 * QR_SCENE为临时的整型参数值
 *
 * QR_STR_SCENE为临时的字符串参数值
 *
 * QR_LIMIT_SCENE为永久的整型参数值
 *
 * QR_LIMIT_STR_SCENE为永久的字符串参数值
 */
export type PostQRCodeDataActionName =
  | "QR_SCENE"
  | "QR_STR_SCENE"
  | "QR_LIMIT_SCENE"
  | "QR_LIMIT_STR_SCENE";

export interface PostQRCodeData {
  /**
   * expire time, in seconds
   */
  expire_seconds?: number;
  /**
   * QR_SCENE为临时的整型参数值
   *
   * QR_STR_SCENE为临时的字符串参数值
   *
   * QR_LIMIT_SCENE为永久的整型参数值
   *
   * QR_LIMIT_STR_SCENE为永久的字符串参数值
   */
  action_name: PostQRCodeDataActionName;
  action_info: {
    scene: {
      scene_id?: number;
      scene_str?: string;
    };
  };
}

export interface PostQRCodeRes extends BaseRes {
  ticket: string;
  expire_seconds: number;
  url: string;
}

/**
 * 创建带参数的二维码
 *
 * https://developers.weixin.qq.com/doc/offiaccount/Account_Management/Generating_a_Parametric_QR_Code.html
 */
export async function postQRCode(this: WxMp, data: PostQRCodeData) {
  const { status, data: res } = await this.request<PostQRCodeRes>({
    url: "/cgi-bin/qrcode/create",
    method: "post",
    params: {
      access_token: this.accessToken,
    },
    data: data,
  });
  if (status !== 200) throw new Error(`创建QR码 失败 ${status}`);
  if (res.errcode) {
    throw new Error(`创建带参数的二维码 错误 ${res.errcode} ${res.errmsg}`);
  }
  return res;
}
