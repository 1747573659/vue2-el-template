<template>
  <section class="p-clound-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :disabled="$route.query.status === 'detail'" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userBaseInfo.agentId ? '[' + userBaseInfo.agentId + ']' : ''}${userBaseInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" class="is-required">
          <km-select-page
            ref="selectPage"
            v-model="form.merchantDTO.merchantName"
            option-label="CustNameExpand"
            option-value="CustId"
            :data.sync="shopPageData"
            :request="getShopPage"
            :is-max-page.sync="isShopMaxPage"
            @change="handleShopPage"
            placeholder="请输入名称/商户号"
          />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.merchantDTO.merchantNo" placeholder="请先选择商户" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用系统">
          <el-select v-model="form.merchantDTO.applicationSystem" @change="handleAppModule" clearable>
            <el-option v-for="item in appModulesData" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-input :value="['正式', '试用'][parseFloat(form.merchantDTO.probationFlag)]" disabled></el-input>
        </el-form-item>
        <el-form-item label="延期时长">
          <el-input value="永久" v-if="[201, 205].includes(form.merchantDTO.applicationSystem)" disabled></el-input>
          <el-select v-else v-model="form.merchantDTO.delayHour" @change="handleDelayHour" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户级别" v-if="form.merchantDTO.applicationSystem === 206">
          <el-select v-model="form.authOrderDTO.userLevelNum" :disabled="parseFloat(form.merchantDTO.probationFlag) === 0" clearable>
            <el-option v-for="item in modulesUserLevel" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane label="加点" name="1" v-if="showAddBit"></el-tab-pane>
        <el-tab-pane label="续费" name="2" v-if="parseFloat(form.merchantDTO.probationFlag) === 0 && ![201, 205].includes(form.merchantDTO.applicationSystem)"></el-tab-pane>
      </el-tabs>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <template v-if="activeName === '1'">
          <el-button type="primary" size="small" plain @click="getProductStock" :loading="checkProductStockLoad" :disabled="form.addAuthOrderDetailDTOList.length === 0">
            刷新库存
          </el-button>
        </template>
        <el-button type="primary" size="small" plain @click="handleProductVisible" v-if="activeName === '2'">选择授权对象</el-button>
      </div>
      <el-table v-if="activeName === '1'" :data="form.addAuthOrderDetailDTOList" class="p-information-tab" :key="activeName">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="productCode" label="产品编码"></el-table-column>
        <el-table-column prop="productName" label="产品名称"></el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column label="加点数" align="right">
          <template slot-scope="scope">
            <el-input
              size="small"
              v-model.number.trim="scope.row.addNum"
              @change="handleAddNumAmount(scope.row)"
              :disabled="$route.query.status === 'detail' || [203, 206].includes(form.merchantDTO.applicationSystem)"
              style="width:100%"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="useInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="activeName === '2'" :data="form.renewAuthOrderDetailDTOList" show-summary :summary-method="getSummaries" class="p-information-tab" :key="activeName">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="authId" label="授权ID"></el-table-column>
        <el-table-column prop="authCode" label="授权对象编码"></el-table-column>
        <el-table-column prop="authName" label="授权对象名称"></el-table-column>
        <el-table-column prop="currentValidTime" label="当前有效期">
          <template slot-scope="scope">{{ scope.row.currentValidTime | formatTime }}</template>
        </el-table-column>
        <el-table-column prop="delayValidTime" label="延期后有效期">
          <template slot-scope="scope">{{ scope.row.delayValidTime | formatTime }}</template>
        </el-table-column>
        <el-table-column prop="useInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.renewAuthOrderDetailDTOList.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="checkProductVisible" @close="productVal = ''" :close-on-click-modal="false" title="选择授权对象" width="800px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="授权信息">
          <el-input v-model="productVal" maxlength="30" placeholder="授权对象编码/名称" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" @select="handleSelect" @select-all="handleSelectAll" v-loading="checkProductTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="UserId" label="授权ID"></el-table-column>
        <el-table-column prop="UserNo" label="授权对象编码"></el-table-column>
        <el-table-column prop="UserName" label="授权对象名称"></el-table-column>
        <el-table-column prop="EndTime" label="有效期">
          <template slot-scope="scope">{{ scope.row.EndTime | formatTime }}</template>
        </el-table-column>
      </el-table>
      <km-pagination :request="getProductPage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
      <div slot="footer">
        <el-button @click="checkProductVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import NP from 'number-precision'
import { delayTimes, modulesUserLevel } from '../data'

import {
  authOrderYsCustomerList,
  authOrderYsAppModules,
  authOrderYsTrialPointDetail,
  queryByAgentProduct,
  authOrderYsByCusAndApplyList
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    userBaseInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      modulesUserLevel,
      shopPageData: [],
      isShopMaxPage: false,
      appModulesData: [],
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      appModuleObj: {},
      checkProductStockLoad: false,
      delayTimes,
      productStockObj: {},
      activeName: '1',
      selectMaps: new Map(),
      currentPageSelectSets: new Set()
    }
  },
  filters: {
    formatTime(val) {
      return dayjs(val).format('YYYY-MM-DD')
    }
  },
  computed: {
    showAddBit() {
      const applicationSystem = this.form.merchantDTO.applicationSystem
      if ([203, 206].includes(applicationSystem)) {
        if (this.form.merchantDTO.merchantName === '' || this.form.merchantDTO.probationFlag === '' || parseFloat(this.form.merchantDTO.probationFlag) === 1) return true
        else return false
      } else return true
    }
  },
  watch: {
    showAddBit(newVal) {
      this.activeName = newVal ? '1' : '2'
    },
    'form.addAuthOrderDetailDTOList': {
      handler(newVal) {
        if (newVal.length > 0) {
          const addAuthInventoryAmount = newVal.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.useInventory
          }, 0)
          const renewAuthInventoryAmount = this.form.renewAuthOrderDetailDTOList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.useInventory
          }, 0)
          return (this.form.authOrderDTO.inventoryAmount = addAuthInventoryAmount + renewAuthInventoryAmount)
        }
      },
      deep: true
    },
    'form.renewAuthOrderDetailDTOList': {
      handler(newVal) {
        if (newVal.length > 0) {
          const addAuthInventoryAmount = this.form.addAuthOrderDetailDTOList.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.useInventory
          }, 0)
          const renewAuthInventoryAmount = newVal.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.useInventory
          }, 0)
          return (this.form.authOrderDTO.inventoryAmount = addAuthInventoryAmount + renewAuthInventoryAmount)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getOrderYsAppModules()
  },
  methods: {
    handleSelectAll(selection) {
      if (selection?.length) {
        selection.forEach(item => {
          this.selectMaps.set(item.AuthId, item)
          this.currentPageSelectSets.add(item.AuthId)
        })
      } else {
        this.currentPageSelectSets.forEach(item => this.selectMaps.delete(item))
        this.currentPageSelectSets.clear()
      }
    },
    handleSelect(selection, row) {
      if (selection.length > this.currentPageSelectSets.size) {
        this.selectMaps.set(row.AuthId, row)
        this.currentPageSelectSets.add(row.AuthId)
      } else {
        this.selectMaps.delete(row.AuthId)
        this.currentPageSelectSets.delete(row.AuthId)
      }
    },
    async handleAppModule(val) {
      this.form.addAuthOrderDetailDTOList = []
      this.form.renewAuthOrderDetailDTOList = []
      if (val) {
        this.form.merchantDTO.delayHour = 1
        if ([203, 206].includes(this.form.merchantDTO.applicationSystem) && parseFloat(this.form.merchantDTO.probationFlag) === 0) this.activeName = '2'
        else this.activeName = '1'
        this.setAddAuthDetailDTOList()
      } else this.form.merchantDTO.probationFlag = ''
    },
    handleShopPage(val) {
      this.form.addAuthOrderDetailDTOList = []
      this.form.renewAuthOrderDetailDTOList = []
      this.form.merchantDTO.probationFlag = ''
      if (val) {
        const { CustId: merchantNo, CustName } = this.shopPageData.find(item => item.CustId === val)
        this.form.merchantDTO = Object.assign(this.form.merchantDTO, { merchantNo, merchantName: CustName })
        if (this.form.merchantDTO.applicationSystem) this.setAddAuthDetailDTOList()
      } else {
        this.form.merchantDTO = Object.assign(this.form.merchantDTO, { merchantNo: '', merchantName: '', applicationSystem: '', probationFlag: '' })
      }
    },
    async setAddAuthDetailDTOList() {
      this.appModuleObj = this.appModulesData.find(item => item.code === this.form.merchantDTO.applicationSystem)
      if (this.form.merchantDTO.merchantNo) {
        try {
          const { merchantNo: custId, CustName = '', merchantName = '' } = this.form.merchantDTO
          const res = await authOrderYsTrialPointDetail({ custId, appId: this.appModuleObj.outCode, custName: CustName || merchantName })
          this.form.merchantDTO.probationFlag = res.ProbationFlag
          if ([203, 206].includes(this.form.merchantDTO.applicationSystem) && parseFloat(this.form.merchantDTO.probationFlag) === 0) this.activeName = '2'
          else this.activeName = '1'
          if (res) {
            await this.getProductStock()
            if (this.activeName === '1') {
              this.form.addAuthOrderDetailDTOList = [
                {
                  productCode: this.appModuleObj.productCode,
                  productName: this.appModuleObj.name,
                  orderInventory: this.productStockObj?.totalAmount ?? 0,
                  addNum: 1,
                  useInventory: NP.times(this.form.merchantDTO.delayHour, 1),
                  remark: '',
                  billNo: this.form.authOrderDTO?.billNo ?? ''
                }
              ]
            }
          }
        } catch (error) {}
      }
    },
    handleConfirm() {
      const addDetailItem = item => {
        this.form.renewAuthOrderDetailDTOList.push({
          authId: item.UserId,
          authCode: item.UserNo,
          authName: item.UserName,
          currentValidTime: item.EndTime,
          delayValidTime: this.setDelayValidTime(item.EndTime),
          useInventory: this.form.merchantDTO.delayHour,
          remark: '',
          billNo: this.form.authOrderDTO?.billNo ?? '',
          AuthId: item.AuthId
        })
      }
      if (this.form.renewAuthOrderDetailDTOList.length === 0) this.selectMaps.forEach(item => addDetailItem(item))
      else if (this.selectMaps.size && this.form.renewAuthOrderDetailDTOList?.length > 0) {
        this.form.renewAuthOrderDetailDTOList.forEach((item, index) => {
          if (!this.selectMaps.has(item.AuthId)) this.form.renewAuthOrderDetailDTOList.splice(index, 1)
        })
        this.selectMaps.forEach((item, key) => {
          if (this.form.renewAuthOrderDetailDTOList.every(ele => ele.AuthId !== key)) addDetailItem(item)
        })
      }
      this.getProductStock().then(() => (this.checkProductVisible = false))
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const productCode = this.appModuleObj.productCode || this.form.authOrderDTO.productCode
        if (productCode) {
          this.productStockObj = (await queryByAgentProduct({ agentId: this.userBaseInfo.agentId, productCode })) || {}
          if (this.form.addAuthOrderDetailDTOList.length > 0) {
            this.form.addAuthOrderDetailDTOList.forEach(item => {
              item.orderInventory = this.productStockObj?.totalAmount ?? 0
            })
          }
        }
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    handleAddNumAmount(row) {
      if (!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row.addNum)) {
        this.$message({ type: 'warning', message: '加点数范围为[1-999]' })
        row.addNum = 1
      }
      row.useInventory = NP.times(row.addNum, this.form.merchantDTO.delayHour)
    },
    async getOrderYsAppModules() {
      try {
        this.appModulesData = (await authOrderYsAppModules()) || []
      } catch (error) {}
    },
    async getShopPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await authOrderYsCustomerList({ Condition: query, OrganNo: this.userBaseInfo.organNo, PageIndex: --page, PageSize: rows })
        res.forEach(item => (item.CustNameExpand = `${item.CustName ? item.CustName : ''}（${item.CustId}）`))
        this.shopPageData = this.shopPageData.concat(res || [])
        this.isShopMaxPage = !res || (res && res.length < 10)
      } catch (error) {}
    },
    setDelayValidTime(date) {
      const countTime = dayjs(date).isAfter(dayjs().format('YYYY-MM-DD')) ? date : dayjs().format('YYYY-MM-DD')
      return dayjs(countTime)
        .add(this.form.merchantDTO.delayHour, 'year')
        .format('YYYY-MM-DD 00:00:00')
    },
    handleProductVisible() {
      this.checkProductVisible = true
      this.getProductPage()
    },
    async getProductPage() {
      if (!Object.keys(this.appModuleObj)?.length) this.appModuleObj = this.appModulesData.find(item => item.code === this.form.merchantDTO.applicationSystem)
      try {
        this.checkProductTabLock = true
        const data = {
          condition: this.productVal,
          PageSize: this.pageSize,
          PageIndex: --this.currentPage,
          CustId: this.form.merchantDTO.merchantNo,
          AppId: this.appModuleObj.outCode,
          flag: -1
        }
        const res = await authOrderYsByCusAndApplyList(data)
        this.basicProductData = res
        this.$nextTick(() => {
          if (this.basicProductData.length > 0 && this.selectMaps.size > 0) {
            this.basicProductData.forEach(item => {
              if (this.selectMaps.has(item.AuthId)) {
                this.$refs.product.toggleRowSelection(item, true)
                this.currentPageSelectSets.add(item.AuthId)
              }
            })
          } else {
            this.basicProductData.forEach(item => {
              if (this.form.renewAuthOrderDetailDTOList.find(ele => ele.AuthId === item.AuthId)) {
                this.$refs.product.toggleRowSelection(item, true)
                this.selectMaps.set(item.AuthId, item)
                this.currentPageSelectSets.add(item.AuthId)
              }
            })
          }
        })
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    handleDelayHour(val) {
      if (this.form.addAuthOrderDetailDTOList.length > 0) {
        this.form.addAuthOrderDetailDTOList.forEach(item => {
          return (item.useInventory = NP.times(val, item.addNum))
        })
      }
      if (this.form.renewAuthOrderDetailDTOList.length > 0) {
        this.form.renewAuthOrderDetailDTOList.forEach(item => {
          item.useInventory = val
          item.delayValidTime = this.setDelayValidTime(item.currentValidTime)
          return item
        })
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['useInventory'].includes(column.property)) {
          const values = data.map(item => parseFloat(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return NP.plus(prev, curr)
              } else {
                return prev
              }
            }, 0)
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.p-clound-con {
  padding-bottom: 70px;
}
.p-information {
  &-tab {
    /deep/ {
      .el-input__inner {
        text-align: right;
      }
    }
    .e-select-con {
      /deep/ .el-input {
        width: 100%;
        &__inner {
          text-align: left;
        }
      }
    }
  }
  &-con {
    padding-bottom: 70px;
  }
}
.p-card {
  border-top: 16px solid #f7f8fa;
  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /deep/ {
      .el-button {
        font-size: 16px;
      }
    }
  }
}
.p-address {
  &-con {
    /deep/ {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .km-page-block {
        padding-bottom: 0px;
      }
    }
  }
}
.e-product {
  &-choose {
    text-align: right;
    padding-bottom: 10px;
  }
  &_remark {
    width: 100%;
    /deep/ .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
