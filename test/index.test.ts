import { expect, test } from "@jest/globals";
import { WxMp } from "../src";

const wxMp = new WxMp({
  appId: "wx807d86fb6b3d4fd2",
  appSecret: "test_app_secret",
  token: "thisisave",
  redirectUrl: "http://developers.weixin.qq.com",
});

test("signature", () => {
  expect(
    wxMp.getSignature({
      url: "http://mp.weixin.qq.com?params=value",
      noncestr: "Wm3WZYTPz0wzccnW",
      timestamp: "1414587457",
      jsapi_ticket:
        "sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg",
    }).signature,
  ).toBe("0f9de62fce790f9a083d5c99e95740ceb90c27ed");
});

test("oauth url", () => {
  expect(wxMp.generateOAuthUrl("snsapi_userinfo")).toBe(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx807d86fb6b3d4fd2&response_type=code&redirect_uri=http%3A%2F%2Fdevelopers.weixin.qq.com&scope=snsapi_userinfo#wechat_redirect",
  );
});

test("oauth url", () => {
  expect(
    wxMp.generateOAuthUrl({
      redirectUrl: "http://developers.weixin.qq.com",
      scope: "snsapi_userinfo",
    }),
  ).toBe(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx807d86fb6b3d4fd2&response_type=code&redirect_uri=http%3A%2F%2Fdevelopers.weixin.qq.com&scope=snsapi_userinfo#wechat_redirect",
  );
});

test("oauth url", () => {
  expect(
    wxMp.generateOAuthUrl({
      redirectUrl: "http://developers.weixin.qq.com",
      scope: "snsapi_userinfo",
      state: "STATE",
    }),
  ).toBe(
    "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx807d86fb6b3d4fd2&response_type=code&redirect_uri=http%3A%2F%2Fdevelopers.weixin.qq.com&scope=snsapi_userinfo&state=STATE#wechat_redirect",
  );
});

test("verify token", () => {
  expect(
    wxMp.verifyToken(
      "f469e2d31cebf3e7981727dbac4522ac3060252c",
      "1939121145797148543",
      "1688384379",
      "1616797381",
    ),
  ).toBe("1939121145797148543");
});
