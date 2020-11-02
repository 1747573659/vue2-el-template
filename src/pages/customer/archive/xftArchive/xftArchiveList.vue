<template>
  <div>
    <div class="search-box">
      <section class="p-count_con" v-if="countData.length > 0">
        <img src="../../../../assets/images/icon/mark.png" alt="提示" />
        <template v-for="item in countData">
          <div class="p-count_item" :key="item.auditStatus">{{ item.label }}：{{ item.total }}</div>
        </template>
      </section>
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="80px">
        <el-row>
          <el-col :span="21">
            <el-form-item label="申请时间">
              <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="资料状态">
              <el-select style="width: 240px" clearable v-model="form.auditStatus" placeholder="全部">
                <el-option v-for="item in auditStatusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="认证状态">
              <el-select style="width: 240px" clearable v-model="form.wxCertStatus" placeholder="全部">
                <el-option v-for="item in wxCertStatusOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商户信息">
          <el-input style="width: 240px" maxlength="50" clearable placeholder="商户名称/简称/公司名称/卡号" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="停用">
          <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left:30px">
          <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" class="add-btn" size="small" @click="add" plain icon="el-icon-plus" v-permission="'XFT_LIST_ADD'">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        v-loading="tableLoading"
        :max-height="tableMaxHeight"
        :default-sort="{ prop: 'archiveBaseDTO.createTime', order: 'descending' }"
        @sort-change="tableSortChange"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable="custom" width="110"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.id" label="资料ID" width="100"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantName" label="商户名称"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantShortName" label="商户简称"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.companyName" label="公司名称"> </el-table-column>
        <el-table-column prop="archiveExpandDTO.bankCard" label="银行卡号"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.auditStatus" label="资料状态" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.archiveBaseDTO.auditStatus === 4 || scope.row.archiveBaseDTO.auditStatus === 8" class="table-text-color" @click="statusClick(scope.row)">
              {{ auditStatusList[scope.row.archiveBaseDTO.auditStatus] }}
            </span>
            <span v-else>{{ auditStatusList[scope.row.archiveBaseDTO.auditStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="微信认证状态" width="130">
          <template slot-scope="scope">
            {{ wxCertStatusList[scope.row.archiveBaseDTO.wxCertStatus] }}
          </template>
        </el-table-column>
        <el-table-column prop="archiveBaseDTO.fixFeeRate" label="费率" width="80">
          <template slot-scope="scope">
            {{ scope.row.archiveBaseDTO.fixFeeRate ? scope.row.archiveBaseDTO.fixFeeRate / 100 + '%' : '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="archiveBaseDTO.stopUse" label="停用" width="80">
          <template slot-scope="scope">
            {{ scope.row.archiveBaseDTO.stopUse ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="right" width="170px">
          <template slot-scope="scope">
            <el-button v-permission="'XFT_LIST_EDIT'" v-if="[0, 1, 4, 8].includes(scope.row.archiveBaseDTO.auditStatus)" @click="edit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-button v-permission="'XFT_LIST_EDIT'" v-if="[2].includes(scope.row.archiveBaseDTO.auditStatus)" @click="check(scope.row)" type="text" size="small">审核</el-button>
            <el-button v-if="[3, 5, 6, 7, 9].includes(scope.row.archiveBaseDTO.auditStatus)" @click="detail(scope.row)" type="text" size="small">详情</el-button>
            <el-button v-permission="'XFT_LIST_ADD'" @click="copy(scope.row)" type="text" size="small">复制</el-button>
            <el-button v-permission="'XFT_LIST_STATUS'" @click="changeStatus(scope.row)" type="text" size="small" v-if="scope.row.archiveBaseDTO.auditStatus !== 0">{{
              scope.row.archiveBaseDTO.stopUse ? '启用' : '停用'
            }}</el-button>
            <el-popover :ref="`popover${scope.$index}`" placement="top-start" width="170" v-else class="e-popover_con">
              <p class="e-popover_prompt">确定删除所选数据吗？</p>
              <div class="e-popover_action">
                <el-button size="mini" type="text" @click="handleDraftCancel(scope.$index)">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDraftList(scope)">确定</el-button>
              </div>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
            <el-dropdown trigger="click" style="margin-left: 12px" v-if="scope.row.archiveBaseDTO.auditStatus === 6 || scope.row.archiveBaseDTO.auditStatus === 7">
              <span class="el-dropdown-link">
                ···
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item style="color: #3377FF" @click.native="archiveDetail(scope.row)">进件详情</el-dropdown-item>
                <el-dropdown-item style="color: #3377FF" @click.native="queryStatus(scope.row)">认证状态</el-dropdown-item>
                <el-dropdown-item
                  v-permission="'XFT_LIST_SHOP_QRCODE'"
                  style="color: #3377FF"
                  v-if="[3, 4, 5].includes(scope.row.archiveBaseDTO.wxCertStatus)"
                  @click.native="shopQRCode(scope.row)"
                  >商户扫码认证</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="km-page-block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog title="商户微信实名认证指引流程" :visible.sync="certificationVisible" width="507px" class="certification-dialog">
      <div class="certification-dialog-text">
        1. 商户联系人：<span style="color: #FF6010">{{ this.certificationForm.contact }}(手机尾号{{ this.certificationForm.contactPhone }})</span
        >微信扫描下方二维码，按照指引补充或修改联系人信息
      </div>
      <img v-if="certificationVisible" :src="imgSrc" class="certification-dialog-img" alt="qrcode" />
      <div class="certification-dialog-text">2. 完成信息补充后，引导公司法人完成法人的实名认证（或对公账户验证）</div>
      <div class="certification-dialog-text">3. 完成1-2两步操作之后，即完成了微信关于系统风控，用户资金安全的监管要求，开户成功！</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" style="padding: 8px 22px" @click="certificationVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryPage, queryCertificationStatus, stopUse, queryContactQrCode, queryTotalByStatus, delList } from '@/api/xftArchive'
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.currentPage = 1
      vm.getList()
      vm.handleQueryTotalByStatus()
    })
  },
  name: 'xftArchive',
  data() {
    return {
      countData: [],
      certificationForm: {},
      form: {
        createTime: '',
        name: '',
        time: [],
        auditStatusList: [],
        auditStatus: '',
        wxCertStatus: '',
        status: 0
      },
      auditStatusOptions: [
        { id: '', name: '全部' },
        { id: 0, name: '草稿' },
        { id: 1, name: '未通过审核编辑中' },
        { id: 2, name: '待审核' },
        { id: 3, name: '平台审核中' },
        { id: 4, name: '未通过审核' },
        { id: 5, name: '账号申请中' },
        { id: 6, name: '账号部分申请通过' },
        { id: 7, name: '账号全部申请通过' },
        { id: 8, name: '资料待补充' },
        { id: 9, name: '资料补充待审核' }
      ],
      wxCertStatusOptions: [
        { id: '', name: '全部' },
        { id: 0, name: '未认证' },
        { id: 1, name: '编辑中' },
        { id: 2, name: '审核中' },
        { id: 3, name: '待确认联系信息' },
        { id: 4, name: '待账户验证' },
        { id: 5, name: '审核通过' },
        { id: 6, name: '审核驳回' },
        { id: 7, name: '已冻结' },
        { id: 8, name: '已作废' }
      ],
      auditStatusList: {
        0: '草稿',
        1: '未通过审核编辑中',
        2: '待审核',
        3: '平台审核中',
        4: '未通过审核',
        5: '账号申请中',
        6: '账号部分申请通过',
        7: '账号全部申请通过',
        8: '资料待补充',
        9: '资料补充待审核',
        10: '账号申请中',
        11: '账号申请中'
      },
      wxCertStatusList: {
        0: '未认证',
        1: '编辑中',
        2: '审核中',
        3: '待确认联系信息',
        4: '待账户验证',
        5: '审核通过',
        6: '审核驳回',
        7: '已冻结',
        8: '已作废'
      },
      statusList: [
        { id: '', name: '全部' },
        { id: 1, name: '是' },
        { id: 0, name: '否' }
      ],
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      certificationVisible: false,
      cxLoading: false,
      tableLoading: false,
      imgSrc: '',
      countOptions: [
        { value: 0, label: '草稿' },
        { value: 2, label: '待审核' },
        { value: 9, label: '资料补充待审核' },
        { value: 3, label: '平台审核中' },
        { value: 8, label: '资料待补充' },
        { value: 1, label: '未通过审核编辑中' },
        { value: 4, label: '未通过审核' }
      ]
    }
  },
  methods: {
    handleQueryTotalByStatus: async function() {
      let data = {
        orders: {
          createTime: this.form.createTime
        },
        startTime: this.form.time && this.form.time.length > 0 ? this.form.time[0] + ' 00:00:00' : '',
        endTime: this.form.time && this.form.time.length > 0 ? this.form.time[1] + ' 23:59:59' : '',
        auditStatusList: this.form.auditStatus === '' || this.form.auditStatus === null ? null : this.form.auditStatus === 5 ? [5, 10, 11] : [this.form.auditStatus],
        merchantName: this.form.name,
        merchantShortName: this.form.name,
        companyName: this.form.name,
        bankCard: this.form.name,
        wxCertStatus: this.form.wxCertStatus,
        stopUse: this.form.status,
        page: this.currentPage,
        rows: this.pageSize
      }
      try {
        const res = await queryTotalByStatus(data)
        for (const item of res) {
          for (const ele of this.countOptions) {
            if (ele.value === item.auditStatus) this.countData.push({ label: ele.label, total: item.total })
          }
        }
      } catch (error) {}
    },
    handleDraftCancel(index) {
      this.$refs[`popover${index}`].doClose()
    },
    handleDraftList: async function(scope) {
      try {
        await delList({ id: scope.row.archiveBaseDTO.id })
        this.getList()
      } catch (error) {
      } finally {
        this.$refs[`popover${scope.$index}`].doClose()
      }
    },
    tableSortChange({ column, prop, order }) {
      if (order === 'ascending') {
        this.form.createTime = 'asc'
      } else if (order === 'descending') {
        this.form.createTime = 'desc'
      } else {
        this.form.createTime = ''
      }
      this.currentPage = 1
      this.getList()
    },
    add() {
      this.$router.push({ name: 'xftArchiveAdd' })
    },
    edit(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: row.archiveBaseDTO.auditStatus, id: row.archiveBaseDTO.id } })
    },
    check(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: row.archiveBaseDTO.auditStatus, id: row.archiveBaseDTO.id } })
    },
    detail(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: row.archiveBaseDTO.auditStatus, id: row.archiveBaseDTO.id } })
    },
    copy(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { isCopy: true, id: row.archiveBaseDTO.id } })
    },
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
    },
    async changeStatus(row) {
      let data = {
        archiveId: row.archiveBaseDTO.id,
        stopUse: row.archiveBaseDTO.stopUse ? 0 : 1
      }
      try {
        const res = await stopUse(data)
        this.getList()
        this.$message.success('操作成功')
      } catch (error) {}
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList()
    },
    statusClick(row) {
      this.$alert(row.archiveBaseDTO.auditRemark)
    },
    async shopQRCode(row) {
      this.certificationForm.contact = row.archiveBaseDTO.contact
      this.certificationForm.contactPhone = row.archiveBaseDTO.contactPhone.substring(7)
      let data = {
        bankChannelCode: row.useBankChannelCode,
        valueId: row.archiveBaseDTO.id
      }
      try {
        const res = await queryContactQrCode(data)
        this.imgSrc = 'data:image/png;base64,' + res
        this.certificationVisible = true
      } catch (error) {}
    },
    archiveDetail(row) {
      this.$router.push({ name: 'xftArchiveDetail', query: { id: row.archiveBaseDTO.id } })
    },
    async getList() {
      this.tableLoading = true
      let data = {
        orders: {
          createTime: this.form.createTime
        },
        startTime: this.form.time && this.form.time.length > 0 ? this.form.time[0] + ' 00:00:00' : '',
        endTime: this.form.time && this.form.time.length > 0 ? this.form.time[1] + ' 23:59:59' : '',
        auditStatusList: this.form.auditStatus === '' || this.form.auditStatus === null ? null : this.form.auditStatus === 5 ? [5, 10, 11] : [this.form.auditStatus],
        merchantName: this.form.name,
        merchantShortName: this.form.name,
        companyName: this.form.name,
        bankCard: this.form.name,
        // 'auditStatusList': this.form.auditStatus,
        wxCertStatus: this.form.wxCertStatus,
        stopUse: this.form.status,
        page: this.currentPage,
        rows: this.pageSize
      }
      try {
        const res = await queryPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (e) {
      } finally {
        this.cxLoading = false
        this.tableLoading = false
      }
    },
    async queryStatus(row) {
      let data = {
        valueId: row.archiveBaseDTO.id,
        bankChannelCode: row.useBankChannelCode
      }
      try {
        const res = await queryCertificationStatus(data)
        this.$alert(`微信认证状态为：${res.message}`, '', {
          confirmButtonText: '确定',
          callback: action => {
            this.getList()
          }
        })
      } catch (error) {}
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 112.5 - 32 - 116
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.certification-dialog {
  /deep/.el-dialog__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    .certification-dialog-text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d4966;
      margin-bottom: 12px;
      line-height: 22px;
    }
    .certification-dialog-text:last-child {
      margin-bottom: 0px;
    }
    .certification-dialog-img {
      margin: 18px 30px 30px;
      width: 152px;
      height: 152px;
    }
  }
}
.km-archive-search {
  padding: 8px 13px;
}
.add-btn {
  padding: 8px 15.5px;
}
.el-dropdown-link {
  font-size: 18px;
  color: #3377ff;
  cursor: pointer;
}
.table-text-color {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ff6010;
  cursor: pointer;
}
.p {
  &-count {
    &_con {
      background: rgba(255, 96, 16, 0.08);
      margin: 0 8px 16px 8px;
      border: 1px solid rgba(255, 96, 16, 0.4);
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      font-size: 14px;
      color: #3d4966;
      img {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
    &_item {
      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
}
.e {
  &-popover {
    &_con {
      margin-left: 12px;
    }
    &_prompt {
      margin-bottom: 15px;
    }
    &_action {
      text-align: right;
    }
  }
}
</style>
