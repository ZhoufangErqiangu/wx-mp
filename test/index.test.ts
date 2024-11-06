import { strictEqual } from "node:assert";
import { describe, test } from "node:test";
import { WxMp } from "../src";

const wxMp = new WxMp({
  appId: "wx807d86fb6b3d4fd2",
  appSecret: "test_app_secret",
  token: "thisisave",
  redirectUrl: "http://developers.weixin.qq.com",
});

describe("test", () => {
  test("signature", () => {
    strictEqual(
      wxMp.getSignature({
        url: "http://mp.weixin.qq.com?params=value",
        nonceStr: "Wm3WZYTPz0wzccnW",
        timestamp: "1414587457",
        jsapiTicket:
          "sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg",
      }).signature,
      "0f9de62fce790f9a083d5c99e95740ceb90c27ed",
    );
  });

  test("oauth url", () => {
    strictEqual(
      wxMp.generateOAuthUrl("snsapi_userinfo"),
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx807d86fb6b3d4fd2&response_type=code&redirect_uri=http%3A%2F%2Fdevelopers.weixin.qq.com&scope=snsapi_userinfo#wechat_redirect",
    );
  });

  test("oauth url", () => {
    strictEqual(
      wxMp.generateOAuthUrl({
        redirectUrl: "http://developers.weixin.qq.com",
        scope: "snsapi_userinfo",
      }),
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx807d86fb6b3d4fd2&response_type=code&redirect_uri=http%3A%2F%2Fdevelopers.weixin.qq.com&scope=snsapi_userinfo#wechat_redirect",
    );
  });

  test("oauth url", () => {
    strictEqual(
      wxMp.generateOAuthUrl({
        redirectUrl: "http://developers.weixin.qq.com",
        scope: "snsapi_userinfo",
        state: "STATE",
      }),
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx807d86fb6b3d4fd2&response_type=code&redirect_uri=http%3A%2F%2Fdevelopers.weixin.qq.com&scope=snsapi_userinfo&state=STATE#wechat_redirect",
    );
  });

  test("verify token", () => {
    strictEqual(
      wxMp.verifyToken(
        "f469e2d31cebf3e7981727dbac4522ac3060252c",
        "1939121145797148543",
        "1688384379",
        "1616797381",
      ),
      "1939121145797148543",
    );
  });

  test("verify token error", () => {
    strictEqual(
      wxMp.verifyToken(
        "f469e2d31cebf3e7981727dbac4522ac3060252c1",
        "1939121145797148543",
        "1688384379",
        "1616797381",
      ),
      "error",
    );
  });

  test("card signature", () => {
    strictEqual(
      wxMp.getCardSignature({
        apiTicket: "ojZ8YtyVyr30HheH3CM73y7h4jJE",
        code: "1434008071",
        timestamp: "1404896688",
        cardId: "pjZ8Yt1XGILfi-FUsewpnnolGgZk",
        nonceStr: "123",
      }).signature,
      "f137ab68b7f8112d20ee528ab6074564e2796250",
    );
  });
});
