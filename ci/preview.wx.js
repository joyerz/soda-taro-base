const ci = require('miniprogram-ci')
const chalk = require('chalk')
const os = require('os')
const path = require('path')
const { version, appid, } = require('../project.config.json')

const desc = os.hostname() + new Date() + ' UPLOAD.'

!async function () {
  const project = new ci.Project({
    appid,
    type: 'miniProgram',
    projectPath: process.cwd() + '/dist/weapp',
    privateKeyPath: process.cwd() + '/key/private.wxxxxxx.key',
    ignores: ['node_modules/**/*'],
  })

  const previewResult = await ci.preview({
    project,
    desc,
    qrcodeFormat: 'image',
    qrcodeOutputDest: process.cwd() + '/destination.jpg',
    onProgressUpdate: console.log,
    // pagePath: 'pages/index/index', // 预览页面
    // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
  })
  console.log(previewResult)
}()