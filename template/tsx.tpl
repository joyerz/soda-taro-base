import Taro, { Component, CommonPageConfig } from '@tarojs/taro'
import { InitState, Entries } from 'src/@types/state'
import { injcet, Action } from 'store/helper'
import { View } from '@tarojs/components'

import style from './index.module.scss'

interface Props {
  list: InitState<Entries>
}

interface State {
  state1: string
}

@injcet(['${funName}'])
class ${funName} extends Component<Props, State> {

  config: CommonPageConfig = {
    navigationBarTitleText: '${funName}'
  }

  componentDidMount() {
    Action.${funName}.start()
  }

  render() {
    return (
      <View className={style.index}>
        ${dirName} created.
      </View>
    )
  }
}

export default ${funName}