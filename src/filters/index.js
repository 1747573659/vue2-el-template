import { formatNumber } from '@/utils'
import NP from 'number-precision'
export function formatAmountDivide (val) {
  return val ? NP.divide(val, 100) : 0
}
export function formatAmountTimes (val) {
  return val ? NP.times(val, 100) : 0
}
export function toThousandfilter (num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function toFormatTime (times, type) {
  if (times) {
    let date = new Date(times)
    let year = date.getFullYear()
    let months = date.getMonth() + 1
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    let m = months < 10 ? '0' + months : months
    let d = day < 10 ? '0' + day : day
    let h = hours < 10 ? '0' + hours : hours
    let min = minutes < 10 ? '0' + minutes : minutes
    if (type === 'hour') return h + '-' + min
    return year + '-' + m + '-' + d + ' ' + h + ':' + min
  } else {
    return '--'
  }
}

export function formatTimeToymdhms (time) {}

export function distance (val) {
  let data = val / 1000
  if (data < 1) return val + 'M'
  return data + 'KM'
}

export function toFixedFilter (num, precision) {
  num = num / 100
  return formatNumber(num, 2)
}

export function toFixedMoneyFilter (num, precision) {
  // num = num / 100
  return formatNumber(num, 2)
}
export function formatNumberFilter (num, precision) {
  return formatNumber(num, precision || 0)
}
export function parseTime (d) {
  if (arguments.length === 0) {
    return null
  }
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  let date
  if (month < 10) {
    date = year + '-0' + month
  } else {
    date = year + '-' + month
  }
  return date
}
// 去掉时间的时分秒
export function parseTimeydm (times) {
  if (arguments.length === 0) {
    return null
  }
  let d = new Date(times)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  let day = d.getDate()
  let months = month < 10 ? '0' + month : month
  let days = day < 10 ? '0' + day : day
  let date = year + '-' + months + '-' + days
  return date
}
// 去掉时间的时分秒 加中间的横线
export function parseTimeydmTostring (times) {
  if (arguments.length === 0) {
    return null
  }
  let d = new Date(times)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  let day = d.getDate()
  let months = month < 10 ? '0' + month : month
  let days = day < 10 ? '0' + day : day
  let date = year + '' + months + '' + days
  return date
}
// 去掉时间的时分秒日
export function parseTimeyd (times) {
  if (arguments.length === 0) {
    return null
  }
  let d = new Date(times)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  let day = d.getDate()
  let months = month < 10 ? '0' + month : month
  let date = year + '-' + months
  return date
}
export function parsePhone (phone) {
  if (phone) {
    return phone.replace(phone.substring(3, 7), '****')
  } else {
    return '--'
  }
}
export function formatBankNumber (bankNumber) {
  if (bankNumber) {
    bankNumber = String(bankNumber)
    return bankNumber.substr(0, bankNumber.length - 8) + '****' + bankNumber.substr(-4)
  } else {
    return '--'
  }
}
export function cutString (str) {
  if (str && str.length > 20) {
    return str.substring(0, 20) + '...'
  } else {
    return str
  }
}
export function ThousandNum (num ) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formValidateNum(value, type) {
  value = (value + '').replace(/(^\s*)|(\s*$)/g, '')
  switch (type) {
    case 'number':
      value = value || value === 0 ? Number(value) : ''
      break
  }
  return value
}
