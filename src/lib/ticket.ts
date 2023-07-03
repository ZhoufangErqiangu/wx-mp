import { WxMp } from ".";
import { BaseRes } from "./baseRes";

export interface Ticket {
  ticket: string;
  expireAt: number;
}

export function checkTicketExpire(this: WxMp) {
  return Date.now() > this.ticketStore.expireAt;
}

export interface GetTicketRes extends BaseRes {
  ticket?: string;
  expires_in?: number;
}

/**
 * 获取jsapi_ticket
 * https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=ACCESS_TOKEN&type=jsapi
 */
export async function getTicket(this: WxMp) {
  const { status, data } = await this.request<GetTicketRes>({
    url: "/cgi-bin/ticket/getticket",
    method: "get",
    params: {
      access_token: this.accessToken,
      type: "jsapi",
    },
  });
  if (status !== 200) throw new Error(`获取ticket 失败 ${status}`);
  if (data.errcode) {
    throw new Error(`获取ticket 错误 ${data.errcode} ${data.errmsg}`);
  }
  if (data.ticket && data.expires_in) {
    this.ticketStore.ticket = data.ticket;
    this.ticketStore.expireAt = Date.now() + data.expires_in * 1000;
  }
  return this.ticket;
}
