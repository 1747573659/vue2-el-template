export function filterStatus(value, statusArr) {
  return value || value === 0 ? statusArr.filter(item => item.value === value)?.[0]?.label ?? '--' : '--'
}
