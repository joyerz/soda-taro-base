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
  list: state.Coupon.list
}))
class Coupon extends Component<Props, State> {

  config = {
    navigationBarTitleText: 'Coupon'
  }

  componentDidMount() {
    Actions.IndexBanner.start()
  }

  render() {
    return (
      <View className={style.index}>
        coupon created.
      </View>
    )
  }
}

export default Coupon