# wx-mp

Interface to wx 

According to Low Coupling and High cohesion, using as less dependencies as possibel.

Has no side effect feature, such as storage.

## How to use

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

### Config

```typescript
/**
 * param for wx share platform
 */
export interface WxMpParam {
  /**
   * appid ask on wx share platform
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  appId: string;
  /**
   * app secret ask on wx share platform
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  appSecret: string;
  /**
   * end point, override the default end point
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  baseURL?: string;
  /**
   * using backup end point
   * https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Interface_field_description.html
   */
  useBackupBaseURL?: boolean;
  /**
   * timeout, override axios config
   */
  timeout?: number;
  /**
   * axios config
   */
  axiosConfig?: CreateAxiosDefaults;
}
```

### access token

access token get by request will store in store, could use the value in store before expire.

```typescript
// get from store
const accessToken = wxMp.accessToken;
// get by request
const accessToken = await wxMp.getAccessToken();
// check if expired, then get
const accessToken = wxMp.checkAccessTokenExpire()
  ? await wxMp.getAccessToken()
  : wxMp.accessToken;
```

### ticket

ticket get by request will store in store, could use the value in store before expire.

```typescript
// get from store
const ticket = wxMp.ticket;
// get by request
const ticket = await wxMp.getTicket();
// check if expired, then get
const ticket = wxMp.checkTicketExpire()
  ? await wxMp.getTicket()
  : wxMp.ticket;
```

### URL sign

sign the url open in wx

```typescript
const {
  nonceStr,
  timestamp,
  url,
  signature
} = wxMp.getSignature("http://mp.weixin.qq.com?params=value");
```

the signatrue should send to front for wxjssdk.

### Mini program login

```typescript
const {
  openid,
  unionid,
  session_key
} = await wxMp.code2Session(codeFromMiniapp);
```

using openid unionid and session_key maintance your login state.

### Mini program get user phone number

```typescript
const { phone_info } = await wxMp.getUserPhoneNumber(codeFromMiniapp);
if(!phone_info) throw new Error("null phone info");
const { phoneNumber } = phone_info;
```

### OAuth url auth

```typescript
const wxMp = new WxMp({
  appId: "your app id",
  appSecret: "your app secret",
  redirectUrl: "https://domain.com/some_url",
});

const url = wxMp.generateOAuthUrl("snsapi_userinfo");
// or
const url = wxMp.generateOAuthUrl({
  redirectUrl: "https://domain.com/some_url",
  scope: "snsapi_userinfo",
  state: "some_state",
});

// get access token, this token is form user auth, not access token above.
const accessToken = await wxMp.getOAuthAccessToken(tokenFromFront);

// get user info
const { openid, nickname, sex, headimgurl } = await wxMp.getOAuthUserInfo(accessTokenGetByAbove);
```

## Maintance access token and ticket

using node-schedule

```typescript
import { scheduleJob } from "node-schedule";
import { WxMp } from "../src";

const wxMp = new WxMp({
  appId: "your app id",
  appSecret: "your app secret",
});

async function initWxMp() {
  // init access token
  await wxMp.getAccessToken();
  // init ticket
  await wxMp.getTicket();
  // check every 5 min
  scheduleJob({ second: 0, minute: "*/5" }, () => {
    if (wxMp.checkAccessTokenExpire()) wxMp.getAccessToken();
  });
  // check every 5 min
  scheduleJob({ second: 15, minute: "*/5" }, () => {
    if (wxMp.checkTicketExpire()) wxMp.getTicket();
  });
}

initWxMp();
```
