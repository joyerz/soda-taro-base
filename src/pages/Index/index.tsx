import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { bindActionCreators } from 'redux'
import { connect, } from '@tarojs/redux'
import { bindActionCreators } from 'redux'
import store from 'store/index'
import { list } from './redux'

import style from './index.module.scss'
import { allActions } from 'store/helper/connectSaga'

type Props = {

}

type State = {

}

@connect(
  (state: TState) => {
    return {
      list: state.Index.list
    }
  },
  dispatch => bindActionCreators(
    {
      onActionList: list.actions.start,
    },
    dispatch,
  ),
)
class Index extends Component {

  config = {
    navigationBarTitleText: 'title'
  }

  componentDidMount() {
    // this.props.onActionList()
    store.dispatch(list.actions.start())
    console.log(allActions)
  }

  render() {
    return <View className={style.index}>
        Index created.
      </View>
  }
}

export default Index