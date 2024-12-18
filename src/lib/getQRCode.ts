import { WxMp } from "..";
import { BaseRes } from "./baseRes";

export interface GetQRCodeData {
  path: string;
  width?: number;
  auto_color?: boolean;
  line_color?: {
    r: number;
    g: number;
    b: number;
  };
  is_hyaline?: boolean;
  env_version?: "release" | "trial" | "develop";
}
export type GetQRCodeRes = Buffer | BaseRes;
/**
 * 获取小程序码
 *
 * https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getQRCode.html
 */
export async function getQRCode(this: WxMp, data: GetQRCodeData) {
  const { status, data: res } = await this.request<GetQRCodeRes>({
    url: "/wxa/getwxacode",
    method: "post",
    params: {
      access_token: this.accessToken,
    },
    data,
    responseType: "arraybuffer",
  });
  if (status !== 200) throw new Error(`获取QR码 失败 ${status}`);
  if (!(res instanceof Buffer)) {
    throw new Error(
      `获取QR码 错误 ${(res as BaseRes).errcode} ${(res as BaseRes).errmsg}`,
    );
  }
  return res;
}
