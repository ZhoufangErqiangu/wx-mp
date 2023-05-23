/**
 * 生成nonce字符串, 默认长度16
 */
export function nonceStr(length = 16) {
  return Math.random().toFixed(length).split(".")[1];
}
