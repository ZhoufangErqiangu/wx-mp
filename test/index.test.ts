import { expect, test } from "@jest/globals";
import { WxMp } from "../src";

const wxMp = new WxMp({
  appId: "",
  appSecret: " ",
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
