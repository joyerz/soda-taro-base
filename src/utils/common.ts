import Taro from '@tarojs/taro'
import { STORAGE_PREFIX, } from '../config'

const ua = navigator ? navigator.userAgent : ''

/**
 * 是否是h5程序
 */
export const isH5 = process.env.TARO_ENV === 'h5'

/**
 * 简单数据深拷贝
 * @param {Object} obj
 */
export const simpleClone = (obj) => {
  if (obj) {
    if (typeof obj === 'object') {
      return JSON.parse(JSON.stringify(obj))
    } else {
      return obj
    }
  } else {
    return null
  }
}

/** 返回一个延时的promise
 * @param duration: 延迟时间,单位秒
 * @param cb: callback 延迟后执行
 * @returns {Promise}
 */
export function delay(duration) {
  duration = duration ? duration * 1000 : 3000
  return new Promise(reslove => {
    setTimeout(reslove, duration)
  })
}

function getStorage(key) {
  try {
    const value = Taro.getStorageSync(STORAGE_PREFIX + key)
    if (value) {
      return value
    }
  } catch (e) {
    console.log(e.message)
    return null
  }
}

function saveStorage(key, value) {
  try {
    Taro.setStorageSync(STORAGE_PREFIX + key, value)
  } catch (e) {
    console.log(e.message)
  }
}

function removeStorage(key) {
  try {
    Taro.removeStorageSync(STORAGE_PREFIX + key)
  } catch (e) {
    console.log(e.message)
  }
}

function clearStorage() {
  try {
    Taro.clearStorageSync()
  } catch (e) {
    console.log(e.message)
  }
}

/**
 *storage操作
 */
export const storage = {
  get: getStorage,
  set: saveStorage,
  remove: removeStorage,
  clear: clearStorage,
}



/**
 * 输入框输入监听
 * @param {String} field 修改的state名称
 * @param {Event} e
 */
export function inputListener(field, e) {
  this.setState({
    [field]: e.currentTarget.value.trim(),
  })
}

/**
 * 手机号码格式验证
 * @param {String | Number} mobile
 */
export const isMobile = mobile => /^1\d{10}/.test(mobile)


/**
 * 获取微信code
 */
export function getWxCode() {
  return Taro.login().catch(e => {
    console.log(e.message)
  })
}

/**
 * 条件完成
 * @param {*} condition  resolve 条件
 * @param {*} timeout    超时时间 （s）
 */
export const conditionReady = (condition, timeout = 60) => new Promise((resolve, reject) => {
  if (typeof condition !== 'function') throw new Error('condition not is a func.')
  const now = +new Date()
  timeout *= 1000
  const checkReady = () => {
    if (+new Date() > (now + timeout)) {
      return reject('timeout.')
    }
    if (condition()) {
      resolve()
    } else {
      setTimeout(checkReady, 100)
    }
  }
  checkReady()
})



/**
 * 读取object的多级下的属性，防止某级为null读取报错
 * 举个栗子：goc(object, 'a.b.c');
 *
 * @param obj
 * @param str
 * @return {*}
 */
export function goc(obj, str) {
  if (!obj) return '';

  if (typeof obj === 'object') obj = simpleClone(obj);
  if (typeof obj !== 'object') return obj;
  if (str.indexOf('.') === -1) {
    if (obj[str] === undefined) {
      return '';
    } else {
      return obj[str];
    }
  }

  const params = str.split('.');
  let data = obj;
  for (let i = 0, j = params.length; i < j; i++) {
    const child = params[i];
    if (child !== '') {
      if (data[child] === undefined || data[child] === null) {
        data = '';
        break;
      } else {
        data = data[child];
      }
    }
  }
  return data;
}

/**
 * input 失去焦点后 页面显示不完整 兼容
 */
export const blurAdjust = () => {
  if (!isH5) return
  setTimeout(() => {
    if (!document.activeElement) return
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName || '')) {
      return
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(ua)) {
      try {
        (document as any).activeElement.scrollIntoViewIfNeeded()
      } catch (error) {
        console.log(error)
      }
    }
  }, 100)
}


/**
 * 防抖
 * @param {*} func 执行的方法
 * @param {*} wait 间隔时间
 */
export const debounce = (fn, wait) => {
  let timer: any = null
  wait = wait || 200
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}

/**
 * 节流
 * @param {*} func
 * @param {*} wait
 */
export const throttle = (fn, wait) => {
  let prevTime = Date.now()
  wait = wait || 200
  return (...args) => {
    const now = Date.now()
    if (now > prevTime + wait) {
      fn(...args)
      prevTime = now
    }
  }
}

/**
 * 小数转百分百
 * @param {*} num
 */
export const toPercent = num => {
  num = (num * 100).toFixed(2)
  num += '%'
  return num
}

const loadScriptCache = {}
/**
 * 加载一个库 并且监听是否加载完成
 * @param {*} url
 * @param {*} id
 */
export const loadScript = (url, id) => {
  if (!url || !id) return Promise.reject('url/id not is null')
  if (loadScriptCache[id]) {
    return loadScriptCache[id]
  }
  loadScriptCache[id] = new Promise((resolve) => {
    const script: any = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.id = id
    document.body.appendChild(script)
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (['loaded', 'complete'].includes(script.readyState)) {
          script.onreadystatechange = null
          resolve()
        }
      }
    } else {
      script.onload = resolve
    }
  })
  return loadScriptCache[id]
}

/**
 * 函数转promise
 * @param {Function} fn
 */
export const toPromise = fn => new Promise((resolve, reject) => fn(resolve, reject))




/**
 * 是否是iOS
 */
// export const isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)

/**
 * 是否是android
 */
// export const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1



/**
 * 数字处理 (显示自定义小数长度 不四舍五入)
 * @param {*} target 目标数字
 * @param {*} nullFill 数字为空填充字符 为空默认用 '-' 填充
 * @param {*} fixedNum 显示几位（默认显示1位小数）
 */
export function numberHandler(target, nullFill = '-', fixedNum = 1) {
  if (target !== 0 && !target) return nullFill
  let result = target
  const resarr = target.toString().split('.')
  if (resarr.length > 1) {
    result = resarr[0] + '.' + resarr[1].substr(0, fixedNum)
  }
  return parseFloat(result)
}

/**
 * 秒 转换成 小时
 * @param {*} s
 * @param {*} fixedNum 显示几位（默认显示1位小数）
 */
export const sTohour = (s: any, fixedNum: any) => numberHandler(s ? s / 60 / 60 : 0, 0 as any, fixedNum)

/**
 * m 转换为 km
 * @param {*} m  目标数字
 * @param {*} nullFill 为空 填充 默认为 0
 * @param {*} fixedNum 显示几位（默认显示1位小数）
 */
export const mTokm = (m, nullFill = 0, fixedNum) => numberHandler(m / 1000, nullFill as any, fixedNum)

/**
 * 1 - 9的数字转换为 01 02 ...
 * @param {*} num
 * @returns string
 */
export const numCompletion = num => (num < 10 && num >= 0) ? '0' + num : '' + num

/**
 * 判断是否为相同一天 (匹配年月日)
 * @param {Date} date1
 * @param {Date} date2
 */
export const isSameDay = (date1, date2) => {
  if (date1.getFullYear() !== date2.getFullYear()) return false
  if (date1.getMonth() !== date2.getMonth()) return false
  if (date1.getDate() !== date2.getDate()) return false
  return true
}


/**
 * 返回一个安全的电话号码
 * eg:
 * ```js
 * safeMobile(133333333333) // 133****3333
 * ```
 * @param {*} mobile 需要处理的电话（必须为11位）
 */
export const safeMobile = mobile => {
  if (!mobile) return console.log('[safeMobile] 电话不能为空')
  mobile = mobile.toString()
  if (mobile.length !== 11) return console.log('[safeMobile] 电话长度必须为11位')
  return mobile.substr(0, 3) + '****' + mobile.substr(-4)
}

/**
 * 禁用H5页面滚动事件
 */
export const disableWindowMove = () => {
  if (isH5) {
    document.body.style.overflow = 'hidden'
  }
}
/**
 * 启用用H5页面滚动事件
 */
export const enableWindowMove = () => {
  if (isH5) {
    document.body.style.overflow = ''
  }
}

/**
 * 返回 num 天
 */
export const day = num => num * 86400000

/**
 * 返回 num 小时
 */
export const hoursNum = num => num * 3600000

/**
 * 返回 num 分钟
 */
export const minutes = num => num * 1000 * 60

/**
 * 返回手机时间格式   （可扩展）
 * 默认格式 YYYY/MM/DD
 * format为common时代表“2019年5月9号 10:00”的格式
 */
export const formatDate = (date, format: 'YYYY/MM/DD' | 'YYYY/MM/DD hh' | 'YYYY/MM/DD hh:mm' | 'YYYY/MM/DD hh:mm:ss' | 'common' = 'YYYY/MM/DD') => {
  if (!date) return ''
  const _d = new Date(date)
  const year = _d.getFullYear(),
    month = numCompletion(_d.getMonth() + 1),
    _day = numCompletion(_d.getDate()),
    hour = numCompletion(_d.getHours()),
    _minutes = numCompletion(_d.getMinutes()),
    seconds = numCompletion(_d.getSeconds())
  let ymd = `${year}/${month}/${_day}`
  if (format === 'YYYY/MM/DD') {
    return ymd
  } else if (format === 'common') {
    return `${year}年${month}月${_day}日 ${hour}:${_minutes}`
  } else if (format === 'YYYY/MM/DD hh') {
    ymd = `${ymd} ${hour}`
    return ymd
  } else if (format === 'YYYY/MM/DD hh:mm') {
    ymd = `${ymd} ${hour}:${_minutes}`
    return ymd
  }
  return `${ymd} ${hour}:${_minutes}:${seconds}`
}

export const weekends = ['周日', '周一', '周二', '周三', '周四', '周五', '周六',]
/**
 * 返回 2-26 周二 10:00 格式
 */
export const formatDateHasWeek = date => {
  if (!date) return ''
  const _d = new Date(date)
  return `${numCompletion(_d.getMonth() + 1)}-${numCompletion(_d.getDate())} ${weekends[_d.getDay()]} ${numCompletion(_d.getHours())}:${numCompletion(_d.getMinutes())}`
}

/**
 * promise 检查条件成立后返回resolve
 * @param condition
 * @param times
 * @return {Promise}
 */
export const isReady = (condition, times = 30) => {
  return new Promise(resolve => {
    let count = 0
    const checkReady = () => {
      if (condition()) {
        resolve()
      } else {
        count++
        if (times === 0) {
          setTimeout(checkReady, 200)
        } else if (count < times) {
          setTimeout(checkReady, 200)
        }
      }
    }
    checkReady()
  })
}

/**
 * 将对象转变为 params string
 * e.g. { name: 'user', age: 13} => name=user&age=13
 * @param obj
 * @return {*}
 */
export const obj2params = (obj, prefix = '', suffix = '') => {
  if (typeof obj !== 'object' || !obj) return ''

  const params = []
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (obj[key] instanceof Object) { // 数组和对象特殊处理
        params.push(`${key}=${JSON.stringify(obj[key])}` as never)
      } else {
        params.push(`${key}=${obj[key]}` as never)
      }
    }
  })
  return prefix + params.join('&') + suffix
}

/**
 * 富文本字符串操作
 */
export const richTextHandler = str => str ? str.replace(/\n/g, '<br />') : ''

/**
 * 检查数组是否有内容
 */
export const isNotNullArray = arr => {
  return Object.prototype.toString.call(arr) === '[object Array]' && arr.length > 0
}