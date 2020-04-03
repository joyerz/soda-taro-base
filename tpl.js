/**
 * 生成路由生成脚本，命令 npm run tpl 'routername'
 * 包括 page、redux、saga、Link
 */
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const dirName = process.argv[2]

if (!dirName) {
  console.log(chalk.red(` 请输入路由名称 \n eg: $ npm run tpl test (or $ yarn tpl test)`))
  process.exit(0)
}

/**
 * 模板
 */
const funName = toHump(dirName).replace(/\-/g, '_')
const tsxTpl = `import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { bindActionCreators } from 'redux'
import { connect } from '@tarojs/redux'
import { } from './redux'

import style from './index.module.scss'

type Props = {

}

type State = {
  
}

class ${funName} extends Component<Props, State> {

  config = {
    navigationBarTitleText: '${funName}'
  }

  render() {
    return (
      <View className={style.index}>
        ${dirName.toLocaleLowerCase()} created.
      </View>
    )
  }
}

export default connect(
  (state: TState) => {
    return {
      // TODO...
    }
  },
  dispatch => bindActionCreators(
    {
      // TODO...
    },
    dispatch,
  ),
)(${funName})

`

const scssTpl = `// @import '../../assets/style/index';

.index {
  color: black;
}`

const reduxTpl = `import { buildRedux } from 'store/helper'
import { combineReducers } from 'redux'

export const list = buildRedux('${funName}')({

})

export default combineReducers({
  list: list.reducer,
})
`

const pageTplConf = [
  {
    filename: 'index.tsx',
    tpl: tsxTpl,
  },
  {
    filename: 'index.module.scss',
    tpl: scssTpl,
  },
  {
    filename: 'redux.ts',
    tpl: reduxTpl,
  },
]

const _dirPwd = path.resolve(`./src/pages/${dirName.replace(/^\//, '')}`)
const reducerPwd = path.resolve(`./src/store/reducers.ts`)

if (fs.existsSync(`${_dirPwd}/index.ts`)) {
  inquirer
    .prompt([
      {
        type: 'list',
        message: `检测到 [${_dirPwd}] 已存在, 是否替换？`,
        name: 'exisit',
        choices: ['no', 'yes'],
      }
    ])
    .then(({ exisit }) => {
      if (exisit === 'no') {
        process.exit(0)
        return
      }
      run(true)
    })
} else {
  run()
}

/**
 * 执行生成过程
 * @param {*} exisit 目录是否存在（存在则忽略app.js 和link.js的追加）
 */
function run(exisit) {
  if (!exisit) {
    // 新增src/app.js路由配置
    replaceTpl('./src/app.tsx', `'pages/${dirName}/index',\n\t\t\t// __PUSH_DATA`)

    // 新增src/utils/link.js配置
    replaceTpl('./src/utils/link.ts', {
      '// __PUSH_DATA': `${dirName.toLocaleUpperCase().replace('/', '_')}: '/pages/${dirName}/index',\n\t// __PUSH_DATA`
    })

    // 替换config 中的  h5自定义路由 （如果是h5项目的情况下） '/pages/index/index': '/index',
    replaceTpl(
      './config/index.js',
      {
        '// __PUSH_CUSTOMROUTERS': `'/pages/${dirName}/index': '/${dirName.toLocaleLowerCase()}',\n\t\t\t\t// __PUSH_CUSTOMROUTERS`,
      },
      () => {
        // console.log(chalk.bgMagenta('\n  自定义路由已更新，需要重启服务!  \n'))
      }
    )
  }

  // 创建切换至${dirName}目录
  if (!fs.existsSync(_dirPwd)) {
    mkdirsSync(_dirPwd)
  }
  process.chdir(_dirPwd)

  let msg = exisit ? chalk.blue('[已更新] ') : chalk.green('[已创建] ')

  // 写入模板
  for (let tpl of pageTplConf) {
    fs.writeFileSync(tpl.filename, tpl.tpl)
    console.log(msg + chalk.green(`/src/pages/${dirName}/` + tpl.filename))
  }


  // 更新./src/store/reducers.js
  try {
    let _reduxTxt = fs.readFileSync(reducerPwd)
    _reduxTxt = _reduxTxt.toString()
    fs.writeFileSync(reducerPwd, _reduxTxt)
    console.log(chalk.blue(`[已更新] `) + chalk.green(`reducer`))
  } catch (e) {
    console.log(chalk.red(`[错误] ` + e.message))
  }
  process.exit(0)
}





/**
 * 替换目标文件多处内容（或单一内容替换）
 * @param {String} filePwd 目标文件
 * @param {Object|String} content 替换的键值对或替换内容（如果为字符串，则默认替换'// __PUSH_DATA'）
 *
  ```javascript
    # eg:
    replaceTpl(
        './src/app.js',
        {
          '// __PUSH_DATA': `'pages/${dirName}/index',\n\t\t\t// __PUSH_DATA`,
        }
    )

    or
    replaceTpl('./src/app.js', `'pages/${dirName}/index',\n\t\t\t// __PUSH_DATA`)
  ```
 */
function replaceTpl(filePwd, content, fn) {
  let initPwd = filePwd
  filePwd = path.join(__dirname, filePwd)
  const isExist = fs.existsSync(filePwd)
  if (!isExist) {
    return console.log(chalk.red(`${filePwd} 不存在`))
  }
  let _txt = fs.readFileSync(filePwd)
  _txt = _txt.toString()
  if (Object.prototype.toString.call(content) === '[object Object]') {  // 多处替换
    Object.keys(content).forEach(k => {
      _txt = _txt.replace(k, content[k])
    })
  } else {
    _txt = _txt.replace('// __PUSH_DATA', content)
  }
  fs.writeFileSync(filePwd, _txt)
  console.log(chalk.blue('[已更新] ') + chalk.green(`${initPwd}`))
  fn && fn()
}


/**
 * pwd字符串转驼峰   eg: login/code => LoginCode
 * @param {String} str 目标字符串
 */
function toHump(str = '') {
  if (str.length < 1) return
  str = str.replace(/\/\w/g, item => {
    item = item.replace('/', '')
    item = firstToLocaleUpperCase(item)
    return item
  })
  return firstToLocaleUpperCase(str)
}

function firstToLocaleUpperCase(str) {
  return str.charAt(0).toLocaleUpperCase() + str.substr(1)
}

/**
 * 创建多级目录
 * @param {String} dirname 目录名称 eg: a/b/c or a
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true
  }
  return false
}