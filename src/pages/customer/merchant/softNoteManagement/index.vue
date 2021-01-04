<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" ref="form" size="small" :model="form" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="软注编码:">
              <el-input v-model.trim="form.custId" size="small" placeholder="请输入软注产品编码" clearable :maxlength="36"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商户信息:">
              <el-input v-model.trim="form.custName" size="small" placeholder="软注商户名称/联系人/手机号" clearable :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="软注产品:">
              <el-select style="width:100%" filterable v-model="form.productId" placeholder="请选择">
                <el-option label="全部" value=""> </el-option>
                <el-option v-for="item in allErpProductList" :key="item.productId" :label="item.productName" :value="item.productId"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权状态:">
              <el-select style="width:100%" filterable v-model="form.status" placeholder="请选择">
                <el-option v-for="item in authorizationState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="在线状态:">
              <el-select style="width:100%" filterable v-model="form.isOnline" placeholder="请选择">
                <el-option v-for="item in isOnlineState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="享钱商户:">
              <selectPage style="width:100%" :bind="form.shopId" @change="getSelectCont" ref="shopName" type="商户名称"></selectPage>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="享钱开通状态:">
              <el-select style="width:100%" filterable v-model="form.xqOpenStatus" placeholder="请选择">
                <el-option v-for="item in openingState" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="注册日期:">
              <el-date-picker
                style="width:100%"
                v-model="form.registrationDate"
                type="daterange"
                range-separator="至"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="false"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="">
              <el-button @click="authShopPage()" size="small" type="primary">查询</el-button>
              <el-button @click="reset()" size="small" type="primary" plain>重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box">
      <el-table v-loading="tableLoading" :data="tableList" style="width: 100%;margin-top:16px">
        <el-table-column type="index" label="序号" width="70"> </el-table-column>
        <el-table-column prop="custId" label="软注编码"> </el-table-column>
        <el-table-column prop="custName" label="软注商户名称"> </el-table-column>
        <el-table-column prop="productName" label="软注产品"> </el-table-column>
        <el-table-column prop="storeType" label="门店类型">
          <template slot-scope="scope">
            <span v-if="scope.row.storeType === '1'">总部</span>
            <span v-else-if="scope.row.storeType === '2'">连锁分店</span>
            <span v-else-if="scope.row.storeType === '3'">单店</span>
          </template>
        </el-table-column>
        <el-table-column prop="contacter" label="软注联系人">
          <template slot-scope="scope">
            <div>{{ scope.row.contacter }}</div>
            <div>{{ scope.row.contacterMobileNum }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="authCount" label="站点数" width="130px"> </el-table-column>
        <el-table-column prop="firstLoginDate" label="注册时间/地区">
          <template slot-scope="scope">
            <div>{{ scope.row.firstLoginDate }}</div>
            <div>{{ scope.row.companyProvince }}{{ scope.row.companyCity }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="firstGrantAuthDate" label="首次授权日期" width="130px"> </el-table-column>
        <el-table-column label="授权状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === '0'">试用中</span>
            <span v-else-if="scope.row.status === '1'">试用中</span>
            <span v-else-if="scope.row.status === '2'">授权使用</span>
            <span v-else-if="scope.row.status === '3'">停用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="onlineStatus" width="88" label="在线状态">
          <template slot-scope="scope">
            <div v-if="scope.row.onlineStatus === '1'">在线</div>
            <div v-else-if="scope.row.onlineStatus === '0'">离线</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 16px; text-align: right">
        <el-pagination
          :current-page="thisPage"
          :total="tableTotal"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :page-sizes="[10, 15, 20, 25]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { authorizationState } from './publicData/authorizationState' // 授权状态
import { isOnlineState } from './publicData/isOnlineState' // 在线状态
import { openingState } from './publicData/openingState' // 享钱开通状态
import selectPage from '@/components/selectPage/index.vue' //选择组件
import { authShopPage, getAllErpProduct } from '@/api/customer/merchant' //api
export default {
  components: { selectPage },
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      openingState, // 享钱开通状态
      isOnlineState, // 在线状态
      authorizationState, // 授权状态
      tableList: [], // 表格数据
      tableLoading: false, // 表格加载
      tableTotal: 0, // 表格总页数
      thisPage: 1, // 当前页
      pageSize: 15, // 每页多少条
      form: {
        custId: '', // 软注编码
        custName: '', // 商户信息
        productId: '', // 软注产品
        status: '', // 授权状态
        isOnline: '', // 在线状态
        shopId: '', // 享钱商户
        xqOpenStatus: '', // 享钱开通状态
        registrationDate: null // 注册日期
      }, // 搜索表单
      allErpProductList: [] // 软注产品列表
    }
  },
  created() {
    this.authShopPage()
    this.getAllErpProduct()
  },
  methods: {
    // 软注产品列表
    async getAllErpProduct() {
      const res = await getAllErpProduct()
      this.allErpProductList = res
    },
    // 重置
    reset() {
      this.form = {
        custId: '', // 软注编码
        custName: '', // 商户信息
        productId: '', // 软注产品
        status: '', // 授权状态
        isOnline: '', // 在线状态
        shopId: '', // 享钱商户
        xqOpenStatus: '', // 享钱开通状态
        registrationDate: null // 注册日期
      } // 搜索表单
      this.authShopPage()
    },
    // 分页
    handleSizeChange(val) {
      this.thisPage = 1
      this.pageSize = val
      this.authShopPage()
    },
    // 分页
    handleCurrentChange(val) {
      this.thisPage = val
      this.authShopPage()
    },
    // 分页查询
    async authShopPage() {
      let subData = {
        rows: this.pageSize,
        page: this.thisPage,
        custId: this.form.custId,
        custName: this.form.custName,
        productId: this.form.productId,
        status: this.form.status,
        isOnline: this.form.isOnline,
        shopId: this.form.shopId,
        xqOpenStatus: this.form.xqOpenStatus
      }
      if (this.form.registrationDate && this.form.registrationDate.length) {
        subData.startFirstGrantAuthDate = this.form.registrationDate[0]
        subData.endFirstGrantAuthDate = this.form.registrationDate[1]
      }
      if (subData.isOnline === '') {
        delete subData.isOnline
      }
      this.tableLoading = true
      const res = await authShopPage(subData)
      this.tableLoading = false
      this.tableList = res.results
      this.tableTotal = res.totalCount
    },
    getSelectCont(content, options, type) {
      if (type === '所属服务商') {
      } else if (type === '商户名称') {
        this.form.shopId = content
      } else if (type.includes('所属享钱门店')) {
      }
    }
    // // 详情
    // details(row) {
    //   this.$router.push({
    //     path: 'softNoteManagementDetile'
    //     // query: { custId: row.custId }
    //   })
    // }
  }
}
</script>
