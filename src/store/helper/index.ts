import { connect } from '@tarojs/redux'
import { TState } from 'src/@types/state'
import connectSaga, { sagas as _sagas, } from './connectSaga'
import { buildRedux as _buildRedux, } from './helper'

import { Actions } from './actions'

export default {}

export const buildRedux = connectSaga(_buildRedux)
export const sagas = _sagas

export const Action: ActionsType = Actions

type AllModel = keyof TState

/**
 * 关联模块到组件
 * @param name 模块名称
 */
export function injcet(name: AllModel[] | AllModel) {
  let mapProps: any
  if (typeof name === 'string') {
    mapProps = state => ({
      [name]: state[name]
    })
  } else {
    mapProps = state => {
      const props = {}
      name.map(item => {
        props[item] = state[item]
      })
      return props
    }
  }
  return connect<any>(mapProps)
}
