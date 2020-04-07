import Taro from '@tarojs/taro'
import userManager from 'services/userManage'
import { isH5 } from './common'
// import { API_HOST as API } from '../config'
// import LINK from './link'

type Params = {
  /**
   * 请求地址
   */
  url: string
  /**
   * 请求方法
   * 默认 `GET`
   */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  /**
   * 请求数据
   */
  data?: any
  /**
   * 自定义请求头
   */
  header?: any
  /**
   * 自定义loading文字， 为空则不显示请求loading
   * 默认 loading...
   */
  loadingTxt?: string
  /**
   * 不需要错误提示
   * 默认 `false`
   */
  noErrMsgTip?: boolean
}

const fetchCache = {}      // 缓存相同请求（包括参数相同），防止请求重复。
let loadingCache = 0     // 控制loading持续显示

/**
 * fetch 数据请求
 * @param {String} params.url 请求地址
 * @param {String} params.method 请求方法 默认GET
 * @param {Object} params.data 请求数据
 * @param {Object} params.header header
 * @param {Boolean} params.loadingTxt loading 文字 默认为加载中，为空则不显示loading
 */
export default function fetch(params: Params = {},) {

  const paramsStrKey = JSON.stringify(params)

  // 请求缓存
  const cache = fetchCache[paramsStrKey]
  if (cache) return cache

  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    loadingTxt = '加载中...',
  } = params

  const requestHeader = {
    ...header,
    ...userManager.getRequestHeader(),
  }

  const isFormData = isH5 && (data instanceof FormData)

  if (!isFormData) {
    requestHeader['content-type'] = 'application/json'
  }

  if (loadingTxt) {
    Taro.showLoading({
      mask: true,
      title: loadingTxt,
    })
    loadingCache += 1
  }
  const _method = method.toLocaleUpperCase()
  let _data = data
  if (_method !== 'GET' && data && !isFormData) {
    _data = JSON.stringify(data)
  }

  return fetchCache[paramsStrKey] =
    Taro.request({
      url,
      method: _method,
      data: _data,
      dataType: 'String',
      responseType: 'text',    // ! responseType 和 dataType 的设置为了 一些操作成功请求无返回值导致 框架内部的 parse 报错从而进不了我们自己程序的错误处理程序。手动做一次parse
      header: requestHeader,
    })
      .then(res => {   // * 错误码 20X 不会进入此回调
        delete fetchCache[paramsStrKey]   // 请求成功后清除此请求的缓存
        if (loadingTxt) {
          loadingCache -= 1
          if (!loadingCache) {
            Taro.hideLoading()
          }
        }
        // TODO 自定义请求结果处理...
        if ([200, 201].includes(res.statusCode)) {
          if (res.data) {
            try {
              res.data = JSON.parse(res.data)
            } catch (err) {
              console.log('fetch parse err.', err)
            }
          }
          return res.data
        }
        throw res
      })
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      .catch(e => errHandler(e, params, paramsStrKey))
}

/**
 * 错误处理
 * @param {*} err  错误信息
 * @param {*} params  请求参数
 */
async function errHandler(err, params, paramsStrKey) {
  delete fetchCache[paramsStrKey]

  // TODO  自定义错误处理...
  // const { status } = err
  // if (status === 401) {
  //   if (params.url === API.login) {   // 过滤刷新token接口
  //     return Taro.redirectTo({ url: LINK.USER_LOGINBYCODE })
  //   }
  //   const newToken = await userManager.refreshToken()
  //   if (newToken) {
  //     return await fetch(params)
  //   }
  //   return Taro.redirectTo({ url: LINK.USER_LOGINBYCODE })
  // }

  Taro.showToast({
    title: (err.message || err.errMsg) + '' ,
    icon: 'none',
    duration: 1700
  })

  throw err
}