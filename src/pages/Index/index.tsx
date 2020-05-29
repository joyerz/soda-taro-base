import Taro, { Component, CommonPageConfig } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import { InitState, Entries, TState } from 'src/@types/state'
import { Action, injcet } from 'store/helper'

import style from './index.module.scss'

interface Props {
  list?: InitState<Entries>
  Index: TState['Index']
}

interface State {
  state1: string
}

@injcet(['Index'])
class Index extends Component<Props, State> {

  config: CommonPageConfig = {
    navigationBarTitleText: 'title',
  }

  componentDidMount() {
    Action.IndexBanner.start()
  }

  render() {
    return <View className={style.index}>
      Index created.
      </View>
  }
}

export default Index