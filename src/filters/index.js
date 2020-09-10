export function formValidateNum(value, type) {
  value = (value + '').replace(/(^\s*)|(\s*$)/g, '')
  switch (type) {
    case 'number':
      value = value || value === 0 ? Number(value) : ''
      break
  }
  return value
}
