const path = require('path')

const config = {
  projectName: 'taroLayout',
  date: '2020-3-30',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  babel: {
    sourceMap: true,
    presets: [
      ['env', {
        modules: false
      }]
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      [
        'transform-runtime', {
          helpers: false,
          polyfill: false,
          regenerator: true,
          moduleName: 'babel-runtime'
        }
      ]
    ]
  },
  defineConstants: {
  },
  alias: {
    'components': path.resolve(__dirname, '..', 'src/components'),
    'utils': path.resolve(__dirname, '..', 'src/utils'),
    'config': path.resolve(__dirname, '..', 'src/config'),
    'assets': path.resolve(__dirname, '..', 'src/assets'),
    'store': path.resolve(__dirname, '..', 'src/store'),
    'layout': path.resolve(__dirname, '..', 'src/layout'),
    'services': path.resolve(__dirname, '..', 'src/services'),
    'package': path.resolve(__dirname, '..', 'package.json'),
    'project': path.resolve(__dirname, '..', 'project.config.json'),
    'pages': path.resolve(__dirname, '..', 'src/pages'),
    'src': path.resolve(__dirname, '..', 'src'),
  },
  copy: {
    patterns: [
      { from: 'src/static', to: `dist/${process.env.TARO_ENV}/static`, ignore: '*.js' }, // 指定需要 copy 的目录
      { from: 'sitemap.json', to: 'dist/sitemap.json' } // 指定需要 copy 的文件
    ]
  },
  mini: {
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    // 路由配置
    router: {
      mode: 'browser',
      basename: '/',  // 基准路径的配置
      customRoutes: {   // 自定义路由配置  调用 Taro.navigateTo({ url: '/pages/index/index' }) 后，浏览器地址栏将被变为 http://{{domain}}/#/index
        '/pages/Index/index': '/index',
				// __PUSH_CUSTOMROUTERS
      },
    },
    esnextModules: ['taro-ui'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
