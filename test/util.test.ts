import { strictEqual } from "node:assert";
import { describe, test } from "node:test";
import { normalizeUrl } from "../src/util/normalizeUrl";
import { paramsToString } from "../src/util/paramsToString";

describe("util test", () => {
  test("delete url hash", () => {
    strictEqual(
      normalizeUrl("http://mp.weixin.qq.com?params=value#some-hash-value"),
      "http://mp.weixin.qq.com?params=value",
    );
  });

  test("delete url hash", () => {
    strictEqual(
      normalizeUrl("http://mp.weixin.qq.com/?params=value#some-hash-value"),
      "http://mp.weixin.qq.com/?params=value",
    );
  });

  test("param stringify", () => {
    strictEqual(
      paramsToString(
        {
          nonceStr: "Wm3WZYTPz0wzccnW",
          jsapi_ticket:
            "sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg",
          timestamp: "1414587457",
          url: "http://mp.weixin.qq.com?params=value",
        },
        { lowerCase: true },
      ),
      "jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value",
    );
  });

  test("param stringify", () => {
    strictEqual(
      paramsToString(
        {
          nonceStr: "Wm3WZYTPz0wzccnW",
          jsapi_ticket:
            "sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg",
          url: "http://mp.weixin.qq.com?params=value",
          timestamp: "1414587457",
        },
        { lowerCase: true },
      ),
      "jsapi_ticket=sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg&noncestr=Wm3WZYTPz0wzccnW&timestamp=1414587457&url=http://mp.weixin.qq.com?params=value",
    );
  });
});
