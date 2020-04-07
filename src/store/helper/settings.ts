// 初始化配置

import fetch from 'utils/fetch'

// eslint-disable-next-line import/no-mutable-exports
export let options = {
  logger: true, // redux-logger
  middleware: [], // middleware
  fetchMethod: fetch,
}

export default function config(opts) {
  options = {
    ...options,
    ...opts
  }
}