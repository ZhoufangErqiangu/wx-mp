/**
 * cardExt本身是一个JSON字符串，是商户为该张卡券分配的唯一性信息
 * 
 * https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/JS-SDK.html#56
 */
export interface CardExt {
  /**
   * 指定的卡券code码，只能被领一次
   */
  code?: string;
  /**
   * 指定领取者的openid，只有该用户能领取
   */
  openId?: string;
  /**
   * 时间戳
   */
  timestamp: string;
  /**
   * 随机字符串
   */
  nonceStr?: string;
  /**
   * 卡券在第三方系统的实际领取时间，为东八区时间戳（UTC+8,精确到秒）
   */
  fixedBeginTimestamp?: string;
  /**
   * 领取渠道参数
   */
  outerStr?: string;
  /**
   * 签名
   */
  signature: string;
}
