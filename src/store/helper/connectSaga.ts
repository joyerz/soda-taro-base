import { put, call, takeLatest, select, delay } from 'redux-saga/effects'
import { underScoreToCamel, notNullOrUndefiend } from './common'
import { options } from './settings'


type configType = {
  url: string | Function
  data?: any
  method?: 'get' | 'post' | 'put' | 'delete'
  headers?: any
  extract?: any
  onResult?: (result?: any, payload?: any, callbackConfig?: any) => Promise
  onAfter?: (result?: any, payload?: any, callbackConfig?: any) => any
  onError?: (result?: any, payload?: any, callbackConfig?: any) => any
}

type reducerType = {
  actions: {
    start: Function
    success: Function
    error: Function
    reset: Function
  }
  types: {
    START: string
    SUCCESS: string
    ERROR: string
    RESET: string
  }
  reducer: any
}


// 常规sagas的操作
const effects = {
  put,
  call
}

// 全局的redux actions
export const allActions = {}
export const sagas = []
export const reducers = {}

// 获取全局的action
const getAction = (actionName) => allActions[actionName]

// 获取全局的state
const getState = function* (child) {
  const get = state => state[child]
  return yield select(get)
}

/**
 * 创建reduce时自动关联saga
 */
export default reduxer => (...args) => {
  const redux = reduxer.call(null, ...args)
  const name = underScoreToCamel(args[0])

  allActions[name] = redux.actions
  reducers[name] = redux.reducer

  return (conf: configType): reducerType => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const watch = createWatcher(redux, conf)
    sagas.push(watch)
    return redux
  }
}

/**
 * add watcher
 * @param redux
 * @param conf
 * @return {IterableIterator<ForkEffect>}
 */
function* createWatcher(redux, conf: configType) {
  yield takeLatest(redux.types.START, function* ({ payload }) {
    conf = conf || {}
    // eslint-disable-next-line prefer-const
    let { url, data = {}, method, headers = {}, extract = {}, onResult, onAfter, onError, fetch } = conf

    const callbackConfig = {
      ...effects,
      getAction: getAction,
      getState: getState,
    }
    try {
      // url处理
      url = typeof url === 'function' ? yield url(payload, callbackConfig) : url
      method = method ? method.toUpperCase() : 'GET'

      // data处理
      if (typeof data === 'function') {
        data = yield data(payload, callbackConfig)
      }

      if (Object.prototype.toString.call(data) === '[object Object]' && payload.params) {
        data = {
          ...payload.params,
          ...data,
        }
      }


      let result

      // fetch方法是否定义
      const fetchMethod = fetch ? fetch : options.fetchMethod
      if (fetchMethod && url) {
        result = yield call(fetchMethod, {
          url,
          method,
          data,
          headers,
          ...extract,
        })
      }

      // data handler
      if (onResult) {
        const fallbackResult = yield call(onResult, result || data, payload, callbackConfig)

        // 判断fallbackResult不是null, undefined, 即使是空也要采用
        result = notNullOrUndefiend(fallbackResult)
          ? fallbackResult
          : result
      }
      // autoActions
      if (options.autoActions) {
        yield put(redux.actions.success(result))
      }

      // after data handled callback
      if (onAfter) {
        yield call(onAfter, result, payload, callbackConfig)
      }
      if (payload.fn) {
        yield delay(30)
        yield call(payload.fn, )
      }
    } catch (err) {
      payload.fn && payload.fn()
      // autoActions
      if (options.autoActions) {
        yield put(redux.actions.reset())
      }

      // error handler
      if (onError) {
        yield call(onError, err, payload, callbackConfig)
      }
    }
  })
}