import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";
import {
  AccessToken,
  Ticket,
  checkAccessTokenExpire,
  checkOAuthAccessToken,
  checkSignature,
  checkTicketExpire,
  code2Session,
  generateOAuthUrl,
  getAccessToken,
  getCardSignature,
  getOAuthAccessToken,
  getOAuthUserInfo,
  getQRCode,
  getRefreshOAuthAccessToken,
  getSignature,
  getTicket,
  getUserPhoneNumber,
  postQRCode,
} from "./lib";

/**
 * 微信开放平台参数
 */
export interface WxMpParam {
  /**
   * appid 在微信开放平台申请
   *
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  appId: string;
  /**
   * app密钥 在微信开放平台申请
   *
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  appSecret: string;
  /**
   * token 用于服务器验证
   *
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
   */
  token?: string;
  /**
   * 请求的地址, 覆盖默认地址
   *
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  baseURL?: string;
  /**
   * 是否使用备用地址
   *
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
  protected token?: string;
  protected encodeKey?: string;
  protected accessTokenStore: AccessToken = { token: "", expireAt: 0 };
  protected ticketStore: Ticket = { ticket: "", expireAt: 0 };
  protected cardTicketStore: Ticket = { ticket: "", expireAt: 0 };
  public service: AxiosInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public request: <T = any, R = AxiosResponse<T>, D = any>(
    config: AxiosRequestConfig<D>,
  ) => Promise<R>;
  public redirectUrl?: string;
  public debug: boolean;

  constructor(param: WxMpParam) {
    const {
      appId,
      appSecret,
      token,
      baseURL,
      useBackupBaseURL,
      timeout = 10000,
      axiosConfig = {},
      redirectUrl,
      debug = false,
    } = param;
    this.appId = appId;
    this.appSecret = appSecret;
    this.token = token;
    if (baseURL) this.baseURL = baseURL;
    else if (useBackupBaseURL) this.baseURL = "https://api2.weixin.qq.com";
    this.redirectUrl = redirectUrl;

    // axios
    this.service = Axios.create({
      ...axiosConfig,
      baseURL: this.baseURL,
      timeout,
    });
    this.request = this.service.request;

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
  /**
   * 验证签名
   */
  public checkSignature = checkSignature;
  /**
   * 卡券签名
   */
  public getCardSignature = getCardSignature;
  /**
   * 创建带参数的二维码
   */
  public postQRCode = postQRCode;

  /**
   * access_token
   */
  public get accessToken(): string | null {
    if (this.accessTokenStore.expireAt < Date.now()) {
      throw new Error(`access token expired ${this.accessTokenStore.expireAt}`);
    }
    return this.accessTokenStore.token;
  }

  /**
   * ticket
   */
  public get ticket(): string | null {
    if (this.ticketStore.expireAt < Date.now()) {
      throw new Error(`ticket expired ${this.ticketStore.expireAt}`);
    }
    return this.ticketStore.ticket;
  }

  /**
   * card ticket
   */
  public get cardTicket(): string | null {
    if (this.cardTicketStore.expireAt < Date.now()) {
      throw new Error(`card ticket expired ${this.cardTicketStore.expireAt}`);
    }
    return this.cardTicketStore.ticket;
  }
}
