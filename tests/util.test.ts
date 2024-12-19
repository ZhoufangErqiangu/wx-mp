import assert, { strictEqual, notEqual } from "node:assert";
import { describe, test } from "node:test";
import { normalizeUrl } from "../src/util/normalizeUrl";
import { paramsToString } from "../src/util/paramsToString";
import { timestamp } from "../src/util/timestamp";
import { nonceStr } from "../src/util/nonceStr";

describe("util unit test", () => {
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

  test("timestamp", () => {
    const t = timestamp();
    const n = Date.now();
    assert(n - parseInt(t) * 1000.0 < 1000.0, "timestamp is not correct");
  });

  test("nonce str", () => {
    const n = nonceStr();
    strictEqual(n.length, 16, "nonce str length is not correct");
  });
  test("nonce str", () => {
    const n1 = nonceStr();
    const n2 = nonceStr();
    notEqual(n1, n2, "nonce str is not unique");
  });
});
