import connectSaga, { sagas as _sagas, reducers as _reducers } from './connectSaga'
import { buildRedux as _buildRedux, } from './helper'

import _config from './settings'

export default {}

export const buildRedux = connectSaga(_buildRedux)
export const sagas = _sagas
export const reducers = _reducers
export const config = _config