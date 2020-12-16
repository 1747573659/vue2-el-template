// 通过字段去重
export function unique(arr, field) {
  var map = {}
  var res = []
  for (var i = 0; i < arr.length; i++) {
    if (!map[arr[i][field]]) {
      map[arr[i][field]] = 1
      res.push(arr[i])
    }
  }
  return res
}
