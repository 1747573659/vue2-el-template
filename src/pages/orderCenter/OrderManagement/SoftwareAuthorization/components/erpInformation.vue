<template>
  <section class="p-erpInformation-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :disabled="$route.query.status === 'detail'" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${userInfo.agentId ? '[' + userInfo.agentId + ']' : ''}${userInfo.name}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称" class="is-required">
          <km-select-page
            ref="selectPage"
            v-model="form.erpAuthMerchantDTO.merchantName"
            option-label="custNameExpand"
            option-value="custId"
            :data.sync="shopPageData"
            :request="getShopPage"
            :is-max-page.sync="isShopMaxPage"
            @change="handleShopPage"
            placeholder="请输入名称/商户号" />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.erpAuthMerchantDTO.merchantId" placeholder="请先选择商户" disabled></el-input>
        </el-form-item>
        <el-form-item label="授权状态">
          <el-input :value="['试用', '试用', '正式', '停用'][parseFloat(form.erpAuthMerchantDTO.authStatus)]" disabled></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input
            :value="`${form.erpAuthMerchantDTO.productCode ? '[' + form.erpAuthMerchantDTO.productCode + ']' : ''}${form.erpAuthMerchantDTO.productName || ''}`"
            disabled></el-input>
        </el-form-item>
        <el-form-item label="门店授权站点">
          <el-input :value="form.erpAuthMerchantDTO.authCount" disabled></el-input>
        </el-form-item>
        <el-form-item label="授权类型" v-if="form.erpAuthMerchantDTO.productCode === 'ZHCT10'">
          <el-select v-model="form.authOrderDTO.erpStore" @change="handleErpStore" placeholder="授权类型" clearable>
            <el-option label="按站点" :value="0"></el-option>
            <el-option label="按门店" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="p-card" v-if="isStoreCard || form.erpStoreOrderDetailList.length > 0">
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <span style="margin-right: 20px">下单时库存: {{ storeOrderInventory }}</span>
        <el-button type="primary" size="small" plain @click="handleAuthorStoreVisible">选择授权门店</el-button>
        <el-button type="primary" size="small" plain @click="getProductStock" :disabled="form.erpStoreOrderDetailList.length === 0"> 刷新库存 </el-button>
      </div>
      <el-table :data="erpStoreOrderTabData" show-summary :summary-method="getStoreSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="authStoreId" label="门店编码"></el-table-column>
        <el-table-column prop="authStoreName" label="门店名称"></el-table-column>
        <el-table-column prop="authSiteCount" label="已授权点数" v-if="['2', '3'].includes(form.erpAuthMerchantDTO.authStatus)" align="right"></el-table-column>
        <el-table-column prop="authPoint" label="本次授权数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.authPoint }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.authPoint" @change="handleAuthNumAmount(scope.row, 'authPoint')" style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="handleAuthorStoreDelDetailDTO(scope)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <km-pagination
        v-if="isStoreCard || form.erpStoreOrderDetailList.length > 0"
        :current-page.sync="erpStoreOrderCurrentPage"
        :page-size.sync="erpStoreOrderPageSize"
        :total="form.erpStoreOrderDetailList.length"
        layout="prev, pager, next" />
    </el-card>
    <el-card shadow="never" class="p-card">
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible">选择产品模块</el-button>
        <el-button type="primary" size="small" plain @click="getProductStock" :loading="checkProductStockLoad" :disabled="form.erpAuthOrderDetails.length === 0">
          刷新库存
        </el-button>
      </div>
      <el-table :data="form.erpAuthOrderDetails" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="moduleCode" label="模块编码"></el-table-column>
        <el-table-column prop="moduleName" label="模块名称"></el-table-column>
        <el-table-column prop="authPoint" label="已授权点数" v-if="['2', '3'].includes(form.erpAuthMerchantDTO.authStatus)" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="库存数量" align="right"></el-table-column>
        <el-table-column prop="authNum" label="加点数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.authNum }}</span>
            <el-input
              v-else
              size="small"
              v-model.number.trim="scope.row.authNum"
              :disabled="
                (scope.row.moduleCode === 'MDZD' && form.erpStoreOrderDetailList.length > 0) ||
                (orderErpCustInfo.architectureType === 1 && ['BNK', 'BNK1', 'BNK5'].includes(scope.row.moduleCode))
              "
              @change="handleAuthNumAmount(scope.row, 'authNum')"
              style="width: 100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="银联通道">
          <template slot-scope="scope">
            <template v-if="['BNK', 'BNK1', 'BNK5'].includes(scope.row.moduleCode)">
              <km-select-page
                ref="unionChannel"
                size="small"
                v-model="scope.row.unionChannel"
                :modelName="scope.row.unionChannelName"
                option-label="channelName"
                option-value="channelCode"
                :data.sync="channelData"
                :request="getChannelPage"
                @change="val => handleChannelPage(scope, val)"
                :disabled="checkUnionChannelDisabled"
                :is-max-page.sync="isChannelPage"
                placeholder="银联通道"
                class="e-select-con js-unionChannel" />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.remark" :disabled="$route.query.status === 'detail'" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm
              v-if="scope.row.moduleCode !== 'MDZD' || (scope.row.moduleCode === 'MDZD' && form.erpStoreOrderDetailList.length === 0)"
              class="el-button el-button--text"
              @confirm="handleDelDetailDTO(scope)"
              placement="top-start"
              title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :visible.sync="checkProductVisible" @close="productVal = ''" :close-on-click-modal="false" title="选择产品模块" width="700px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="80px" @submit.native.prevent>
        <el-form-item label="产品信息">
          <el-input v-model="productVal" maxlength="50" placeholder="模块编码/模块名称" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="getProductPage">查询</el-button>
      </el-form>
      <el-table ref="product" :data="basicProductData" @select="handleSelect" @select-all="handleSelectAll" v-loading="checkProductTabLock">
        <el-table-column type="selection" :selectable="checkSelectable" width="55"></el-table-column>
        <el-table-column prop="moduleId" label="模块编码"></el-table-column>
        <el-table-column prop="moduleName" label="模块名称"></el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="checkProductVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="checkAuthorStoreVisible" @close="authorVal = ''" :close-on-click-modal="false" title="选择授权门店" width="800px" class="p-address-con">
      <el-form size="small" :inline="true" label-width="70px" @submit.native.prevent>
        <el-form-item label="门店编码">
          <el-input v-model="authorForm.storeId" maxlength="30" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input v-model="authorForm.storeName" maxlength="30" placeholder="" clearable></el-input>
        </el-form-item>
        <el-button type="primary" size="small" @click="handleAuthorStoreSearch">查询</el-button>
      </el-form>
      <el-table ref="authorStore" :data="basicAuthorStoreData" @select="handleAuthorStoreSelect" @select-all="handleAuthorStoreSelectAll" v-loading="checkAuthorStoreTabLock">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="authStoreId" label="门店编码"></el-table-column>
        <el-table-column prop="authStoreName" label="门店名称"></el-table-column>
      </el-table>
      <km-pagination :request="getAuthorStorePage" layout="prev, pager, next" :current-page.sync="currentPage" :page-size.sync="pageSize" :total="totalPage" />
      <div slot="footer">
        <el-button @click="checkAuthorStoreVisible = false" size="small">取消</el-button>
        <el-button type="primary" @click="handleAuthorStoreConfirm" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import NP from 'number-precision'

import {
  authShopPage,
  authModuleList,
  queryByAgentErpProduct,
  queryChannelPage,
  getOrderErpCode,
  getOrderErpSiteInfo,
  getOrderErpCustInfo,
  getChannelByCustId
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      shopPageData: [],
      isShopMaxPage: false,
      channelData: [],
      isChannelPage: false,
      isStoreCard: false,
      checkProductVisible: false,
      productVal: '',
      checkProductTabLock: false,
      basicProductData: [],
      selectMaps: new Map(),
      currentPageSelectSets: new Set(),
      checkProductStockLoad: false,
      authorVal: '',
      checkAuthorStoreVisible: false,
      authorForm: { storeId: '', storeName: '' },
      basicAuthorStoreData: [],
      checkAuthorStoreTabLock: false,
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      storeOrderInventory: 0,
      selectAuthorMaps: new Map(),
      currentPageSelectAuthorSets: new Set(),
      orderErpCustInfo: {},
      erpStoreOrderCurrentPage: 1,
      erpStoreOrderPageSize: 10,
      channelByCustIdStatus: ''
    }
  },
  computed: {
    erpStoreOrderTabData() {
      const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))
      return chunk(this.form.erpStoreOrderDetailList, this.erpStoreOrderPageSize)[this.erpStoreOrderCurrentPage - 1]
    },
    checkUnionChannelDisabled() {
      const { status } = this.$route.query
      return status === 'detail' || Boolean(this.channelByCustIdStatus)
    }
  },
  methods: {
    handleAuthorStoreSearch() {
      this.currentPage = 1
      this.getAuthorStorePage()
    },
    handleChannelPage(scope, val) {
      scope.row.unionChannelName = this.channelData.find(item => item.channelCode === val).channelName
    },
    checkSelectable(row) {
      if (this.form.erpStoreOrderDetailList?.length > 0) return row.moduleId !== 'MDZD'
      else return true
    },
    handleErpStore() {
      this.form.erpStoreOrderDetailList = []
      this.selectAuthorMaps.clear()
      this.currentPageSelectAuthorSets.clear()
      const MZIndex = this.form.erpAuthOrderDetails.findIndex(item => item.moduleCode === 'MDZD')
      this.form.erpAuthOrderDetails.splice(MZIndex, 1)
      this.selectMaps.clear()
      this.currentPageSelectSets.clear()
    },
    handleAuthorStoreSelect(selection, row) {
      if (selection.length > this.currentPageSelectAuthorSets.size) {
        this.selectAuthorMaps.set(row.authStoreId, row)
        this.currentPageSelectAuthorSets.add(row.authStoreId)
      } else {
        this.selectAuthorMaps.delete(row.authStoreId)
        this.currentPageSelectAuthorSets.delete(row.authStoreId)
      }
    },
    handleAuthorStoreSelectAll(selection) {
      if (selection?.length) {
        selection.forEach(item => {
          this.selectAuthorMaps.set(item.authStoreId, item)
          this.currentPageSelectAuthorSets.add(item.authStoreId)
        })
      } else {
        this.currentPageSelectAuthorSets.forEach(item => this.selectAuthorMaps.delete(item))
        this.currentPageSelectAuthorSets.clear()
      }
    },
    async handleAuthorStoreConfirm() {
      const addDetailItem = item => {
        this.form.erpStoreOrderDetailList.push({
          authStoreId: item.authStoreId,
          authStoreName: item.authStoreName,
          authSiteCount: item.authSiteCount,
          authPoint: 1,
          remark: ''
        })
      }
      if (this.form.erpStoreOrderDetailList.length === 0 && this.selectAuthorMaps.size) {
        this.selectAuthorMaps.forEach(item => addDetailItem(item))
        if (!this.form.erpAuthOrderDetails.some(item => item.moduleCode === 'MDZD')) {
          this.currentPageSelectSets.clear()
          let { merchantId: custId, productCode } = this.form.erpAuthMerchantDTO
          if (this.form.erpAuthMerchantDTO.productCode === 'ZHCT10') {
            productCode = this.form.authOrderDTO.erpStore === 1 ? 'ZHCT20' : 'ZHCT10'
          }
          await authModuleList({ moduleInfo: this.productVal, custId, productCode }).then(res => {
            const siteInZdItem = res.find(item => item.moduleId === 'MDZD') || []
            this.form.erpAuthOrderDetails.push({
              moduleCode: siteInZdItem.moduleId,
              moduleName: siteInZdItem.moduleName,
              authPoint: [0, 1].includes(this.form.erpAuthMerchantDTO.authStatus) ? 0 : siteInZdItem?.authNum ?? 0,
              orderInventory: 0,
              authNum: 1,
              productCode: siteInZdItem.productId,
              unionChannel: '',
              unionChannelType: '',
              remark: ''
            })
          })
          this.getProductStock()
        }
      } else if (this.selectAuthorMaps.size && this.form.erpStoreOrderDetailList.length > 0) {
        this.form.erpStoreOrderDetailList.forEach((item, index) => {
          if (!this.selectAuthorMaps.has(item.authStoreId)) this.form.erpStoreOrderDetailList.splice(index, 1)
        })
        this.selectAuthorMaps.forEach((item, key) => {
          if (this.form.erpStoreOrderDetailList.every(ele => ele.authStoreId !== key)) addDetailItem(item)
        })
      } else this.form.erpStoreOrderDetailList = []
      this.checkAuthorStoreVisible = false
    },
    handleAuthorStoreDelDetailDTO(scope) {
      this.form.erpStoreOrderDetailList.map((item, index) => {
        if (item.authStoreId == scope.row.authStoreId) this.form.erpStoreOrderDetailList.splice(index, 1)
      })
      this.selectAuthorMaps.delete(scope.row.authStoreId)
      this.currentPageSelectAuthorSets.delete(scope.row.authStoreId)
      if (this.form.erpStoreOrderDetailList.length === 0) {
        const MZIndex = this.form.erpAuthOrderDetails.findIndex(item => item.moduleCode === 'MDZD')
        this.form.erpAuthOrderDetails.splice(MZIndex, 1)
        this.storeOrderInventory = 0
      }
    },
    handleDelDetailDTO(scope) {
      this.form.erpAuthOrderDetails.splice(scope.$index, 1)
      this.selectMaps.delete(scope.row.moduleCode)
      this.currentPageSelectSets.delete(scope.row.moduleCode)
      if (['BNK', 'BNK1', 'BNK5'].includes(scope.row.moduleCode)) {
        this.channelData = []
        this.isChannelPage = false
      }
    },
    handleSelectAll(selection) {
      if (selection?.length) {
        selection.forEach(item => {
          this.selectMaps.set(item.moduleId, item)
          this.currentPageSelectSets.add(item.moduleId)
        })
      } else {
        this.currentPageSelectSets.forEach(item => this.selectMaps.delete(item))
        this.currentPageSelectSets.clear()
      }
    },
    handleSelect(selection, row) {
      if (selection.length > this.currentPageSelectSets.size) {
        this.selectMaps.set(row.moduleId, row)
        this.currentPageSelectSets.add(row.moduleId)
      } else {
        this.selectMaps.delete(row.moduleId)
        this.currentPageSelectSets.delete(row.moduleId)
      }
    },
    handleAuthNumAmount(row, property) {
      if (!/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/.test(row[property])) {
        this.$message({ type: 'warning', message: '授权数量范围为[1-999]' })
        row[property] = 1
      }
    },
    handleShopPage(val) {
      if (val) {
        const { authCount, productId: productCode, productName, status: authStatus, custId: merchantId, authCountType } = this.shopPageData.find(item => item.custId === val)
        this.form.erpAuthMerchantDTO = Object.assign(this.form.erpAuthMerchantDTO, {
          authCount,
          productCode,
          productName,
          authStatus,
          merchantId,
          authCountType
        })
        this.getOrderErpCode()
      } else
        this.form.erpAuthMerchantDTO = Object.assign(this.form.erpAuthMerchantDTO, {
          authCount: '',
          productCode: '',
          productName: '',
          authStatus: '',
          merchantId: '',
          authCountType: ''
        })
      this.form.erpAuthOrderDetails = []
      this.selectMaps.clear()
      this.currentPageSelectSets.clear()
      // 授权门店模块重置
      this.form.erpStoreOrderDetailList = []
      this.storeOrderInventory = 0
      this.isStoreCard = false
      this.selectAuthorMaps.clear()
      this.currentPageSelectAuthorSets.clear()
    },
    handleConfirm() {
      const bnkVO = { BNK: 1, BNK1: 2, BNK5: 5 }
      const addDetailItem = item => {
        this.form.erpAuthOrderDetails.push({
          moduleCode: item.moduleId,
          moduleName: item.moduleName,
          authPoint: [0, 1].includes(this.form.erpAuthMerchantDTO.authStatus) ? 0 : item?.authNum ?? 0,
          orderInventory: 0,
          authNum: 1,
          productCode: item.productId,
          unionChannel: '',
          unionChannelType: ['BNK', 'BNK1', 'BNK5'].includes(item.moduleId) ? bnkVO[item.moduleId] : '',
          remark: ''
        })
      }
      // 校验逻辑
      if (this.selectMaps.has('MDZD') && this.isStoreCard && this.form.erpStoreOrderDetailList.length === 0) {
        this.$message({ type: 'warning', message: '至少选择一个授权门店' })
        return
      } else if (!this.orderErpCustInfo.misStatus) {
        const channelBanks = Array.from(this.currentPageSelectSets.values()).filter(item => ['BNK', 'BNK1', 'BNK5'].includes(item))
        if (channelBanks.length > 1) {
          this.$message({ type: 'warning', message: '只能选一种银联接口' })
          return
        }
      }
      // 数据处理逻辑
      if (this.form.erpAuthOrderDetails.length === 0 && this.selectMaps.size) {
        this.selectMaps.forEach(item => addDetailItem(item))
      } else if (this.selectMaps.size && this.form.erpAuthOrderDetails?.length > 0) {
        this.form.erpAuthOrderDetails.forEach((item, index) => {
          if (!this.selectMaps.has(item.moduleCode)) this.form.erpAuthOrderDetails.splice(index, 1)
        })
        this.selectMaps.forEach((item, key) => {
          if (this.form.erpAuthOrderDetails.every(ele => ele.moduleCode !== key)) addDetailItem(item)
        })
      } else this.form.erpAuthOrderDetails = []
      // 产品模块中包含有银联通道模块
      if (this.form.erpAuthOrderDetails?.length > 0) {
        if (this.form.erpAuthOrderDetails.some(item => ['BNK', 'BNK1', 'BNK5'].includes(item.moduleCode))) {
          this.getChannelPage()
          this.getChannelByCustId()
        }
        this.getProductStock().then(() => (this.checkProductVisible = false))
      } else this.checkProductVisible = false
    },
    async getProductStock() {
      try {
        this.checkProductStockLoad = true
        const res = await queryByAgentErpProduct({
          agentId: this.userInfo.agentId,
          productCodes: this.form.erpAuthOrderDetails.map(item => item.productCode)
        })
        if (this.form.erpAuthOrderDetails.length > 0 && res) {
          this.form.erpAuthOrderDetails.forEach(item => {
            let orderInventoryItem = res.find(ele => ele.productCode.toUpperCase() === item.productCode.toUpperCase())
            item.orderInventory = orderInventoryItem?.totalAmount ?? 0
          })
          if (this.form.erpStoreOrderDetailList.length > 0) {
            this.storeOrderInventory = this.form.erpAuthOrderDetails.find(item => item.moduleCode === 'MDZD').orderInventory
          }
        }
      } catch (error) {
      } finally {
        this.checkProductStockLoad = false
      }
    },
    handleAuthorStoreVisible() {
      const {
        erpAuthMerchantDTO: { merchantId, productCode },
        authOrderDTO: { erpStore }
      } = this.form
      if (!merchantId) this.$message({ type: 'warning', message: '请先选择商户' })
      else if (productCode === 'WXCPF') this.$message({ type: 'warning', message: '请在小蛙平台进行授权' })
      else if (productCode === 'ZHCT10' && erpStore === '') this.$message({ type: 'warning', message: '请选择授权类型' })
      else {
        this.basicAuthorStoreData = []
        this.currentPage = 1
        this.getAuthorStorePage()
        this.checkAuthorStoreVisible = true
      }
    },
    async getAuthorStorePage() {
      try {
        this.currentPageSelectAuthorSets.clear()
        const {
          erpAuthMerchantDTO: { merchantId: custId, productCode }
        } = this.form
        const { storeId, storeName } = this.authorForm
        const res = await getOrderErpSiteInfo({ custId, productCode, storeId, storeName, page: this.currentPage, rows: this.pageSize })
        this.basicAuthorStoreData = res?.results ?? []
        this.totalPage = res.totalRecord ?? 0
        this.$nextTick(() => {
          if (this.basicAuthorStoreData?.length) {
            let hasDetailDTO = ''
            this.basicAuthorStoreData.forEach(item => {
              if (this.form.erpStoreOrderDetailList?.length) hasDetailDTO = this.form.erpStoreOrderDetailList.some(ele => ele.authStoreId === item.authStoreId)
              if ((this.selectAuthorMaps?.size && this.selectAuthorMaps.has(item.authStoreId)) || hasDetailDTO) {
                this.currentPageSelectAuthorSets.add(item.authStoreId)
                this.$refs.authorStore.toggleRowSelection(item, true)
              }
              if (hasDetailDTO) this.selectAuthorMaps.set(item.authStoreId, item)
            })
          }
        })
      } catch (error) {}
    },
    handleProductVisible() {
      const {
        erpAuthMerchantDTO: { merchantId, productCode },
        authOrderDTO: { erpStore }
      } = this.form
      if (!merchantId) this.$message({ type: 'warning', message: '请先选择商户' })
      else if (productCode === 'WXCPF') this.$message({ type: 'warning', message: '请在小蛙平台进行授权' })
      else if (productCode === 'ZHCT10' && erpStore === '') this.$message({ type: 'warning', message: '请选择授权类型' })
      else {
        this.basicProductData = []
        this.getOrderErpCustInfo().then(() => {
          this.getProductPage()
        })
        this.checkProductVisible = true
      }
    },
    async getProductPage() {
      try {
        this.checkProductTabLock = true
        this.currentPageSelectSets.clear()
        let { merchantId: custId, productCode } = this.form.erpAuthMerchantDTO
        if (this.form.erpAuthMerchantDTO.productCode === 'ZHCT10') {
          productCode = this.form.authOrderDTO.erpStore === 1 ? 'ZHCT20' : 'ZHCT10'
        }
        const res = (await authModuleList({ moduleInfo: this.productVal, custId, productCode })) || []
        if (this.orderErpCustInfo.misStatus) {
          // misStatus=>MIS状态：1开通，0未开通, architectureType=>架构类型: 1.C/S架构、2.B/S架构、3.SAAS；默认0.空
          // 此处具体业务看数据化2.1.6 银联mis流程图, 若已开通银联mis，B/S产品只能继续授权之前已经授权的银联模块加点；C/S产品过滤掉['BNK', 'BNK1', 'BNK5']相关模块选项
          this.basicProductData = res.filter(item => {
            if (this.orderErpCustInfo.architectureType === 1) return !['BNK', 'BNK1', 'BNK5'].includes(item.moduleId)
            else if (this.orderErpCustInfo.architectureType === 2) return !['BNK', 'BNK1', 'BNK5'].includes(item.moduleId) || item.authNum > 0
          })
        } else {
          this.basicProductData = res
        }
        // 采购单多单库存扣减有问题，暂时屏蔽此逻辑
        // if (this.form.erpAuthMerchantDTO.productCode === 'HCM11') {
        //   this.basicProductData.forEach(item => {
        //     if (item.moduleId === 'ZBMK') item.productId = 'HCM11'
        //   })
        // }
        this.$nextTick(() => {
          if (this.basicProductData?.length) {
            let hasDetailDTO = ''
            this.basicProductData.forEach(item => {
              if (this.form.erpAuthOrderDetails?.length) hasDetailDTO = this.form.erpAuthOrderDetails.some(ele => ele.moduleCode === item.moduleId)
              if ((this.selectMaps?.size && this.selectMaps.has(item.moduleId)) || hasDetailDTO) {
                this.currentPageSelectSets.add(item.moduleId)
                this.$refs.product.toggleRowSelection(item, true)
              }
              if (hasDetailDTO) this.selectMaps.set(item.moduleId, item)
            })
          }
        })
      } catch (error) {
      } finally {
        this.checkProductTabLock = false
      }
    },
    async getChannelPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const b = this.form.erpAuthOrderDetails.find(item => ['BNK', 'BNK1', 'BNK5'].includes(item.moduleCode))
        const res = await queryChannelPage({ channelName: query, funType: b.unionChannelType, page, rows })
        this.channelData = this.channelData.concat(res.results || [])
        this.isChannelPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getChannelByCustId() {
      try {
        this.channelByCustIdStatus = (await getChannelByCustId(this.form.erpAuthMerchantDTO.merchantId)) || ''
        if (this.channelByCustIdStatus) {
          const bnkChannelIndex = this.form.erpAuthOrderDetails.findIndex(item => ['BNK', 'BNK1', 'BNK5'].includes(item.moduleCode))
          document.querySelectorAll('.js-unionChannel')[0].childNodes[0].childNodes[1].childNodes[1].value = this.channelByCustIdStatus.channelName
          this.form.erpAuthOrderDetails[bnkChannelIndex].unionChannel = this.channelByCustIdStatus.channelCode
        }
      } catch (error) {}
    },
    async getOrderErpCode() {
      try {
        this.isStoreCard = (await getOrderErpCode(this.form.erpAuthMerchantDTO.productCode)) || false
      } catch (error) {}
    },
    async getOrderErpCustInfo() {
      try {
        const res = await getOrderErpCustInfo(this.form.erpAuthMerchantDTO.merchantId)
        const { misStatus, architectureType } = res
        this.orderErpCustInfo = { misStatus, architectureType }
      } catch (error) {}
    },
    async getShopPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const isNum = new RegExp(/[\u4e00-\u9fa5]/).test(query)
        const res = await authShopPage({ custId: !isNum ? query : '', authShopMessage: isNum && query ? query : '', page, rows })
        res.results.forEach(item => (item.custNameExpand = `${item.custName ? item.custName : ''}（${item.custId}）`))
        this.shopPageData = this.shopPageData.concat(res.results || [])
        this.isShopMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    getStoreSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['authPoint'].includes(column.property)) {
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
            this.form.erpAuthOrderDetails.forEach(item => {
              if (item.moduleCode === 'MDZD') item.authNum = sums[['2', '3'].includes(this.form.erpAuthMerchantDTO.authStatus) ? 4 : 3]
              return item
            })
          }
        }
      })
      return sums
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (['authPoint', 'authNum'].includes(column.property)) {
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
            this.form.authOrderDTO.inventoryAmount = sums[['2', '3'].includes(this.form.erpAuthMerchantDTO.authStatus) ? 5 : 4]
          }
        }
      })
      return sums
    }
  }
}
</script>

<style lang="scss" scoped>
.p-erpInformation-con {
  padding-bottom: 70px;
}
.p-information {
  &-tab {
    ::v-deep {
      .el-input__inner {
        text-align: right;
      }
    }
    .e-select-con {
      ::v-deep .el-input {
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
    ::v-deep {
      .el-button {
        font-size: 16px;
      }
    }
  }
}
.p-address {
  &-con {
    ::v-deep {
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
    max-width: 240px;
    ::v-deep .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
