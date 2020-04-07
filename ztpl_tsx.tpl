import Taro, { Component } from '@tarojs/taro'
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
  list: state.${funName}.list
}))
class ${funName} extends Component<Props, State> {

  config = {
    navigationBarTitleText: '${funName}'
  }

  componentDidMount() {
    Actions.${funName}.start()
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