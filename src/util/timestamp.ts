/**
 * 生成时间戳 秒单位
 */
export function timestamp(): string {
  return (new Date().getTime() / 1000.0).toFixed(0);
}
