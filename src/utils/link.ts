import Taro from '@tarojs/taro'

/**
 * all route url cfg
 */
const LINK = {
	INDEX: '/pages/Index/index',
	// __PUSH_DATA
}

export default LINK

const routeNames = Object.keys(LINK)
/**
 * 路由跳转
 * @param {*} name 路由名称 /src/utils/link keys
 * @param {*} params url参数
 */
export const routerTo = (name, params = {}) => {
  if (!routeNames.includes(name)) {
    return Taro.showModal({
      title: '提示',
      content: 'name 不存在'
    })
  }
  let query = ''
  for (const k in params) {
    query += `${k}=${params[k]}&`
  }
  Taro.navigateTo({
    url: LINK[name] + '?' + query,
  })
}

export const routerBack = (num = 1) => {
	Taro.navigateBack({
		delta: num
	})
}