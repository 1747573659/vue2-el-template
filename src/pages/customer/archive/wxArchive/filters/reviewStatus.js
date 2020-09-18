import { statusOptions } from '../index'

export function filterReview(status) {
  return statusOptions.filter(item => item.value === status)[0].label
}
