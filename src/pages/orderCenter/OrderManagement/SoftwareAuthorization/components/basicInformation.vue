<template>
  <section class="p-information-con">
    <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <div class="p-card-title">订单信息</div>
        <div class="p-card-state">
          <span>订单状态：</span>
          <span class="p-card-state_text">{{ currentOrderStatus }}</span>
        </div>
      </div>
      <el-form :model="form" size="small" disabled :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="单据编码">
          <el-input :value="form.authOrderDTO.billNo" placeholder="保存后自动生成"></el-input>
        </el-form-item>
        <el-form-item label="订单时间">
          <el-input :value="`${form.authOrderDTO.createOrderTime || baseOrderTime}`"></el-input>
        </el-form-item>
        <el-form-item label="消耗库存">
          <el-input :value="form.authOrderDTO.inventoryAmount"></el-input>
        </el-form-item>
        <el-form-item label="受理人">
          <el-input :value="form.authOrderDTO.handManName"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <component ref="information" :is="activeName" :form="form" :userBaseInfo="userBaseInfo"></component>

    <!-- <el-card shadow="never" class="p-card">
      <div slot="header" class="p-card-head">
        <span class="p-card-title">商户信息</span>
      </div>
      <el-form :model="form" size="small" :inline="true" label-suffix=":" label-width="110px">
        <el-form-item label="经销商">
          <el-input disabled :value="`${form.purchaseOrderDTO.agentId ? '[' + form.purchaseOrderDTO.agentId + ']' : ''}${form.purchaseOrderDTO.agentName}`"></el-input>
        </el-form-item>
        <el-form-item label="商户名称">
          <km-select-page
            v-model="form.createUser"
            :data.sync="ordererData"
            option-label="contactor"
            option-value="id"
            :request="handleOrderPage"
            :is-max-page.sync="isOrdererMaxPage"
            placeholder="下单人"
          />
        </el-form-item>
        <el-form-item label="商户号">
          <el-input :value="form.purchaseOrderDTO.agentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="应用系统" v-if="$route.query.type === 'clound'">
          <km-select-page
            v-model="form.createUser"
            :data.sync="ordererData"
            option-label="contactor"
            option-value="id"
            :request="handleOrderPage"
            :is-max-page.sync="isOrdererMaxPage"
            placeholder="下单人"
          />
        </el-form-item>
        <el-form-item label="授权状态" v-if="['erp', 'clound'].includes($route.query.type)">
          <el-input :value="form.purchaseOrderDTO.payMethod" disabled></el-input>
        </el-form-item>
        <template v-if="$route.query.type === 'erp'">
          <el-form-item label="产品">
            <el-input :value="form.purchaseOrderDTO.receiveMoneyPeopleName" disabled></el-input>
          </el-form-item>
          <el-form-item label="门店授权站点">
            <el-input :value="form.purchaseOrderDTO.receiveMoneyPeopleName" disabled></el-input>
          </el-form-item>
        </template>
        <template v-if="['retail', 'repast'].includes($route.query.type)">
          <el-form-item label="商户版本">
            <el-input :value="form.purchaseOrderDTO.useGuarantee" disabled></el-input>
          </el-form-item>
          <el-form-item label="关联产品">
            <el-input :value="form.purchaseOrderDTO.agentId" disabled></el-input>
          </el-form-item>
          <el-form-item label="门店总数">
            <el-input :value="form.purchaseOrderDTO.agentId" disabled></el-input>
          </el-form-item>
          <el-form-item label="应用模块">
            <el-input :value="`${form.purchaseOrderDTO.agentId ? '[' + form.purchaseOrderDTO.agentId + ']' : ''}${form.purchaseOrderDTO.agentName}`"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="延期时长" v-if="$route.query.type !== 'erp'">
          <el-select v-model="form.delayTime" clearable>
            <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card> -->
    <!-- <el-card shadow="never" class="p-card">
      <div slot="header">订单明细</div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="加点" name="first"></el-tab-pane>
        <el-tab-pane label="续费" name="second"></el-tab-pane>
      </el-tabs>
      <div class="e-product-choose" v-if="['add', 'edit'].includes($route.query.status)">
        <el-button type="primary" size="small" plain @click="handleProductVisible" v-if="$route.query.type === 'erp'">选择产品模块</el-button>
        <el-button type="primary" size="small" plain @click="handleProductVisible" v-if="$route.query.type === 'repast'">选择授权对象</el-button>
        <el-button type="primary" size="small" plain @click="handleProductVisible">刷新库存</el-button>
      </div>
      <el-table v-if="$route.query.type === 'erp'" :data="form.orderItemList" show-summary :summary-method="getSummaries" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="moduleCode" label="模块编码"></el-table-column>
        <el-table-column prop="moduleName" label="模块名称"></el-table-column>
        <el-table-column prop="authorizedPoints" label="已授权点数" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="numberOfAuthorizations" label="本次授权数量" align="right">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.numberOfAuthorizations }}</span>
            <el-input v-else size="small" v-model.number.trim="scope.row.numberOfAuthorizations" style="width:100%"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="unionPayChannel" label="银联通道">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.unionPayChannel }}</span>
            <el-select v-else-if="['BNK', 'BNK1', 'BNK5'].includes(scope.row.moduleCode)" v-model="scope.row.unionPayChannel" clearable>
              <el-option v-for="item in delayTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="$route.query.status !== 'detail'">
          <template slot-scope="scope">
            <el-popconfirm class="el-button el-button--text" @confirm="form.orderItemList.splice(scope.$index, 1)" placement="top-start" title="确定删除所选数据吗？">
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="$route.query.type === 'retail'" :data="form.orderItemList" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="moduleCode" label="当前有效期"></el-table-column>
        <el-table-column prop="moduleName" label="延期后有效期"></el-table-column>
        <el-table-column prop="authorizedPoints" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="$route.query.type === 'repast'" :data="form.orderItemList" class="p-information-tab">
        <el-table-column label="序号" width="100">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="moduleCode" label="门店名称/商户/税号"></el-table-column>
        <el-table-column prop="moduleName" label="类型"></el-table-column>
        <el-table-column prop="authorizedPoints" label="当前有效期" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="延期后有效期" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="下单时库存" align="right"></el-table-column>
        <el-table-column prop="orderInventory" label="消耗库存" align="right"></el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            <span v-if="$route.query.status === 'detail'">{{ scope.row.remark }}</span>
            <el-input v-else size="small" v-model="scope.row.remark" maxlength="100" clearable class="e-product_remark"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="$route.query.type === 'clound'"> </el-table>
    </el-card> -->
    <div class="p-infomation-action">
      <el-button size="small" plain @click="handleCancel('softwareAuthorization')">{{ $route.query.status === 'detail' ? '关闭' : '取消' }}</el-button>
      <el-button size="small" type="primary" plain v-if="['add', 'edit'].includes($route.query.status)" :loading="checkSaveBtnLoad" @click="handleSave">保存</el-button>
      <el-button size="small" type="primary" v-if="$route.query.status === 'edit'" :loading="checkVerifyBtnLoad" @click="handleVerify">提交</el-button>
    </div>
    <!-- <template v-if="['add', 'edit'].includes($route.query.status)">
      <erp-product v-if="$route.query.type === 'erp'" ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
      <repast-product v-if="$route.query.type === 'repast'" ref="product" :visible.sync="checkProductVisible" @productData="handleProductList" />
    </template> -->
  </section>
</template>

<script>
import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { orderStatus, formErpObj, formWlsOrWcyObj, formYsObj } from '../data'
import erpInformation from './erpInformation'
import retailInformation from './retailInformation'
import repastInformation from './repastInformation'
import cloundInformation from './cloundInformation'

import { queryHandlerMan, queryBaseInfo } from '@/api/orderCenter/orderManagement'
import {
  authOrderErpDetail,
  authOrderWlsDetail,
  authOrderWcyDetail,
  authOrderYsDetail,
  authOrderErpUpdate,
  authOrderWlsUpdate,
  authOrderWcyUpdate,
  authOrderYsUpdate,
  authOrderErpAdd,
  authOrderWlsAdd,
  authOrderWcyAdd,
  authOrderYsAdd
} from '@/api/orderCenter/orderManagement/softwareAuthorization'

export default {
  components: {
    erpInformation,
    retailInformation,
    repastInformation,
    cloundInformation
  },
  data() {
    return {
      baseOrderTime: dayjs().format('YYYY-MM-DD'),
      form: {},
      activeName: 'erpInformation',
      productType: parseFloat(this.$route.query.productType),
      baseInfoMap: new Map([
        [1, { componentName: 'erpInformation', detailRequest: authOrderErpDetail, updateRequest: authOrderErpUpdate, addRequest: authOrderErpAdd, form: formErpObj }],
        [3, { componentName: 'retailInformation', detailRequest: authOrderWlsDetail, updateRequest: authOrderWlsUpdate, addRequest: authOrderWlsAdd, form: formWlsOrWcyObj }],
        [4, { componentName: 'repastInformation', detailRequest: authOrderWcyDetail, updateRequest: authOrderWcyUpdate, addRequest: authOrderWcyAdd, form: formWlsOrWcyObj }],
        [5, { componentName: 'cloundInformation', detailRequest: authOrderYsDetail, updateRequest: authOrderYsUpdate, addRequest: authOrderYsAdd, form: formYsObj }]
      ]),
      checkSaveBtnLoad: false,
      checkVerifyBtnLoad: false,
      userBaseInfo: {}
    }
  },
  computed: {
    currentOrderStatus() {
      const { status, orderStatus: orderStatusVal } = this.$route.query
      if (status) {
        if (orderStatus.has(parseFloat(orderStatusVal))) return orderStatus.get(parseFloat(orderStatusVal)).label
        else return '未保存'
      } else return ''
    }
  },
  created() {
    this.activeName = this.baseInfoMap.get(this.productType).componentName
    this.form = deepClone(this.baseInfoMap.get(this.productType).form)
  },
  mounted() {
    if (this.$route.query.status === 'add') this.getBaseInfo()
    else this.getDetail()
  },
  methods: {
    handleVerify() {
      this.$confirm('确定要提交吗？', '提示', {
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            try {
              instance.confirmButtonLoading = true
              let data = {}
              if (this.productType === 1) data = this.getErpInformationObj()
              else if (this.productType === 3) data = this.getRetailInformationObj()
              await this.baseInfoMap.get(this.productType).updateRequest(data)
              this.getDetail().then(() => {
                this.$router.replace({ name: this.$route.name, query: { id: this.$route.query.id, productType: this.productType, status: 'detail' } })
              })
              this.$message({ type: 'success', message: '提交成功' })
            } catch (error) {
            } finally {
              instance.confirmButtonLoading = false
              done()
            }
          } else done()
        }
      }).catch(() => {})
    },
    handleCancel(name) {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ name }))
    },
    handleRetailSave() {
      return this.getRetailInformationObj()
    },
    getYsInformationObj() {
      const { handMan, inventoryAmount } = this.form.authOrderDTO
      const { merchantNo: merchantId } = this.form.merchantDTO
      return {
        authOrderVO: {
          agentId: this.userBaseInfo.agentId,
          createUser: JSON.parse(localStorage.userInfo).id,
          inventoryAmount: inventoryAmount || 1,
          handMan,
          merchantId,
          orderStatus: 0,
          productCode: this.$refs.information.merchantInfo.productCode,
          productType: 5,
          useModal: this.form.merchantDTO.applicationModule,
          delayCount: this.form.merchantDTO.delayHour
        },
        orderDetailVos: this.form.detailDTOList
      }
    },
    getWcyInformationObj() {
      const { handMan, inventoryAmount } = this.form.authOrderDTO
      const { merchantNo: merchantId } = this.form.merchantDTO
      return {
        authOrderVO: {
          agentId: this.userBaseInfo.agentId,
          createUser: JSON.parse(localStorage.userInfo).id,
          inventoryAmount: inventoryAmount || 1,
          handMan,
          merchantId,
          orderStatus: 0,
          productCode: this.$refs.information.merchantInfo.productCode,
          productType: 4,
          useModal: this.form.merchantDTO.applicationModule,
          delayCount: this.form.merchantDTO.delayHour
        },
        orderDetailVos: this.form.detailDTOList
      }
    },
    getWlsInformationObj() {
      const { handMan, inventoryAmount } = this.form.authOrderDTO
      const { merchantId } = this.form.merchantDTO
      return {
        authOrderVO: {
          agentId: this.userBaseInfo.agentId,
          createUser: JSON.parse(localStorage.userInfo).id,
          inventoryAmount: inventoryAmount || 1,
          handMan,
          merchantId,
          orderStatus: 0,
          productCode: this.form.detailDTOList[0].productCode,
          productType: 3,
          useModal: this.form.merchantDTO.applicationModule,
          delayCount: this.form.merchantDTO.delayHour
        },
        orderDetailVos: this.form.detailDTOList
      }
    },
    getErpInformationObj() {
      const insufficientObj = this.form.erpAuthOrderDetails.filter(item => item.authNum > item.orderInventory)
      if (insufficientObj.length > 0) {
        this.$confirm(`[${insufficientObj[0].moduleName}]的库存不足，当前库存: ${insufficientObj[0].orderInventory}`, {
          title: '系统提示',
          type: 'warning',
          confirmButtonText: '去采购',
          cancelButtonText: '返回修改',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') this.$router.push({ name: 'softwarePurchaseDetails', query: { status: 'add' } })
            else this.$refs.information.getProductStock()
            done()
          }
        }).catch(() => {})
      } else {
        const { handMan, inventoryAmount } = this.form.authOrderDTO
        const { merchantId, productCode } = this.form.erpAuthMerchantDTO
        return {
          authOrderVO: {
            handMan,
            merchantId,
            productCode,
            inventoryAmount,
            agentId: this.userBaseInfo.agentId,
            createUser: JSON.parse(localStorage.userInfo).id,
            orderStatus: 0,
            productType: 1,
            useModal: -1
          },
          orderDetailVos: this.form.erpAuthOrderDetails
        }
      }
    },
    async handleSave() {
      try {
        this.checkSaveBtnLoad = true
        let data = {}
        if (this.productType === 1) data = this.getErpInformationObj()
        else if (this.productType === 3) data = this.getRetailInformationObj()
        else if (this.productType === 4) data = this.getWcyInformationObj()
        const res =
          this.$route.query.status === 'add' ? await this.baseInfoMap.get(this.productType).addRequest(data) : await this.baseInfoMap.get(this.productType).updateRequest(data)
        if (this.$route.query.status === 'add') {
          this.$router.replace({ name: this.$route.name, query: { id: res, productType: this.productType, status: 'edit' } })
          document.querySelector('.e-tag_active span').innerText = `软件授权订单/编辑`
        }
        this.getDetail()
        this.$message({ type: 'success', message: '保存成功' })
      } catch (error) {
      } finally {
        this.checkSaveBtnLoad = false
      }
    },
    async getDetail() {
      try {
        this.checkBasicInformLoad = true
        const res = await this.baseInfoMap.get(this.productType).detailRequest(this.$route.query.id)
        this.form = res
        this.$nextTick(() => {
          if (this.productType === 1) {
            this.$refs.information.getShopPage().then(() => {
              this.$refs.information.$refs.shopPage.selectVal = res.erpAuthMerchantDTO.merchantId
            })
          } else if (this.productType === 3) {
            this.form.merchantDTO.applicationModule = res.authOrderDTO.useModal
            this.form.merchantDTO.merchantId = res.authOrderDTO.merchantId
            this.form.merchantDTO.productCode = res.authOrderDTO.productCode
            this.$refs.information.getCustList()
          }
        })
      } catch (error) {
      } finally {
        this.checkBasicInformLoad = false
      }
    },
    async getBaseInfo() {
      try {
        const res = await queryBaseInfo()
        this.userBaseInfo = res
        this.getHandlerMan(res.districtCode)
        if (this.productType === 3) this.$refs.information.getCustList()
        else if (this.productType === 4) this.$refs.information.getCustList()
      } catch (error) {}
    },
    async getHandlerMan(area) {
      try {
        const { id = '', contactor = '', mobile = '' } = await queryHandlerMan({ area })
        this.form.authOrderDTO.handMan = id
        this.form.authOrderDTO.handManName = `${contactor}${mobile ? '（' + mobile + '）' : ''}`
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
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
  &-state {
    font-size: 14px;
    &_text {
      background-color: #eff5ff;
      color: #3377ff;
      border-radius: 3px;
      padding: 5px 12px;
    }
  }
  &-title {
    color: #1f2e4d;
    font-weight: 500;
  }
}
.p-infomation-action {
  width: calc(100% - 200px - 42px);
  height: 56px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  line-height: 56px;
  text-align: center;
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
  z-index: 1000;
  /deep/ .el-button {
    padding: 8px 22px;
  }
}
.e-product {
  &-choose {
    text-align: right;
    padding-bottom: 10px;
    margin-top: -10px;
  }
  &-tip {
    color: #8c919c;
    font-size: 14px;
  }
  &_remark {
    width: 100%;
    /deep/ .el-input__inner {
      text-align: left !important;
    }
  }
}
</style>
