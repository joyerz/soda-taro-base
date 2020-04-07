const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

console.log(chalk.green('[已创建]') + ' ' + chalk.green('index.module.scss'))
console.log(chalk.blue('[已更新]') + ' ' + chalk.green('index.module.scss'))
console.log(chalk.red('[错误]') + ' ' + chalk.red('index.module.scss'))

if (fs.existsSync(path.resolve(__dirname, './tpl.js'))) {

  const filecontent = fs.readFileSync(path.resolve(__dirname, './tpl.js'), 'utf-8')
  console.log(filecontent)
}

console.log(path.resolve(__dirname, './tpl.js'))