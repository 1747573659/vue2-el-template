const localStorage = {}

/**
 * @description 存储 localStorage 值
 * @param {String} name localStorage name
 * @param {String} value localStorage value
 */
localStorage.set = function(name = 'default', value = '') {
  return localStorage.setItem(`km-${process.env.VUE_APP_VERSION}-${name}`, JSON.stringify(value))
}

/**
 * @description 拿到 localStorage 值
 * @param {String} name localStorage name
 */
localStorage.get = function(name = 'default') {
  return JSON.parse(localStorage.getItem(`km-${process.env.VUE_APP_VERSION}-${name}`))
}

/**
 * @description 删除 localStorage
 * @param {String} name localStorage name
 */
localStorage.remove = function(name = 'default') {
  return localStorage.removeItem(`km-${process.env.VUE_APP_VERSION}-${name}`)
}

export default localStorage
