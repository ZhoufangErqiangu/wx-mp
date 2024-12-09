import { WxMp } from "..";
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
 *
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
  let ticket: string | null = null;
  if (data.ticket && data.expires_in) {
    ticket = data.ticket;
    this.ticketStore = {
      ticket: data.ticket,
      expireAt: Date.now() + data.expires_in * 1000,
    };
  }
  return ticket;
}

/**
 * 获取卡券api_ticket
 *
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#54
 */
export async function getCardTicket(this: WxMp) {
  const { status, data } = await this.request<GetTicketRes>({
    url: "/cgi-bin/ticket/getticket",
    method: "get",
    params: {
      access_token: this.accessToken,
      type: "wx_card",
    },
  });
  if (status !== 200) throw new Error(`获取ticket 失败 ${status}`);
  if (data.errcode) {
    throw new Error(`获取ticket 错误 ${data.errcode} ${data.errmsg}`);
  }
  let ticket: string | null = null;
  if (data.ticket && data.expires_in) {
    ticket = data.ticket;
    this.cardTicketStore = {
      ticket: data.ticket,
      expireAt: Date.now() + data.expires_in * 1000,
    };
  }
  return ticket;
}
