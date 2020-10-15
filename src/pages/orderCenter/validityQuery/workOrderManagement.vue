<template>
  <div class="app-container">
    <div class="search-box">
        <query-group
          className="all-fr"
          :queryParams="queryParams"
          :queryFormList.sync="queryFormList"
          @search="handleFilter"
        >
          <template v-slot:formfoot >
              <router-link v-permission.page="'WORKORDERMANAGEMENT_ADD'" to="/customer/workorder/workOrderManagementdetail">
                <el-button icon="el-icon-plus" type="primary"
                  size="small"
                  plain class="float_right">新增</el-button>
              </router-link>
          </template>
        </query-group>
    </div>
    <div class="data-box">
        <base-table
          :columns="headers"
          :list="list"
          @getList="queryWorkOrderList"
          :loading="loading"
          :total="total"
          :page.sync="tableParam.page"
          :rows.sync="tableParam.rows"
          @viewResClick="viewResClick"
        ></base-table>
    </div>
  </div>
</template>

<script>
import listMixins from '@/mixins/tableList'
import baseTable from '@/components/baseTable'
import queryGroup from '@/components/queryGroup'
import moment from 'moment'
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
           label: '提交日期',
           value:[moment().subtract(30, 'days').format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
        },
        {
          type: 'input',
          name: 'title',
          label: '工单信息',
          placeholder: '工单标题/描述/提交人',
          value: ''
        },
        {
          type: 'input',
          name: 'sheetNo',
          label: '工单编号',
          placeholder: '工单编号',
          value: ''
        },
        {
          type: 'select',
          name: 'orderType',
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
          name: 'status',
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
          options: []
        }
      ],
      productOptions:[],
      list: [],
      total:0,
      loading:false,
      tableParam:{
          page:1,
          rows:10
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
          title: '工单类型',
          escape:(row)=>{
             let str = "";
            switch (row.orderType) {
              case "1":
                str = "问题";
                break;
              case "2":
                str = "需求";
                break;
              default:
                str = "--";
                break;
            }
            return str
          }
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
    handleFilter (e) {
      Object.assign(this.tableParam,e)
      this.queryWorkOrderList()
    },
    viewResClick(e){
      const {sheetNo,orderType}=e
      this.$router.push({ path: '/customer/workorder/workOrderdetail', query: { sheetNo, orderType}})
    },
    queryWorkOrderList(){
      this.loading=true
      queryWorkOrderList(this.tableParam).then((res)=>{
        this.list=res.results || []
        this.total=res.totalCount || 0
      }).finally(()=>{
        this.loading=false
      })
    },
    queryProductList(){
      this.productOptions=[
        {value: '', label: '全部'}
      ]
      queryProductList({
        productName:""
      }).then((res)=>{
        const temp=res.map(res1=>{
          return {
            value:res1.productNo,
            label:res1.productName,
          }
        })
        this.productOptions=[...this.productOptions, ...temp]
        this.queryFormList[this.queryFormList.length-1].options=this.productOptions
      })
    },
  },
  mounted() {
    this.queryProductList()
    this.handleFilter(this.queryParams)
  }
}
</script>

<style lang="scss" scoped>
  .float_right{
    float:right;
  }
</style>
