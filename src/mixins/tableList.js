/*
 * @Author: wuhao
 * @Date: 2019-03-26 10:37:14
 * @LastEditors: wuhao
 * @LastEditTime: 2019-04-09 15:35:11
 * @Description: table列表页面中使用到多次复用的mixins
 */

const listMixins = {
  data () {
    return {
      loading: false, // 伴随loading状态
      tableParam: {
        page: 1, // 页码
        rows: 10 // 页长
      },
      total: 3, // 总个数
      list: []
    }
  },
  methods: {
    /**
		 * 表格数据请求成功的回调
		 * @param apiName {string}
		 * @returns {*}
		 */
    async listSuccessCb (apiName, needParams = false) {
      this.loading = true
      if (!needParams) {
        let res = await apiName()
        this.list = res
      } else {
        let listParams = Object.assign(this.tableParam, {
          params: this.queryParams || {}
        })
        let res = await apiName(listParams)
        if (res) {
          this.list = res.results
          this.total = res.totalRecord
        } else {
          this.list = []
          this.total = 0
        }
      }
      this.loading = false
    },
    /**
		 * 处理异常情况
		 * ==> 简单处理  仅仅是对表格处理为空以及取消loading
		 */
    listExceptionCb (error) {
      this.loading = false
      console.error(error)
    },

    /**
		 * @msg: 导出数据excel
		 * @param path {string}
		 * @return:
		 */
    exportExcelCb (path) {
      if (!this.list || this.list.length === 0) {
        this.$message({
          message: '暂无数据，无法导出哦',
          type: 'warning'
        })
        return
      }

      let requestParams = ''
      for (let key in this.queryParams) {
        requestParams += `${key}=${this.queryParams[key]}&`
      }
      requestParams = requestParams.slice(0, requestParams.lastIndexOf('&'))
      window.location.href = `${path}?${requestParams}`
    },

    /**
		 * @msg: 无分页时数据处理
		 * @param apiName {string}
		 * @return:
		 */
    // async notPageListSuccessCb (apiName) {
    //   this.loading = true
    //   let params = this.queryParams
    //   let res = await api[apiName](params)
    //   this.list = res.data.list
    //   this.loading = false
    // },
    // 重置搜索表单
    resetForm (obj) {
      for (let key in obj) {
        for (let item of this.queryFormList) {
          if (item.name === key) {
            item.value = obj[key]
          }
        }
      }
    }

  },
  computed: {
    queryParams () {
      let tempObj = {}
      for (let item of this.queryFormList) {
        if (item.type === 'daterange') {
          if (item.value !== null) {
            tempObj.startDate = item.value[0]
            tempObj.endDate = item.value[1]
          } else {
            tempObj.startDate = ''
            tempObj.endDate = ''
          }
          continue
        }
        tempObj[item.name] = item.value
      }
      return tempObj
    }
  }
}
export default listMixins
