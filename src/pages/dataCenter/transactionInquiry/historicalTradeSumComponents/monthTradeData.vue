<template>
  <div>
    <div class="search-box">
      <div class="xdd_tip"><i class="el-icon-info"></i>单次查询月份的最长跨度为12个月</div>
      <el-form :inline="true" :model="form" label-suffix=":" @submit.native.prevent label-width="80px" ref="form" size="small" class="xdd-btn-block__w240">
        <el-row>
          <el-col :span="21">
            <el-form-item label="日期">
              <el-date-picker
                style="width: 240px"
                v-model="form.time"
                class="search-date"
                type="monthrange"
                range-separator="至"
                :picker-options="pickerOptions"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM"
                @change="dateChange"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="查询对象" prop="paymentCode">
              <el-select class="order_sel" filterable v-model="form.searchObject">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in searchObjectList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="对象内容" prop="paymentCode">
              <select-page
                style="width: 240px"
                :value="form.ObjContent"
                @remoteMethod="remoteMethod"
                @loadMore="loadMore"
                id="id"
                name="companyName"
                :options="ObjContentList"
                :isMaxPage="isMaxPage"
                @focus="selectPageFocus"
                @change="selectPageChange"
                @clear="selectPageClear"
              >
              </select-page>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="21">
            <el-form-item label="支付方式" prop="paymentCode">
              <el-select class="order_sel" filterable v-model="form.payMethod">
                <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in paymentList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="paymentCode">
              <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="getList">查询</el-button>
              <!-- <el-button class="km-archive-search" :loading="cxLoading" @click="getList">导出</el-button>
              <el-button class="km-archive-search" :loading="cxLoading" @click="getList">导出记录</el-button> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 内容展示区域 -->
    <div class="data-box" v-loading="tableLoading">
      <el-row>
        <el-col :span="8" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              交易总额(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">当前过滤条件的交易总额<br/>(未扣除退款订单金额)</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{tableData.payAmount}}</div>
          </div>
        </el-col>
        <el-col :span="8" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              交易笔数
              <el-tooltip effect="dark" placement="top">
                <div slot="content">当前过滤条件的交易笔数<br/>(未扣除退款订单金额)</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{tableData.payCount}}</div>
          </div>
        </el-col>
        <el-col :span="8" class="sum-card-item">
          <div class="sum-card">
            <div class="sum-card-title">
              客单价(元)
              <el-tooltip effect="dark" placement="top">
                <div slot="content">交易总额/交易笔数</div>
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </div>
            <div class="sum-card-money">{{tableData.unitAmount}}</div>
          </div>
        </el-col>
      </el-row>
      <!-- ECHARTS -->
      <div id="eChart" style="width: 100%;height:400px;"></div>
      <!-- TABLE -->
      <el-table :data="tableData.cashierMockDTOS" ref="table">
      <!-- <el-table :max-height="tableMaxHeight" :data="tableData.cashierMockDTOS" ref="table"> -->
        <el-table-column label="日期" prop="payDate"></el-table-column>
        <el-table-column label="交易总额(元)" prop="payAmount">
          <template slot-scope="scope">{{ scope.row.payAmount }}</template>
        </el-table-column>
        <el-table-column label="交易笔数" prop="payCount"></el-table-column>
        <el-table-column label="客单价(元)" prop="unitAmount"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="text" size="small"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import selectPage from '@/components/selectPage'
import moment from 'moment'
import { paymentMethodVoList, cashierData, queryAgentPage, queryShopListByPage, queryStorePage } from '@/api/dataCenter/historiyTrade'

export default {
  name: 'weekTradeData',
  components: {
    selectPage
  },
  data() {
    let maxTime = ''
    let minTime = ''
    return {
      activeIndex: '1',
      form: {
        time: [],
        payMethod: '',
        searchObject: '',
        ObjContent: ''
      },
      paymentList: [],
      questionIcon: require('@/assets/images/icon/questioin.png'),
      searchObjectList: [
        { id: '', name: '全部'},
        { id: 1, name: '代理商'},
        { id: 2, name: '商户'},
        { id: 3, name: '门店'},
      ],
      tableLoading: false,
      ObjContentList: [],
      isMaxPage: false,
      tableData: [],
      eChartsDateList: [],
      eChartsDataList: [],
      cxLoading: false,
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          if (minDate) {
            const day31 = 31 * 24 * 3600 * 1000
            maxTime = moment(minDate.getTime()).add(12, 'months')
            minTime = moment(minDate.getTime()).subtract(12, 'months')
          }
        },
        disabledDate: (time) => {
          if (maxTime) {
            return time.getTime() > moment().endOf('day').valueOf() || time.getTime() > maxTime || time.getTime() < minTime
          }
          return time.getTime() > moment().endOf('day').valueOf()
        }
      }
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 64 - 32 - 210
    }
  },
  mounted() {
    this.getList()
    this.getpaymentMethodVoList()
    this.loadingChart()
  },
  created() {
    this.form.time = [moment((new Date()).getTime()).subtract(12, 'months').format('YYYY-MM'), moment((new Date()).getTime()).format('YYYY-MM')]
  },
  methods: {
    detail(row) {
      this.$router.push({ name: 'historicalTradeSumDetail', query: { type: 3, payDate: row.payDate, payMethod: this.form.payMethod, searchObject: this.form.searchObject, id: this.form.id } })
    },
    dateChange(value) {
      console.log(value)
    },
    async remoteMethod(value) {
      if (!this.form.searchObject) {
        this.$message.warning('请先选择查询对象')
        return
      }
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (!value || (this.searchString !== '' && value !== this.searchString)) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.ObjContentList = []
      }
      // 只有value有值的时候才去请求接口
      if (value) {
        let data = {
          id: value,
          page: this.selectPageNo,
          rows: 10
        }
        try {
          let res
          if (this.form.searchObject === 1) {
            res = await queryAgentPage(data)
          } else if (this.form.searchObject === 2) {
            res = await queryShopListByPage(data)
          } else if (this.form.searchObject === 3) {
            res = await queryStorePage(data)
          }
          // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
          if (res.results && res.results.length !== 0) {
            this.ObjContentList = this.ObjContentList.concat(res.results)
            this.searchString = value
            if (res.results?.length !== 10) {
              this.isMaxPage = true
            }
          }
        } catch (error) {}
      }
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
    },
    selectPageChange(value) {
      this.form.archiveBaseVO.merchantId = value
      this.ObjContentList?.forEach(item => {
        if (item.id === value) {
          this.form.archiveBaseVO.userId = item.userId
        }
      })
    },
    // 如果点击了清除按钮则将相关数据清空
    selectPageClear() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    handleSelect(key, keyPath) {
      this.activeIndex = String(key)
    },
    setSearchTime(type) {},
    async getList() {
      let data = {
        type: 3,
        adminId: null,
        agentId: null,
        storeId: null,
        startTime: this.form.time[0],
        endTime: this.form.time[1],
        payMethod: null
      }
      try {
        const res = await cashierData(data)
        this.tableData = res
        if (this.tableData.cashierMockDTOS) {
          this.tableData.cashierMockDTOS.forEach(item => {
            this.eChartsDateList.push(item.payDate)
            this.eChartsDataList.push(item.payAmount)
          })
          this.eChartsDateList = this.eChartsDateList.reverse()
          this.eChartsDataList = this.eChartsDataList.reverse()
        }
        this.loadingChart()
      } catch (error) {}
    },
    async getpaymentMethodVoList() {
      try {
        const res = await paymentMethodVoList()
        this.paymentList = res
        this.paymentList.unshift({ id: '', name: '全部'},)
      } catch (error) {}
    },
    loadingChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('eChart'))
      // 指定图表的配置项和数据
      let option = {
        tooltip: {
          padding: [18, 16],
          backgroundColor: '#FFFFFF',
          trigger: 'axis',
          axisPointer: {
            type: 'none',
            snap: true
            // lineStyle: {
            //   type: 'dashed'
            // }
          },
          formatter: params => {
            return `
              <div style="font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #3D4966;box-shadow: 0px 4px 16px 0px rgba(31, 46, 77, 0.2);padding: 18px 16px">
                <p style="font-size: 12px;margin-bottom: 12px">
                  ${params[0].axisValueLabel}
                </p>
                <p style="font-size: 18px;">
                  <span class="echart-tooltip-bot-title">交易总额:</span>${params[0].data}
                </p>
              </div>
            `
          }
        },
        xAxis: {
          data: this.eChartsDateList,
          axisLine: {
            show: false,
            lineStyle: {
              type: 'solid',
              color: '#D3DBEB',
              width: '1'
            }
          },
          axisLabel: {
            color: '#3D4966',
            fontWeight: 400,
            fontSize: 14
          }
        },
        yAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              type: 'solid',
              color: '#D3DBEB',
              width: '1'
            }
          },
          axisLabel: {
            color: '#3D4966',
            fontWeight: 400,
            fontSize: 14
          },
          splitLine: {
            lineStyle: {
              color: '#E6E9F0',
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: '销量',
            type: 'line',
            data: this.eChartsDataList,
            itemStyle: {
              color: '#3377FF'
            }
            // symbol:'circle'
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
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
