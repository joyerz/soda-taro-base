const ci = require('miniprogram-ci')
const chalk = require('chalk')
const os = require('os')
const path = require('path')
const { version, appid, } = require('../project.config.json')

const desc = os.hostname() + new Date() + ' UPLOAD' + (process.argv[2] || '')

!async function () {
  const project = new ci.Project({
    appid,
    type: 'miniProgram',
    projectPath: process.cwd() + '/dist/weapp',
    privateKeyPath: process.cwd() + '/key/private.wxxxxxx.key',
    ignores: ['node_modules/**/*'],
  })

  ci.upload({
    project,
    version,
    desc,
  })
    .then(() => {
      console.log(chalk.green('upload success.'))
    })
    .catch(() => {
      console.log(chalk.red('upload error.\n'))
    })
}()