<template>
  <div class="app-container">
    <div class="search-box">
      <el-form :inline="true" ref="form" size="small" :model="form" label-width="100px" class="xdd-btn-block__w240">
        <el-row>
          <el-col :span="8">
            <el-form-item label="软注编码:">
              <el-input v-model.trim="form.custId" size="small" placeholder="请输入软注产品编码" clearable :maxlength="36"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商户信息:">
              <el-input v-model.trim="form.authShopMessage" size="small" placeholder="软注商户名称/联系人/手机号" clearable :maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="软注产品:">
              <select-page
                placeholder="请输入名称"
                @focus="selectPageFocusErp"
                id="code"
                @change="selectPageChangeErp"
                @clear="selectPageClearErp"
                :name="selectPageNameErp"
                @remoteMethod="remoteMethodErp"
                :isMaxPage="isMaxPageErp"
                :options="ObjContentListErp"
                @loadMore="loadMoreErp"
                style="width: 100%"
              >
              </select-page>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="授权状态:">
              <el-select style="width:100%" filterable v-model="form.status" placeholder="请选择">
                <el-option v-for="item in authorizationState" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="在线状态:">
              <el-select style="width:100%" filterable v-model="form.isOnline" placeholder="请选择">
                <el-option v-for="item in isOnlineState" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="享钱商户:">
              <select-page
                placeholder="请输入名称"
                @focus="selectPageFocus"
                id="id"
                :showValue="true"
                @change="selectPageChange"
                @clear="selectPageClear"
                :name="selectPageName"
                @remoteMethod="remoteMethod"
                :isMaxPage="isMaxPage"
                :options="ObjContentList"
                :value="form.shopId"
                @loadMore="loadMore"
                style="width: 100%"
              >
              </select-page>
            </el-form-item>
          </el-col> -->
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
                style="width:240px"
                v-model="form.registrationDate"
                type="daterange"
                range-separator="至"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="true"
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
      <el-table v-loading="tableLoading" :data="tableList" style="width: 100%;">
        <el-table-column align="right" type="index" label="序号" width="70"></el-table-column>
        <el-table-column prop="custId" width="180" label="软注编码"></el-table-column>
        <el-table-column prop="custName" width="146" label="软注商户/享钱商户">
          <template slot-scope="scope">
            <div>{{ scope.row.custName }}{{ scope.row.merchantName ? `/${scope.row.merchantName}` : '' }}</div>
          </template></el-table-column
        >
        <el-table-column prop="productName" label="软注产品">
          <template slot-scope="scope">
            <div>
              {{ scope.row.productId }}
            </div>
            <div>
              {{ scope.row.productName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门店类型">
          <template slot-scope="scope">
            <span v-if="scope.row.storeType === 1">总部</span>
            <span v-else-if="scope.row.storeType === 2">连锁分店</span>
            <span v-else-if="scope.row.storeType === 3">单店</span>
          </template>
        </el-table-column>
        <el-table-column prop="contacter" label="软注联系人" min-width="115">
          <template slot-scope="scope">
            <div>{{ scope.row.contacter }}</div>
            <div>{{ scope.row.contacterMobileNum }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="authCount" label="站点数" align="right"></el-table-column>
        <el-table-column prop="firstLoginDate" width="120" label="注册日期/地区">
          <template slot-scope="scope">
            <div>{{ scope.row.firstLoginDate }}</div>
            <div>{{ scope.row.companyProvince }}{{ scope.row.companyCity }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="firstGrantAuthDate" label="首次授权日期" width="110px"></el-table-column>
        <el-table-column label="授权状态">
          <template slot-scope="scope">
            <span v-if="['0', '1'].includes(scope.row.status)">试用</span>
            <span v-else-if="scope.row.status === '2'">正式</span>
            <span v-else-if="scope.row.status === '3'">停用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="isOnline" width="88" label="在线状态">
          <template slot-scope="scope">
            <div v-if="scope.row.isOnline">在线</div>
            <div v-else-if="!scope.row.isOnline">离线</div>
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
import selectPage from '@/components/selectPage' //选择组件
import { authShopPage, queryAuthErpByPage, queryShopListByPage } from '@/api/customer/merchant' //api
export default {
  components: { selectPage },
  data() {
    return {
      // erp产品板块
      selectPageNoErp: 1, //其他地方复制过来的
      isMaxPageErp: false,
      searchStringErp: '',
      ObjContentListErp: [],
      selectPageNameErp: '', //其他地方复制过来的
      //享钱板块
      selectPageNo: 1, //其他地方复制过来的
      isMaxPage: false,
      searchString: '',
      ObjContentList: [],
      selectPageName: '', //其他地方复制过来的
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
        authShopMessage: '', // 商户信息
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
  },
  methods: {
    selectPageFocusErp() {
      this.isMaxPageErp = false
      this.ObjContentListErp = []
      this.searchStringErp = ''
      this.selectPageNoErp = 1
      if (!this.form.productId) {
        this.remoteMethodErp()
      }
    },
    selectPageFocus() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      if (!this.form.shopId) {
        this.remoteMethod()
      }
    },
    selectPageChangeErp(value) {
      this.form.productId = value
    },
    selectPageChange(value) {
      this.form.shopId = value
    },
    loadMoreErp() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPageErp) {
        this.selectPageNoErp++
        this.remoteMethodErp(this.searchStringErp)
      }
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
    selectPageClearErp() {
      this.isMaxPageErp = false
      this.ObjContentListErp = []
      this.searchStringErp = ''
      this.selectPageNoErp = 1
      this.form.productId = ''
    },
    // 如果点击了清除按钮则将相关数据清空
    selectPageClear() {
      this.isMaxPage = false
      this.ObjContentList = []
      this.searchString = ''
      this.selectPageNo = 1
      this.form.shopId = ''
    },
    async remoteMethodErp(value) {
      // 当输入新的值的时候，就把相关数据进行情况
      if (value !== this.searchStringErp) {
        this.selectPageNoErp = 1
        this.searchStringErp = ''
        this.isMaxPageErp = false
        this.ObjContentListErp = []
      }
      // 只有value有值的时候才去请求接口
      let data = {
        name: value || '',
        page: this.selectPageNoErp,
        rows: 10
      }
      try {
        let res = await queryAuthErpByPage(data)
        this.selectPageNameErp = 'name'
        // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
        if (res.length !== 0) {
          this.ObjContentListErp = this.ObjContentListErp.concat(res)
          this.searchStringErp = value
          if (res.length !== 10) {
            this.isMaxPageErp = true
          }
        } else {
          this.isMaxPageErp = true
        }
      } catch (error) {}
    },
    async remoteMethod(value) {
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
        let res = await queryShopListByPage(data)
        this.selectPageName = 'companyName'
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
    // 重置
    reset() {
      this.selectPageClear()
      this.selectPageClearErp()
      this.form = {
        custId: '', // 软注编码
        authShopMessage: '', // 商户信息
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
        authShopMessage: this.form.authShopMessage,
        productId: this.form.productId,
        status: this.form.status,
        isOnline: this.form.isOnline,
        // shopId: this.form.shopId,
        xqOpenStatus: this.form.xqOpenStatus
      }
      if (this.form.registrationDate && this.form.registrationDate.length) {
        subData.startFirstGrantAuthDate = `${this.form.registrationDate[0]} 00:00:00`
        subData.endFirstGrantAuthDate = `${this.form.registrationDate[1]} 23:59:59`
      }
      if (subData.isOnline === '') {
        delete subData.isOnline
      }
      this.tableLoading = true
      const res = await authShopPage(subData)
      this.tableLoading = false
      this.tableList = res.results
      this.tableTotal = res.totalCount
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

<style lang="scss" scoped>
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
</style>
