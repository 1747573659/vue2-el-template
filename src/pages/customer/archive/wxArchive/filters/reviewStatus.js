import { statusOptions } from '../index'

export function filterReview(status) {
  return statusOptions.filter(item => item.value === status)[0].label
}

export function filterArchiveStatus(code, statusArr) {
  return statusArr.filter(item => item.code === code)[0].name
}
