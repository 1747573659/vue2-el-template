let COMMON_API = process.env.VUE_APP_COMMON_API
let BASE_URL = process.env.VUE_APP_COMMON_API
let COLLECTION_API = process.env.VUE_APP_COLLECTION_API
let IOT_API = process.env.VUE_APP_IOT_API
let BIG_PAY_API = process.env.VUE_APP_PAYBIG_API
let VUE_APP_WORK_ORDER_URL=process.env.VUE_APP_WORK_ORDER_URL
let VUE_APP_WORK_ORDER_URLPATH=process.env.VUE_APP_WORK_ORDER_URLPATH
console.log(process.env)
if (process.env.NODE_ENV === 'development') {
  COMMON_API = '/commonApi'
  COLLECTION_API = '/collectionApi'
  BASE_URL = '/commonApi'
  IOT_API = '/iotApi'
  BIG_PAY_API = '/bigpayApi'
}
// console.log(BIG_PAY_API)
export default {
  COLLECTION_API,
  COMMON_API,
  BASE_URL,
  IOT_API,
  BIG_PAY_API,
  VUE_APP_WORK_ORDER_URL,
  VUE_APP_WORK_ORDER_URLPATH
}
