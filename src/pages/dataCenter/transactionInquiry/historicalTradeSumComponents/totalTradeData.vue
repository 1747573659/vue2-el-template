<template>
  <div>
    <div class="search-box">
      <div class="xdd_tip">
        <i class="el-icon-info"></i>
        查询对象为“全部” 或 代理商过滤时，结果会包括下级代理商的交易数据
      </div>
      <el-form :inline="true" :model="form" label-suffix=":" @submit.native.prevent label-width="80px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col :span="21">
            <el-form-item label="查询对象" prop="paymentCode">
              <selectCopy
                class="order_sel"
                @change="searchObjectChange"
                filterable
                :options="searchObjectList"
                :value.sync="form.searchObject"
                :optionsItem="{ key: 'id', label: 'name', value: 'id' }"
              ></selectCopy>
            </el-form-item>
            <el-form-item label="对象内容" prop="paymentCode">
              <select-page
                style="width: 240px"
                :value="form.ObjContent"
                @remoteMethod="remoteMethod"
                @loadMore="loadMore"
                id="id"
                :name="selectPageName"
                :options="ObjContentList"
                :isMaxPage="isMaxPage"
                :disabled="form.searchObject === ''"
                @focus="selectPageFocus"
                @change="selectPageChange"
                @clear="selectPageClear"
              >
              </select-page>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentCode">
              <el-select style="width: 240px" @change="payMethodChange" filterable clearable v-model="form.payMethod" placeholder="全部">
                <el-option v-for="item in paymentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="支付场景">
              <el-select style="width: 240px" clearable v-model="form.payPlugin" placeholder="全部">
                <el-option v-for="item in payPluginList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="paymentCode">
              <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="getList">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tableLoading">
      <el-row>
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
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getLocal } from '@/utils/storage'
import selectPage from '@/components/selectPage'
import { paymentMethodVoList, cashierData, queryNewAgentPage, queryShopListByPage, queryStorePage, paymentPluginVoList } from '@/api/dataCenter/historiyTrade'
import selectCopy from '@/components/selectCopy'

export default {
  name: 'monthTradeData',
  components: {
    selectPage,
    selectCopy
  },
  data() {
    return {
      selectPageNo: 1,
      activeIndex: '1',
      isMaxPage: false,
      selectPageName: '',
      form: {
        time: [],
        payMethod: '',
        searchObject: '',
        ObjContent: '',
        payPlugin: ''
      },
      payPluginList: [{ id: '', name: '全部' }],
      paymentList: [],
      questionIcon: require('@/assets/images/icon/questioin.png'),
      ObjContentList: [],
      tableData: {},
      searchObjectList: [
        { id: '', name: '全部' },
        { id: 1, name: '代理商' },
        { id: 2, name: '商户' },
        { id: 3, name: '门店' }
      ],
      tableLoading: false,
      currentPage: 1,
      pageSize: 15,
      totalPage: 0,
      eChartsDateList: [],
      eChartsDataList: [],
      cxLoading: false
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 210
    },
    isSalesman() {
      return Boolean(JSON.parse(getLocal('userInfo')).clerkId)
    }
  },
  mounted() {
    this.getList()
    this.getpaymentMethodVoList()
  },
  created() {
    if (this.isSalesman) {
      this.searchObjectList = [
        { id: '', name: '全部' },
        { id: 2, name: '商户' },
        { id: 3, name: '门店' }
      ]
    }
  },
  methods: {
    async payMethodChange(value) {
      this.payPluginList = []
      this.form.payPlugin = ''
      let childs = ''
      this.paymentList.forEach(item => {
        if (item.id === value) {
          childs = item.childs.split(',')
        }
      })
      let data = {
        childs
      }
      try {
        let res = await paymentPluginVoList(data)
        this.payPluginList = res
        this.payPluginList.unshift({ id: '', name: '全部' })
      } catch (error) {}
    },
    searchObjectChange(value) {
      this.form.id = null
      this.form.ObjContent = null
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    async remoteMethod(value) {
      if (!this.form.searchObject) {
        this.$message.warning('请先选择查询对象')
        return
      }
      // 当输入新的值的时候，就把相关数据进行情况
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
        if (this.form.searchObject === 1) {
          res = await queryNewAgentPage(data)
          this.selectPageName = 'name'
        } else if (this.form.searchObject === 2) {
          res = await queryShopListByPage(data)
          this.selectPageName = 'companyName'
        } else if (this.form.searchObject === 3) {
          res = await queryStorePage(data)
          this.selectPageName = 'name'
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
    selectPageFocus() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      if (!this.form.ObjContent) {
        this.remoteMethod()
      }
    },
    selectPageChange(value) {
      this.form.id = value
      this.ObjContentList.forEach(item => {
        if (item.id === value) {
          if (this.form.searchObject === 2) {
            this.form.ObjContent = item.companyName
          } else {
            this.form.ObjContent = item.name
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
      this.form.ObjContent = ''
    },
    handleCurrentChange() {},
    handleSizeChange() {},
    handleSelect(key, keyPath) {
      this.activeIndex = String(key)
    },
    setSearchTime(type) {},
    async getpaymentMethodVoList() {
      try {
        const res = await paymentMethodVoList()
        this.paymentList = res
        this.paymentList.unshift({ id: '', name: '全部' })
      } catch (error) {}
    },
    async getList() {
      this.tableLoading = true
      let data = {
        type: 4,
        adminId: this.form.searchObject === 2 ? this.form.id : '',
        agentId: this.form.searchObject === 1 ? this.form.id : '',
        storeId: this.form.searchObject === 3 ? this.form.id : '',
        payMethod: this.form.payMethod,
        payPlugin: this.form.payPlugin
      }
      try {
        const res = await cashierData(data)
        this.tableData = res
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
.e-icon-question {
  width: 14px;
  height: 14px;
  margin: 2px 0 0 2px;
}
</style>
