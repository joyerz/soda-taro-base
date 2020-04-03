import { buildRedux } from 'store/helper'
import { combineReducers } from 'redux'
import api from 'config/api'

export const list = buildRedux('Index')({
  url: api.login,
})

export default combineReducers({
  list: list.reducer,
})
