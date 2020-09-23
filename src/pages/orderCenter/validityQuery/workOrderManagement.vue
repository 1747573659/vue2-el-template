<template>
  <div class="app-container">
    <div class="search-box">
        <query-group
          className="all-fr"
          :queryFormList.sync="queryFormList"
          :queryParams="queryParams"
          @search="initData"
        ></query-group>
    </div>
    <div class="data-box">
        <base-table
          :columns="headers"
          :list="list"
          :loading="loading"
          :total="total"
          :page.sync="tableParam.pageIndex"
          :rows.sync="tableParam.pageSize"
        ></base-table>
    </div>
  </div>
</template>

<script>
import listMixins from '@/mixins/tableList'
import baseTable from '@/components/baseTable'
import queryGroup from '@/components/queryGroup'
import { 
  addWorkOrder,
  queryProductList,
  queryAgent,
  queryWorkOrderList,
  queryOrderDetail
  } from '@/api/dataCenter/dataCenter.js'
export default {
  name: 'validityPeriod',
  mixins: [listMixins],
  components: {
    baseTable,
    queryGroup
  },
  data () {
    return {
      queryFormList: [
        {
           type: 'daterange',
            name: 'searchDate',
           label: '提交日期',
           value:""
        },
        {
          type: 'input',
          name: 'ticketMsg',
          label: '工单信息',
          placeholder: '工单编号/标题/描述/提交人',
          value: ''
        },
        {
          type: 'input',
          name: 'ticketNo',
          label: '工单信息',
          placeholder: '工单编号/标题/描述/提交人',
          value: ''
        },
        {
          type: 'select',
          name: 'ticketType',
          label: '工单类型',
          value: '',
          options: [
            {value: '', label: '全部'},
            {value: '1', label: '问题'},
            {value: '2', label: '需求'}
          ]
        },
        {
          type: 'select',
          name: 'ticketStatus',
          label: '状态',
          value: '',
          options: [
            {value: '', label: '全部'},
            {value: '1', label: '待处理'},
            {value: '2', label: '处理中'},
            {value: '3', label: '已处理'},
            {value: '9', label: '已关闭'}
          ]
        },
        {
          type: 'select',
          name: 'productNo',
          label: '产品',
          value: '',
          options: this.productOptions
        }
        
      ],
      productOptions:[],
      list: [],
      total:0,
      loading:false,
      tableParam:{
          pageSize:"10",
          pageIndex:"1",
          endDate: "",
          productNo: "",
          startDate: "",
          ticketMsg: "",
          ticketNo: "",
          ticketStatus: "",
          ticketType: ""
      },
      headers: [
        {
          key: 'sheetNo',
          title: '工单编号'
        },
        {
          key: 'demandName',
          title: '工单标题'
        },
        {
          key: 'orderType',
          title: '工单类型'
        },
        {
          key: 'productName',
          title: '产品'
        },
        {
          key: 'demandDec',
          title: '描述'
        },
        {
          key: 'operName',
          title: '提交人'
        },
        {
          key: 'orderDate',
          title: '提交时间'
        },
        {
          key: 'status',
          title: '状态'
        },
        {
          type: 'operate',
          title: '操作',
          width: '100',
          operates: [
            {
              name: '详情',
              emitKey: 'viewResClick'
            }
          ]
        }
      ]
    }
  },
  methods: {
    initData (e) {
       Object.assign(this.tableParam,e)
       this.queryWorkOrderList()
    },
    handleFilter () {
      console.log(1)
    },
    viewResClick(e){
      console.log(e)
    },
    queryWorkOrderList(){
      this.loading=true
      this.list=true
      this.total=0
      //this.tableParam
      queryWorkOrderList(this.tableParam).then((res)=>{
        console.log(res)
        this.list=res
      })
    },
    queryProductList(){
      this.productOptions=[
        {value: '', label: '全部'}
      ]
      queryProductList().then((res)=>{
        const temp=res.map(res=>{
          return {
            value:res.productNo,
            label:res.productName,
          }
        })
        Object.assign(this.productOptions,temp)
      })
    },
  },
  mounted() {
    this.queryProductList()
    this.queryWorkOrderList()
  }
}
</script>

<style lang="scss" scoped>
</style>
