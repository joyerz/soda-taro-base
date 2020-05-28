import { createAction, handleActions } from 'redux-actions'
import SeamlessImmutable from 'seamless-immutable'

/**
 * @desc normal
 * @param actionName {string}, e.g. load_item
 * @param  defaultData {object}
 */
export const buildRedux = (actionName, defaultData = {}) => {
  const initialState = () =>
    SeamlessImmutable({
      loading: false,
      error: false,
      success: false,
      params: null,
      data: {
        page: 1,
        'per_page': 10,
        'total_count': 0,
        'total_page': 0,
        entries: [],
      },
      ...defaultData,
    })

  const START = `${actionName}_START`
  const SUCCESS = `${actionName}_SUCCESS`
  const ERROR = `${actionName}_ERROR`
  const RESET = `${actionName}_REST`

  const start = createAction(START, (params = null, fn) => ({ params, fn }))
  const reset = createAction(RESET)
  const success = createAction(SUCCESS, data => ({ data }))
  const error = createAction(ERROR, errorMessage => ({ errorMessage }))

  const reducer = handleActions(
    {
      [START]: (state, { payload = {} }: any = {}) =>
        state.merge({
          loading: true,
          error: false,
          success: false,
          params: payload.params,
        }, {
          deep: true,
        }),
      [SUCCESS]: (state, { payload = {} }: any = {}) =>
        state.merge({
          loading: false,
          error: false,
          success: true,
          data: payload.data,
        }, {
          deep: true,
        }),
      [ERROR]: () =>
        SeamlessImmutable({
          loading: false,
          error: true,
          success: false,
        }),
      [RESET]: () => initialState(),
    },
    initialState(),
  )

  return {
    actions: {
      start,
      success,
      error,
      reset,
    },
    types: {
      START,
      SUCCESS,
      ERROR,
      RESET,
    },
    reducer,
  }
}


export default null