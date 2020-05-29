// 应用版本
export const VERSION = '1.0.0'

// 应用名称
export const APP_NAME = 'CoverMaker'

// 本地储存前缀
export const STORAGE_PREFIX = 'APP_'

// api
export const API_HOST = {
  development: '/api',
  production: '',
}[process.env.NODE_ENV as any]

export const WX_APP_ID = ''

// 开启权限验证
export const isPermission = false

export const isDev = process.env.NODE_ENV === 'development'

// 日期格式
export const dateFormat = 'YYYY/MM/DD'

// 时间格式
export const timeFormat = 'HH:mm:ss'

// 日期时间格式
export const datetimeFormat = dateFormat + ' ' + timeFormat
