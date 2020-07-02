# Mobile App By Taro


> used：Taro、redux、redux-saga、sass、Typescript  (nodejs v10.15.1、@tarojs/cli v2.0.7)

### TaroCli 全局安装 **(必须)**

``` bash
# 使用 npm 安装 CLI
$ npm install -g @tarojs/cli@2.0.7

# OR 使用 yarn 安装 CLI
$ yarn global add @tarojs/cli@2.0.7

# OR 安装了 cnpm，使用 cnpm 安装 CLI
$ cnpm install -g @tarojs/cli@2.0.7
```


### 安装

``` bash
$ npm install / yarn install
```


### 启动

``` bash
$ npm run dev:h5 / yarn dev:h5

# Mac
$ ./run.sh dev:h5
```

### 新增路由

```bash
# 务必安装全局工具 soda-bo-cli
$ sbc new PageName   # 支持多级目录 例如： sbc new User/Update
```


### 编译

``` bash
$ npm run build:** / yarn build:**
```

### 关于数据流

创建reducer 和 action(插件会遍历`src/pages`下的所有`redux.ts`文件):

```javascript
// src/pages/Index/redux.ts

export const list = buildRedux('IndexBanner')({
  url: api.login,  // * (payload, {getState}) => '/url'
  method: 'get',
})
export const detail = buildRedux('BannerDetail')({
  url: api.login,  // * (payload, {getState}) => '/url'
  method: 'get',
})
```

以上会创建: 
|state|action|
|-|-|
|`state.Index.list`|`Action.IndexBanner.start()/Action.IndexBanner.start()...`|
|`state.Index.detail`|`Action.BannerDetail.start()/Action.BannerDetail.start()...`|

> `state.Index.list` 和 `state.Index.detail` 中的 `Index` 为 文件夹名称 `pages/Index/redux.ts` 中的`Index`（多级目录 `/pages/User/Login => UserLogin``）。buildRedux` 中的第一个参数则是 `Action`的名称。

> `Action` 为 `import { Action } from 'store/helper'` 提供

***你依然可以通过`connect`方法来连接调用 =>` @connect(state => {...}, dispatch => {...})`***

state关联数据：

`'store/helper'` 提供了 `inject` 方法(此方法只能关联整个模块到组件,且不能自定义名称, 只是提供了自能提示)：
```tsx
import { inject } from 'store/helper'

@inject('Index')
class Home extends Taro.PureComponent {
  componentDidMount() {
    this.props.Index // {list: {...}, detail: {...}}
  }
}
```
> `inject` 参数为字符串 或者 数组


state结构图为：

![](./redux.png)
