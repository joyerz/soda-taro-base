import { isReady, storage, goc } from 'utils/common'
import fetch from 'utils/fetch'
import { API_HOST as API } from '../config'

class UserManager {
  TOKEN_KEY = 'TOKEN'
  afterLoginCb: any[] = [] // 登陆成功后的回调
  afterLogoutCb: any[] = [] // 退出成功后的回调
  data = null // 用户信息
  token: any = null // token
  tokenRefreshing = false // 是否正在刷新token

  constructor() {
    this.token = this.getToken()
  }

  /**
   * 添加登陆成功的回调
   * @param key
   * @param cb
   * @param once 是否一次性
   */
  afterLogin = (key, cb, once = false) => {
    this.afterLoginCb.push({ key, cb, once })
  }

  /**
   * 执行登陆成功后的回调
   */
  doAfterLogin = () => {
    this.afterLoginCb = this.afterLoginCb.map(item => {
      item.cb && item.cb()
      return !item.once
    })
  }

  /**
   * 添加退出的回调
   * @param key
   * @param cb
   * @param once 是否一次性
   */
  afterLogout = (key, cb, once = false) => {
    this.afterLogoutCb.push({ key, cb, once })
  }

  /**
   * 执行登陆成功后的回调
   */
  doAfterLogout = () => {
    this.afterLogoutCb = this.afterLogoutCb.map(item => {
      item.cb && item.cb()
      return !item.once
    })
  }

  /**
   * 设置token
   */
  saveToken(token, key = '') {
    if (!token) throw new Error('[saveToken]: token not is null!')
    key = key || this.TOKEN_KEY
    storage.set(key, token)

    if (key === this.TOKEN_KEY) {
      this.token = token
    }
  }

  /**
   * 获取token
   * @param key
   * @return {any | null | undefined}
   */
  getToken(key = '') {
    return storage.get(key || this.TOKEN_KEY)
  }

  /**
   * 清除token
   */
  clearToken = (key = '') => {
    key = key || this.TOKEN_KEY
    storage.remove(key)

    if (key === this.TOKEN_KEY) {
      this.token = null
    }
  }

  /**
   * 登录-密码
   */
  // async loginByPwd({ mobile, password }) {
  //   const data = {
  //     metadata: { mechanism: "password", },
  //     mobile,
  //     password,
  //   }
  //   const res = await fetch({ url: API.login, data, method: 'POST', })
  //   this.loginCallback(res)
  //   Taro.redirectTo({
  //     url: LINK.INDEX,
  //   })
  //   return res
  // }

  /**
   * 获取用户信息
   * @param {boolean} forceRefresh 强制刷新
   */
  // async getUser(forceRefresh = false) {
  //   if (this.data && !forceRefresh) return this.data
  //   const user = await fetch({ url: API.user, })
  //   this.data = user
  //   return user
  // }

  /**
   * 登录成功回调
   */
  loginCallback(res) {
    this.afterLogin('savetoken', async () => {
      this.saveToken(res, this.TOKEN_KEY)
    }, true)
    this.doAfterLogin()
    return res
  }


  /**
   * 发送验证码
   */
  // async sendVcode({ mobile }) {
  //   // 先获取是否存在状态
  //   const existed = await fetch({ url: API.userExisted(mobile), })
  //   const data = {
  //     "channel": "MOBILE",
  //     "method": "SMS",
  //     "target": mobile,
  //     "existed": existed.existed,
  //   }
  //   return fetch({ url: API.vcode, data, method: 'POST', })
  // }

  /**
   * 刷新token
   */
  async refreshToken() {
    const token = this.token
    if (!token) return false

    if (this.tokenRefreshing) {
      await isReady(() => !this.tokenRefreshing)
      return this.getToken()
    }
    else {
      this.tokenRefreshing = true

      try {
        const newToken = await fetch({
          url: API.login, // TODO... 需要替代api
          method: 'POST',
          data: {
            metadata: {
              mechanism: 'refresh_token',
            },
            'access_token': token.access_token,
            'refresh_token': token.refresh_token,
          },
        })

        //如果没有获取到新token
        if (!newToken) {
          throw new Error('刷新token失败')
        }

        this.saveToken(newToken)
        this.tokenRefreshing = false
        return newToken
      } catch (err) {
        this.tokenRefreshing = false
        setTimeout(this.logout, 0)
        return false
      }
    }
  }

  /**
   * 获取request Header
   */
  getRequestHeader() {
    return goc(this, 'token.access_token') ? { Authorization: `Bearer ${this.token.access_token}` } : {}
  }

  /**
   * 退出登陆
   */
  logout = () => {
    this.clearToken()
    this.data = null
    this.tokenRefreshing = false

    this.doAfterLogout()

    // Taro.redirectTo({
    //   url: LINK.USER_LOGINBYCODE,
    // })
  }
}


export default new UserManager()
