import { toPromise } from "./common"

let canvas: any = null

interface ConfigT {
  /**
   * 最大宽度  默认 400
   */
  maxWidth: number
  /**
   * 最大高度 默认 300
   */
  maxHeight: number
  /**
   * 精度 0 - 1， 默认 0.8
   */
  quality: number
}

/**
 * 图片压缩
 * @param {t} file 
 * @param {*} config 
 */
export default function compress(file: File, config: ConfigT = {} as ConfigT) {
  const { maxWidth = 400, maxHeight = 300, quality = 0.8 } = config
  return new Promise((resolve, reject) => {
    try {
      let reader: any = new window.FileReader()
      let img: any = new window.Image()
      if (file.type.indexOf('image') === 0) {
        reader.readAsDataURL(file)
      }

      reader.onload = (e: any) => {
        img.src = e.target.result
      }

      canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      img.onload = function () {
        const originWidth = this.width
        const originHeight = this.height
        let targetWidth = originWidth
        let targetHeight = originHeight

        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            targetWidth = maxWidth
            targetHeight = Math.round(maxWidth * (originHeight / originWidth))
          } else {
            targetHeight = maxHeight
            targetWidth = Math.round(maxHeight * (originWidth / originHeight))
          }
        }

        canvas.width = targetWidth
        canvas.height = targetHeight

        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight)

        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight)

        canvas.toBlob(function (blob) {
          blob.name = file.name
          reader = null
          img = null
          // resolve(new File([blob], file.name, { type: file.type || 'image/jpeg' }))
          resolve(blob)
          canvas = null

        }, file.type || 'image/jpeg', quality)
      }
    } catch (err) {
      canvas = null
      reject(err)
    }
  })
}

/**
 * blob url 转 File类型
 */
export const bloburl2File = url => {
  if (!url) return
  return toPromise(resolve => {
    const http = new XMLHttpRequest()
    http.open('GET', url, true)
    http.responseType = 'blob'
    http.onload = function () {
      if (this.status == 200 || this.status === 0) {
        resolve(this.response)
      } else {
        console.error('bloburl2file err.')
      }
    }
    http.send()
  })
}

/**
 * blob类型 转file类型
 */
export const blob2File = blob => new File([blob], blob.name, { type: blob.type, })