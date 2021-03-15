// 文件下载
export default function downloadForURL(url, name = '') {
  let a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = name // 命名下载名称
  a.target = '_blank'
  a.click() // 点击触发下载
  window.URL.revokeObjectURL(url) // 下载完成进行释放
  document.body.removeChild(a)
}
