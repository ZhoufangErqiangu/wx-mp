# wx-mp

与微信开放平台交互.

遵照低耦合高内聚的设计思想, 尽可能地减少外部依赖, 并且不具有缓存等可能有副作用的功能.

## 使用

```bash
npm install --save wx-mp
# or
yarn add wx-mp
```

```typescript
import { WxMp } from "../src";

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
}
```

### 功能

#### access token

请求获取的access token会存储在store中, 在过期前可以直接用store的值

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

#### ticket

请求获取的ticket会存储在store中, 在过期前可以直接用store的值

```typescript
// 从store中获取
const ticket = wxMp.ticket;
// 直接请求获取
const ticket = await wxMp.getTicket();
// 先检查过期, 再获取
const ticket = wxMp.checkTicketExpire()
  ? await wxMp.getTicket()
  : wxMp.ticket;
```

#### URL签名

对微信打开的页面URL进行签名

```typescript
const {
  nonceStr,
  timestamp,
  url,
  signature
} = wxMp.getSignature("http://mp.weixin.qq.com?params=value");
```

签名完成后应返回前端用于wxjssdk交互

#### 小程序登陆

```typescript
const {
  openid,
  unionid,
  session_key
} = await wxMp.code2Session("code from miniapp");
```

之后使用openid unionid session_key维护自己的登陆状态

#### 小程序获取用户手机号

```typescript
const { phone_info } = await wxMp.getUserPhoneNumber("code from miniapp");
if(!phone_info) throw new Error("null phone info");
const { phoneNumber } = phone_info;
```

## 维护access token和ticket

使用node-schedule

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
