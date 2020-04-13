import Taro, { Component, CommonPageConfig } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect, } from '@tarojs/redux'
import { Actions } from 'store/helper/actions'

import style from './index.module.scss'

interface Props {
  list: InitState<Entries>
}

interface State {
  state1: string
}

@connect((state: TState) => ({
  list: state.Index.list
}))
class Index extends Component<Props, State> {

  config: CommonPageConfig = {
    navigationBarTitleText: 'title',
  }

  componentDidMount() {
    Actions.IndexBanner.start()
  }

  render() {
    return <View className={style.index}>
      Index created.
      </View>
  }
}

export default Index