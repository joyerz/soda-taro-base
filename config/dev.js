const ReduxSagaAutoMerge = require('./reduxSagaAutoMerge')

ReduxSagaAutoMerge.addWatcher()

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {},
  h5: {
    devServer: {
      port: 1070,
      // https: true,
      proxy: {
        "/api": {
          target: 'http://fleetabdev.sodacar.com/api',
          changeOrigin: true,
          pathRewrite: { "^/api": "" },
        }
      },
    }
  }
}
