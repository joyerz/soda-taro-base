import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import { isH5 } from 'utils/common'

import Index from './pages/Index'

import store from './store'

import './app.scss'

import { VERSION } from './config'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5') {
  require('nerv-devtools')
}


// 自定义H5 404跳转
if (isH5) {
  const { location } = window
  if (!window.name) {
    location.href += (location.href.includes('?') ? '&' : '?') + `__t=${Math.random()}`
    window.name = 'isReload'
  }
  window.onerror = e => {
    if (e.match('Can not find proper registered route for')) {
      location.href = '/'
    }
  }
  // 储存第一次进入的页面路径 （iOS微信用到）
  sessionStorage.setItem('INT_URL', location.href.split('#')[0])
}

class App extends Component {

  async componentDidMount() {
    this.checkVersion()
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/Index/index',
			// __PUSH_DATA
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  /**
   * 版本检测
   */
  checkVersion() {
    const vK = '_version'
    const localV = Taro.getStorageSync(vK)
    if (localV !== VERSION) {
      Taro.clearStorageSync()
      Taro.setStorageSync(vK, VERSION)
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
