import Taro from '@tarojs/taro'
import { APPID } from 'config/'
import fetch from 'utils/fetch'
import api from 'config/api'
import { isReady, loadScript } from 'utils/common'

/**
 * 微信相关
 */
class JSSDK {

  constructor() {
    this.init()
  }

  isReady = false    // 微信是否配置完成

  /**
   * 初始化微信配置
   */
  async init() {
    await loadScript('https://res2.wx.qq.com/open/js/jweixin-1.4.0.js', 'jssdk')
    
    const { system } = await Taro.getSystemInfo()

    const url = system === 'iOS' ? sessionStorage.getItem('INT_URL') : window.location.href.split('#')[0]

    const {
      timestamp,
      noncestr,
      signature,
    } = await fetch({ url: api.loadWxSign, method: 'POST', data: { url }, loadingTxt: '' })
    wx.config({
      debug: false, // 调试模式
      appId: APPID, // this.isNewPlatfrom() ? API.wechat.appIdNew : API.wechat.appId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录1
      jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
    wx.ready(() => this.isReady = true)
  }

  /**
   * 获取code
   */
  getCode(rentalId, backpath) {
    const { location } = window
    const backUrl = location.protocol + '//' + location.hostname + encodeURIComponent(backpath)
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APPID +
      '&redirect_uri=' + backUrl +
      '&response_type=code&scope=snsapi_base' +
      '&state=' + rentalId + '#wechat_redirect'
  }

  /**
   * 唤起微信支付
   */
  async pay(config, paycallback) {
    await isReady(() => this.isReady)
    wx.chooseWXPay({
      timestamp: config.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: config.nonceStr, // 支付签名随机串，不长于 32 位
      package: config.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
      signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: config.paySign, // 支付签名
      success: async () => {
        // 支付成功
        // 支付成功后的回调函数
        paycallback && paycallback()
      },
      fail: () => {
        // 支付失败
      },
      cancel: function () {
        // 支付取消
      },
    })
  }

}

export default new JSSDK()