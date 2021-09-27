<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="form" label-suffix=":" @submit.native.prevent label-width="80px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col :span="21">
            <el-form-item label="商户" prop="paymentCode">
              <select-page
                style="width: 240px"
                :value="form.companyName"
                @remoteMethod="remoteMethod"
                @loadMore="loadMore"
                id="id"
                :name="selectPageName"
                :options="ObjContentList"
                :isMaxPage="isMaxPage"
                @focus="selectPageFocus(2)"
                @change="selectPageChange"
                @clear="selectPageClear(2)"
              >
              </select-page>
            </el-form-item>
            <el-form-item label="代理商" prop="paymentCode">
              <select-page
                style="width: 240px"
                :value="form.name"
                @remoteMethod="remoteMethod"
                @loadMore="loadMore"
                id="id"
                :name="selectPageName"
                :options="ObjContentList"
                :isMaxPage="isMaxPage"
                @focus="selectPageFocus(1)"
                @change="selectPageChange"
                @clear="selectPageClear(1)"
              >
              </select-page>
            </el-form-item>
            <el-form-item label="" prop="paymentCode">
              <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="search">查询</el-button>
               <el-button  @click="downLoadTradeDetailExcel"     :loading="exportLoad" v-permission="'KM_DEFAULT_CODE_EXPORT'" >导出</el-button>
               <el-button  @click="handleExportLists" v-permission="'KM_DEFAULT_CODE_EXPORT'" >导出记录</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tableLoading">
      <el-row style="padding-bottom: 20px">
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              交易总额(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">当前过滤条件的交易总额<br />(未扣除退款订单金额)</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.payAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              交易笔数
              <el-tooltip effect="dark" placement="top">
                <div slot="content">当前过滤条件的交易笔数<br />(未扣除退款订单笔数)</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.payCount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              客单价(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">交易总额/交易笔数</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.unitAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              商户优惠(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  由商家承担的参与微信/支付宝/银联<br />
                  活动的优惠券核销金额
                </div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.shopCouponAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              商户实退(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  退还用户银行卡或零钱账户的<br />
                  金额+平台优惠券退款金额
                </div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.merchantRefundAmount }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              商户实收(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">交易总额-商家优惠-商家实退</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{ tableData.receiptAmount }}</div>
          </div>
        </el-col>
      </el-row>
      <!-- TABLE -->
      <el-table :max-height="tableMaxHeight" :data="tableData.cashierMockDTOS" ref="table">
        <el-table-column label="商户名称" prop="shopName"></el-table-column>
        <el-table-column label="联系人手机" prop="mobile"></el-table-column>
        <el-table-column label="所属代理商" prop="agentName"></el-table-column>
        <el-table-column align="right" label="交易总额(元)" prop="payAmount"> </el-table-column>
        <el-table-column align="right" label="交易笔数" prop="payCount"></el-table-column>
        <el-table-column align="right" label="客单价(元)" prop="unitAmount"></el-table-column>
        <el-table-column align="right" label="商家优惠(元)" prop="shopCouponAmount"></el-table-column>
        <el-table-column align="right" label="商家实退(元)" prop="merchantRefundAmount"></el-table-column>
        <el-table-column align="right" label="商家实收(元)" prop="receiptAmount"></el-table-column>
      </el-table>
      <div class="el-pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </div>
    </div>
      <exportEecord  :exportType='$route.query.type==2?5:6' ref="exportEecord"></exportEecord>
  </div>
</template>

<script>
import selectPage from '@/components/selectPage'
import { detail, queryNewAgentPage, queryShopListByPage ,downLoadTradeDetailExcel} from '@/api/dataCenter/historiyTrade'
import exportEecord from '@/components/exportEecord'
export default {
  name: 'historicalTradeSumDetail',
  components: {
    selectPage,
    exportEecord
  },
  data() {
    return {
      exportLoad: false, // 导出
      searchType: null, // 1:代理商, 2:商户
      activeIndex: '1',
      form: {
        agentId: null,
        adminId: null,
        name: '',
        companyName: ''
      },
      paymentData: {},
      tableLoading: false,
      ObjContentList: [],
      selectPageName: '',
      selectPageNo: 1,
      tableData: {},
      searchString: '',
      questionIcon: require('@/assets/images/icon/questioin.png'),
      isMaxPage: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      cxLoading: false
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 120 - 108 - 48 - 76
    }
  },
  mounted() {
    this.getList()
  },
  created() {},
  methods: {
     handleExportLists () {
       this.$refs.exportEecord.exportVisible=true
     },
    async  downLoadTradeDetailExcel () {
      this.exportLoad = true
      try {
        await downLoadTradeDetailExcel({...this.initSubData(),export:true})
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
      } catch (error) {
      } finally {
        this.exportLoad = false
      }
    },
    search() {
      this.currentPage = 1
      this.getList()
    },
    async remoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (value !== this.searchString) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.ObjContentList = []
      }
      // 只有value有值的时候才去请求接口
      let data = {
        id: value || '',
        page: this.selectPageNo,
        rows: 10
      }
      try {
        let res
        if (this.searchType === 1) {
          res = await queryNewAgentPage(data)
          this.selectPageName = 'name'
        } else if (this.searchType === 2) {
          res = await queryShopListByPage(data)
          this.selectPageName = 'companyName'
        }
        // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
        if (res.results && res.results.length !== 0) {
          this.ObjContentList = this.ObjContentList.concat(res.results)
          this.searchString = value
          if (res.results?.length !== 10) {
            this.isMaxPage = true
          }
        } else {
          this.isMaxPage = true
        }
      } catch (error) {}
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
    selectPageFocus(value) {
      this.searchType = value
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      if (!this.form.companyName) {
        this.remoteMethod()
      }
    },
    selectPageChange(value) {
      if (this.searchType === 1) {
        this.form.agentId = value
      } else {
        this.form.adminId = value
      }
      this.ObjContentList.forEach(item => {
        if (item.id === value) {
          if (this.searchType === 2) {
            this.form.companyName = item.companyName
          } else {
            this.form.name = item.name
          }
        }
      })
    },
    // 如果点击了清除按钮则将相关数据清空
    selectPageClear() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      this.form.id = null
      this.form.companyName = ''
      this.form.name = ''
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.getList
    },
    handleSelect(key, keyPath) {
      this.activeIndex = String(key)
    },
    setSearchTime(type) {},
    initSubData () {
      let data = {
        adminId: String(this.$route.query.searchObject) === '2' ? this.$route.query.id : this.form.adminId,
        agentId: String(this.$route.query.searchObject) === '1' ? this.$route.query.id : this.form.agentId,
        dataTime: this.$route.query.payDate,
        payMethod: this.$route.query.payMethod,
        type: this.$route.query.type,
        page: this.currentPage,
        rows: this.pageSize
      }
      return data
    },
    async getList() {
      this.tableLoading = true
     
      try {
        const res = await detail({...this.initSubData(),export:false})
        this.tableData = res
        this.totalPage = res.totalCount
      } catch (error) {
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-box{
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
.xdd_tip {
  background: #e5edfd;
  border: 1px solid #a6c4fe;
  padding: 8px 16px;
  margin-bottom: 20px;
  color: #3d4966;
  font-size: 14px;
}
.sum-card-item {
  padding: 0 8px;
  .sum-card {
    height: 108px;
    border-radius: 4px;
    border: 1px solid #e6e9f0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .sum-card-title {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d4966;
      margin-bottom: 3px;
    }
    .sum-card-money {
      margin-top: 3px;
      font-size: 30px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1f2e4d;
    }
  }
}
.sum-card-item:first-child {
  padding-left: 0;
}
.sum-card-item:last-child {
  padding-right: 0;
}
.el-pagination-box {
  text-align: right;
  margin-top: 20px;
  background: #fff;
  padding-bottom: 20px;
}
.xdd_tip i {
  color: #3377ff;
}
.search-date {
  margin-right: 12px;
}
.e-icon-question {
  width: 14px;
  height: 14px;
  margin: 2px 0 0 2px;
}
</style>
