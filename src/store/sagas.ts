import { all } from 'redux-saga/effects'
import { sagas, } from 'store/helper'

export default function* () {
  yield all(sagas)
}