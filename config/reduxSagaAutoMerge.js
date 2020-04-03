const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const os = require('os')
const log = console.log

const srcString = path.resolve(__dirname, '../src')
const folder = [
  path.resolve(__dirname, '../src/pages'),
]


const reducersTpl = path.resolve(__dirname, '../src/store/reducers.tpl')
const reducersFile = path.resolve(__dirname, '../src/store/reducers.ts')

let watching = false

// 缓存上一次写入内容，防止重复写相同内容到文件
let cache = {
  importRedux: null,
  combineRedux: null,
  importSaga: null,
  combineSaga: null,
}

// 记录所有模块名称，检测重复
let allModeNames = []

class ReduxSagaAutoMergePlugin {
  apply(compiler) {
    // 指定一个挂载到 webpack 自身的事件钩子。
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation /* 处理 webpack 内部实例的特定数据。*/, callback) => {
      // compilation.assets 为处理后的文件资源列表
      try {
        this.addWatcher()
      } catch (e) {
        log(chalk.bgRed('\n' + e.message))
      }
      // 功能完成后调用 webpack 提供的回调。
      callback()
    })
  }
  addWatcher() {
    if (!watching) {
      chokidar
        .watch(folder, {
          ignored: /\.(jsx|scss|css)$/,
        })
        .on('all', (event, path) => {
          this.convertingFiles()
        })
      watching = true
    }
  }
  convertingFiles() {
    let files = []
    folder.map(item => files = files.concat(this.readDir(item)))
    const reduxFiles = files.filter(file => /redux\.ts$/.test(file))
    this.convertRedux(reduxFiles)
  }
  /**
   * 列出目标文件夹所有文件
   * @param {*} folder
   * @return {Array}
   */
  readDir(folder) {
    const receivedFiles = []
    const files = fs.readdirSync(folder)
    files.forEach((filename) => {
      const filePath = path.join(folder, filename)
      const stats = fs.statSync(filePath)
      if (stats.isDirectory()) {
        const f = this.readDir(filePath)
        receivedFiles.push(...f)
      }
      else {
        receivedFiles.push(filePath)
      }
    })
    return receivedFiles
  }

  convertRedux(files) {
    let importRedux = ''
    let combineRedux = ''

    // handle redux files
    files.forEach((file) => {
      const { filepwd, moduleName } = this.relativePathAndMode(file)
      // if (!this.checkRepeat(filepwd, moduleName)) return
      importRedux += `import ${moduleName} from '${filepwd}'\n`
      combineRedux += `${moduleName},\n\t`
    })

    if (cache.importRedux !== importRedux || cache.combineRedux !== combineRedux) {
      let string = fs.readFileSync(reducersTpl, 'utf-8')
      string = string.replace('{{imports}}', importRedux)
      string = string.replace('{{combine}}', combineRedux)
      fs.writeFileSync(reducersFile, string, 'utf8')
      log(chalk.bgGreen.black('\ncombine redux files...'))
      cache.importRedux = importRedux
      cache.combineRedux = combineRedux
    }
  }


  /**
   * 根据路径返回引用的相对路径和模块名称
   * @param {ge} pwd
   */
  relativePathAndMode(pwd) {
    const filepwd = os.type().toLowerCase().indexOf('windows') > -1 ? pwd.replace(srcString, '').replace(/\.ts$/, '').replace(/\\/ig, '/') : pwd.replace(srcString, '').replace(/\.ts$/, '')
    const moduleName = filepwd
      .split('/')
      .filter(e => e && !['pages', 'redux'].includes(e))
      .map(e => this.firstToLocaleUpperCase(e))
      .join('');
    return {
      filepwd: '..' + filepwd,
      moduleName,
    }
  }
  /**
   * 检测mode名称是否重复
   * @param {*} filepwd 文件相对src/store.ts路径
   * @param {*} moduleName 模块名称
   */
  checkRepeat(filepwd, moduleName) {
    if (allModeNames.includes(moduleName)) {
      log(chalk.bgRed(`\n[${moduleName}] 重复，'${filepwd}' 不会被合并!`))
      return null
    }
    allModeNames.push(moduleName)
    return {
      filepwd,
      moduleName,
    }
  }
  /**
   * 首字母大写
   * @param {String} str
   */
  firstToLocaleUpperCase(str) {
    return str.charAt(0).toLocaleUpperCase() + str.substr(1)
  }
}

module.exports = new ReduxSagaAutoMergePlugin()
