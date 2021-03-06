import { buildRedux } from 'store/helper'
import api from 'config/api'

export type DemoPayload = Payload<{
  id: number
  page: number
}>

export const MODULE_NAME = ''

export const list = buildRedux('${funName}')({
  url: api.login,  // * (payload, {getState}) => '/url'
  method: 'get',
  // *data(payload, { put }) { return {} },  // * 请求发送的数据处理，返回一个新的
  // *onResult(res, payload: DemoPayload, { put }) { return {} },   // * 处理数据返回一个新的数据
  // *onAfter() {},  // * action.success 后 执行的操作
  // *onError() {},  // *  错误处理
})