
/**
 * blob url  转为blob对象
 */
export function blobUrl2File(url: string, callback: function) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = () => {
    callback(xhr.response)
  }
  xhr.send()
}

export default {}