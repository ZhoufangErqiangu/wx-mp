import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";
import { nonceStr } from "../util/nonceStr";
import { normalizeUrl } from "../util/normalizeUrl";
import { paramsToString } from "../util/paramsToString";
import { timestamp } from "../util/timestamp";
import {
  checkOAuthAccessToken,
  generateOAuthUrl,
  getOAuthAccessToken,
  getOAuthUserInfo,
  getRefreshOAuthAccessToken,
} from "./oAuth";
import {
  AccessToken,
  checkAccessTokenExpire,
  getAccessToken,
} from "./accessToken";
import { code2Session } from "./code2Session";
import { getQRCode } from "./getQRCode";
import { getSignature } from "./getSignature";
import { getUserPhoneNumber } from "./getUserPhoneNumber";
import { Ticket, checkTicketExpire, getTicket } from "./ticket";

/**
 * 微信开放平台参数
 */
export interface WxMpParam {
  /**
   * appid 在微信开放平台申请
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  appId: string;
  /**
   * app密钥 在微信开放平台申请
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  appSecret: string;
  /**
   * 请求的地址, 覆盖默认地址
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  baseURL?: string;
  /**
   * 是否使用备用地址
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  useBackupBaseURL?: boolean;
  /**
   * 超时时间, 覆盖 axios 默认配置
   */
  timeout?: number;
  /**
   * axios 配置
   */
  axiosConfig?: CreateAxiosDefaults;
  /**
   * OAuth的回调url
   */
  redirectUrl?: string;
  /**
   * 启用调试, 打印所有log
   */
  debug?: boolean;
}

/**
 * 微信开放平台
 */
export class WxMp {
  public baseURL = "https://api.weixin.qq.com";
  public appId: string;
  protected appSecret: string;
  protected accessTokenStore: AccessToken = { token: "", expireAt: 0 };
  protected ticketStore: Ticket = { ticket: "", expireAt: 0 };
  public service: AxiosInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public request: <T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>,
  ) => Promise<R>;
  public redirectUrl?: string;
  public debug: boolean;

  /**
   * 获取 access token
   */
  public getAccessToken = getAccessToken;
  /**
   * 检查 access token 是否过期
   */
  public checkAccessTokenExpire = checkAccessTokenExpire;
  /**
   * 获取ticket
   */
  public getTicket = getTicket;
  /**
   * url签名
   */
  public getSignature = getSignature;
  /**
   * 检查ticket是否过期
   */
  public checkTicketExpire = checkTicketExpire;
  /**
   * 小程序 获取用户电话号码
   */
  public getUserPhoneNumber = getUserPhoneNumber;
  /**
   * 小程序 获取QR码
   */
  public getQRCode = getQRCode;
  /**
   * 小程序 登陆
   */
  public code2Session = code2Session;
  /**
   * OAuth 生成用户授权url
   */
  public generateOAuthUrl = generateOAuthUrl;
  /**
   * OAuth 获取access token
   */
  public getOAuthAccessToken = getOAuthAccessToken;
  /**
   * OAuth 刷新access token
   */
  public getRefreshOAuthAccessToken = getRefreshOAuthAccessToken;
  /**
   * OAuth 获取用户信息
   */
  public getOAuthUserInfo = getOAuthUserInfo;
  /**
   * OAuth 检查access token是否有效
   */
  public checkOAuthAccessToken = checkOAuthAccessToken;

  static normalizeUrl = normalizeUrl;
  public normalizeUrl = normalizeUrl;
  static paramsToString = paramsToString;
  public paramsToString = paramsToString;

  constructor(param: WxMpParam) {
    const {
      appId,
      appSecret,
      baseURL,
      useBackupBaseURL,
      timeout = 10000,
      axiosConfig = {},
      redirectUrl,
      debug = false,
    } = param;
    this.appId = appId;
    this.appSecret = appSecret;
    if (baseURL) this.baseURL = baseURL;
    else if (useBackupBaseURL) this.baseURL = "https://api2.weixin.qq.com";
    this.service = Axios.create({
      ...axiosConfig,
      baseURL: this.baseURL,
      timeout,
    });
    this.request = this.service.request;
    this.redirectUrl = redirectUrl;
    // debug
    this.debug = debug;
    if (this.debug) {
      this.service.interceptors.request.use((config) => {
        console.log("wx mp request url    ", config.url);
        console.log("wx mp request method ", config.method);
        console.log("wx mp request params ", config.params);
        console.log("wx mp request headers", config.headers);
        console.log("wx mp request data   ", config.data);
        return config;
      });
      this.service.interceptors.response.use((res) => {
        console.log("wx mp response status ", res.status);
        console.log("wx mp response headers", res.headers);
        console.log("wx mp response data   ", res.data);
        return res;
      });
    }
  }

  /**
   * access_token
   */
  public get accessToken() {
    return this.accessTokenStore.token;
  }

  /**
   * ticket
   */
  public get ticket() {
    return this.ticketStore.ticket;
  }

  /**
   * 随机字符串
   */
  public get nonceStr() {
    return nonceStr();
  }

  /**
   * 时间戳
   */
  public get timestamp() {
    return timestamp();
  }
}
