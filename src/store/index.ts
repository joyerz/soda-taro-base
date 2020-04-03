import { createStore, applyMiddleware, compose, } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { APP_NAME } from 'config/index'
import rootReducer from './reducers'
import rootSaga from './sagas'


const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      name: APP_NAME
    }) : compose

const middlewares = [
  sagaMiddleware,
]

// if (process.env.NODE_ENV === 'development') {
//   middlewares.push(require('redux-logger').createLogger())
// }

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
)

const store = createStore(rootReducer, enhancer)
sagaMiddleware.run(rootSaga)

export default store