import { put, call, takeLatest, select, delay } from 'redux-saga/effects'
import fetchMethod from 'utils/fetch'
import { underScoreToCamel, notNullOrUndefiend } from './common'
// import { options } from './settings'
import { Actions } from './actions'
import store from '..'


interface CbConfig {
  put: () => void
  call: () => void
  getAction(actionName: string): any
  getState(modelName: string): any
}

type UrlFn = (payload: any, callbackConfig: CbConfig) => string

type configType = {
  url?: string | UrlFn
  data?: object | UrlFn
  method?: 'get' | 'post' | 'put' | 'delete'
  headers?: any
  extract?: any
  onResult?: (result: any, payload: any, callbackConfig: CbConfig) => Promise<any>
  onAfter?: (result: any, payload: any, callbackConfig: CbConfig) => Promise<any>
  onError?: (result: any, payload: any, callbackConfig: CbConfig) => Promise<any>
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
export const sagas: any[] = []

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
  
  if (Actions[name]) {
    console.error(`Actions.${name}已存在! 请重新命名。`)
  }
  Actions[name] = {}

  for (const action in redux.actions) {
    Actions[name][action] = payload => store.dispatch(redux.actions[action](payload))
  }

  return (conf: configType): reducerType => {
    if (conf.url) {   // 如果没有接受到url参数，则不创建对应saga
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const watch = createWatcher(redux, conf)
      sagas.push(watch)
    }
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
  yield takeLatest(redux.types.START, function* ({ payload }: any) {
    conf = conf || {}
    // eslint-disable-next-line prefer-const
    let { url, data = {}, method, headers = {}, extract = {}, onResult, onAfter, onError, } = conf

    const callbackConfig: any = {
      ...effects,
      getAction: getAction,
      getState: getState,
    }
    try {
      // url处理
      url = typeof url === 'function' ? yield url(payload, callbackConfig) : url
      method = (method ? method.toUpperCase() : 'GET') as never

      // data处理
      if (typeof data === 'function') {
        data = yield call(data as any, payload, callbackConfig)
      }

      if (Object.prototype.toString.call(data) === '[object Object]' && payload.params) {
        data = {
          ...payload.params,
        }
      }


      let result

      // fetch方法是否定义
      result = yield call(fetchMethod, {
        url,
        method,
        data,
        headers,
        ...extract,
      })


      // data handler
      if (onResult) {
        const fallbackResult = yield call(onResult, result, payload, callbackConfig)

        // 判断fallbackResult不是null, undefined, 即使是空也要采用
        result = notNullOrUndefiend(fallbackResult)
          ? fallbackResult
          : result
      }

      yield put(redux.actions.success(result))

      // after data handled callback
      if (onAfter) {
        yield call(onAfter, result, payload, callbackConfig)
      }
      if (payload.callback) {
        yield delay(30)
        yield call(payload.callback)
      }
    } catch (err) {
      console.log(err)
      payload.callback && payload.callback()

      // error handler
      if (onError) {
        yield call(onError, err, payload, callbackConfig)
      }
    }
  })
}