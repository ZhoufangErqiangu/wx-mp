# wx-mp

与微信开放平台交互.

遵照低耦合高内聚的设计思想, 尽可能地减少外部依赖, 并且不具有缓存等可能有副作用的功能.

## 使用

```bash
npm install --save @liuhlightning/wx-mp
# or
yarn add @liuhlightning/wx-mp
```

```typescript
import { WxMp } from "@liuhlightning/wx-mp";

const wxMp = new WxMp({
  appId: "your app id",
  appSecret: "your app secret",
});
```

### 配置

```typescript
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
}
```

### access token

请求获取的 access token 会存储在 store 中, 在过期前可以直接用 store 的值

```typescript
// 从store中获取
const accessToken = wxMp.accessToken;
// 直接请求获取
const accessToken = await wxMp.getAccessToken();
// 先检查过期, 再获取
const accessToken = wxMp.checkAccessTokenExpire()
  ? await wxMp.getAccessToken()
  : wxMp.accessToken;
```

### ticket

请求获取的 ticket 会存储在 store 中, 在过期前可以直接用 store 的值

```typescript
// 从store中获取
const ticket = wxMp.ticket;
// 直接请求获取
const ticket = await wxMp.getTicket();
// 先检查过期, 再获取
const ticket = wxMp.checkTicketExpire() ? await wxMp.getTicket() : wxMp.ticket;
```

### 验证服务器

在微信公众号或微信开放平台填写服务器信息后，微信会向服务器发送验证信息

```typescript
function getWxMap(req: Request, res: Response) {
  const { signature, timestamp, nonce, echostr } = req.query;
  const s = wxMp.checkSignature(signature, timestamp, nonce);
  if (s) {
    res.send(echostr);
  } else {
    res.send("error");
  }
}
```

### URL 签名

对微信打开的页面 URL 进行签名

```typescript
const { nonceStr, timestamp, url, signature } = wxMp.getSignature(
  "http://mp.weixin.qq.com?params=value",
);
```

签名完成后应返回前端用于 wxjssdk 交互

### 小程序登陆

```typescript
const { openid, unionid, session_key } = await wxMp.code2Session(
  codeFromMiniapp,
);
```

之后使用 openid unionid session_key 维护自己的登陆状态

### 小程序获取用户手机号

只有小程序可以获取用户手机号

```typescript
const { phone_info } = await wxMp.getUserPhoneNumber(codeFromMiniapp);
if (!phone_info) throw new Error("null phone info");
const { phoneNumber } = phone_info;
```

### 公众号网页授权

目前只支持明文模式

```typescript
const wxMp = new WxMp({
  appId: "your app id",
  appSecret: "your app secret",
  token: "your token",
  redirectUrl: "https://domain.com/some_url",
});

// 前端直接跳转到此url
const url = wxMp.generateOAuthUrl("snsapi_userinfo");
// or
const url = wxMp.generateOAuthUrl({
  redirectUrl: "https://domain.com/some_url",
  scope: "snsapi_userinfo",
  state: "some_state",
});

// 获取access token, 这个token是用户授权的token, 和前述accessToken无关
const accessToken = await wxMp.getOAuthAccessToken(tokenFromFront);

// 获取用户信息
const { openid, nickname, sex, headimgurl } = await wxMp.getOAuthUserInfo(
  accessToken,
);
```

### 开放平台网页登录

```typescript
export const WX_LOGIN_BASE_URL = "https://open.weixin.qq.com/connect/qrconnect";

export interface BuildLoginUrlOptions {
  /**
   * true：手机点击确认登录后可以在 iframe 内跳转到 redirect_uri，false：手机点击确认登录后可以在 top window 跳转到 redirect_uri
   */
  self_redirect?: boolean;
  /**
   * 应用唯一标识，在微信开放平台提交应用审核通过后获得
   */
  appid?: string;
  /**
   * 应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
   */
  scope?: string[];
  /**
   * 重定向地址，需要进行UrlEncode
   */
  redirect_uri?: string;
  /**
   * 用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验
   */
  state?: string;
  /**
   * 提供"black"、"white"可选，默认为黑色文字描述
   */
  style?: string;
  /**
   * 自定义样式链接，第三方可根据实际需求覆盖默认样式，stylelite不为1时有效
   */
  href?: string;
  /**
   * 切换二维码登录样式，值为1时二维码登录将切换到新样式
   */
  stylelite?: boolean;
  /**
   * 启用或禁用快速登录功能
   */
  fast_login?: boolean;
  lang?: string;
}

/**
 * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
 * @param options options
 * @returns login url
 */
export function buildLoginUrl(options: BuildLoginUrlOptions = {}) {
  const u = new URL(WX_LOGIN_BASE_URL);
  u.searchParams.set(
    "appid",
    options.appid ?? import.meta.env.VITE_APP_WX_APPID,
  );
  u.searchParams.set("scope", options.scope?.join(",") ?? "snsapi_login");
  u.searchParams.set(
    "redirect_uri",
    options.redirect_uri ?? import.meta.env.VITE_APP_WX_REDIRECT_URI,
  );
  u.searchParams.set("state", options.state ?? "SUPIR_STATE");
  u.searchParams.set("login_type", "jssdk");
  u.searchParams.set("self_redirect", options.self_redirect ? "true" : "false");

  u.searchParams.set("styletype", "");
  u.searchParams.set("sizetype", "");
  u.searchParams.set("bgcolor", "");
  u.searchParams.set("rst", "");

  if (options.style) {
    u.searchParams.set("style", options.style);
  }
  if (options.href) {
    u.searchParams.set("href", options.href);
  }
  if (options.lang === "en") {
    u.searchParams.set("lang", "en");
  }
  if (options.stylelite) {
    u.searchParams.set("stylelite", "1");
  }
  if (options.fast_login === false) {
    u.searchParams.set("fastlogin", "0");
  }

  return u.toString();
}

const url = buildLoginUrl();
```

前端使用 iframe 展示上述 url

```typescript
const wxMp = new WxMp({
  appId: "your app id",
  appSecret: "your app secret",
  redirectUrl: "https://domain.com/some_url",
});

// 获取access token, 这个token是用户授权的token, 和前述accessToken无关
const accessToken = await wxMp.getOAuthAccessToken(tokenFromFront);

// 获取用户信息
const { openid, nickname, sex, headimgurl } = await wxMp.getOAuthUserInfo(
  accessToken,
);
```

## 维护 access token 和 ticket

使用 node-schedule

```typescript
import { scheduleJob } from "node-schedule";
import { WxMp } from "../src";

const wxMp = new WxMp({
  appId: "your app id",
  appSecret: "your app secret",
});

async function initWxMp() {
  // 初始化access token
  await wxMp.getAccessToken();
  // 初始化ticket
  await wxMp.getTicket();
  // 每5分钟检查一次
  scheduleJob({ second: 0, minute: "*/5" }, () => {
    if (wxMp.checkAccessTokenExpire()) wxMp.getAccessToken();
  });
  // 每5分钟检查一次
  scheduleJob({ second: 15, minute: "*/5" }, () => {
    if (wxMp.checkTicketExpire()) wxMp.getTicket();
  });
}

initWxMp();
```
