<template>
  <div>
    <div class="search-box">
      <div class="p-count-con">
        <section class="p-count-main" v-if="countData.length>0">
          <img src="../../../../assets/images/icon/mark.png" alt="提示" />
          <template v-for="item in countData">
            <div class="p-count_item" :key="item.label">{{ item.label }}：{{ item.total }}</div>
          </template>
        </section>
      </div>
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="75px">
        <el-row>
          <el-col>
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
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
          <el-col>
            <el-form-item label="商户信息">
              <el-input style="width: 240px" maxlength="50" clearable placeholder="商户名称/简称/公司名称/卡号" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="当前通道">
              <el-select style="width: 240px" clearable v-model="form.channelTypeCode" placeholder="全部">
                <el-option v-for="item in channelList" :key="item.channelCode" :label="item.channelName" :value="item.channelCode"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="停用">
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="padding-left:75px">
            <el-form-item>
              <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="search">查询</el-button>
              <el-button v-permission="'XFTARCHIVE_LIST_EXPORT'" :loading="exportLoad" @click="handleExport">导出</el-button>
              <el-button v-permission="'XFTARCHIVE_LIST_EXPORT'" @click="handleExportLists">导出记录</el-button>
            </el-form-item>
            <el-form-item style="float:right">
              <el-button type="primary" class="add-btn" size="small" @click="add" plain icon="el-icon-plus" v-permission="'XFT_LIST_ADD'">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        v-loading="tableLoading"
        :max-height="tabMaxHeight"
        :default-sort="{ prop: 'archiveBaseDTO.createTime', order: 'descending' }"
        @sort-change="tableSortChange"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable="custom" width="110"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.id" label="资料ID" width="100"> </el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantName" label="商户/公司名称" width="200">
          <template slot-scope="scope">
            <div class="archive-table-oneline">{{ scope.row.archiveBaseDTO.merchantName || '--' }}</div>
            <div class="archive-table-oneline">{{ scope.row.archiveBaseDTO.companyName || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantShortName" label="商户简称/银行卡号" width="200">
          <template slot-scope="scope">
            <div class="archive-table-oneline">{{ scope.row.archiveBaseDTO.merchantShortName || '--' }}</div>
            <div class="archive-table-oneline">{{ scope.row.archiveExpandDTO.bankCard || '--' }}</div>
          </template></el-table-column
        >
        <el-table-column prop="archiveChannelList" label="已进件通道" width="140" class-name="archived-channel">
          <template slot-scope="scope">
            <div v-if="scope.row.archiveChannelList">
              <div v-for="(item, index) in scope.row.archiveChannelList" :key="index">{{ item.channelName }}</div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column prop="useBankChannelCodeName" label="当前通道" width="140">
          <template slot-scope="scope">
            {{ scope.row.useBankChannelCodeName || '--' }}
          </template>
        </el-table-column>
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
            <span>{{ wxCertStatusList[scope.row.archiveBaseDTO.wxCertStatus] }}</span>
            <el-button v-if="scope.row.archiveBaseDTO.wxCertStatus === 1" class="e-btn-mgl" type="text" @click="handleWxCertReason(scope.row)">原因</el-button>
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
        <el-table-column label="操作" fixed="right" align="right" width="180px">
          <template slot-scope="scope">
            <el-button v-permission="'XFT_LIST_EDIT'" v-if="[0, 1, 4, 8].includes(scope.row.archiveBaseDTO.auditStatus)" @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button v-permission="'XFT_LIST_EDIT'" v-if="[2].includes(scope.row.archiveBaseDTO.auditStatus)" @click="check(scope.row)" type="text" size="small">审核</el-button>
            <el-button v-if="[3, 5, 6, 7, 9].includes(scope.row.archiveBaseDTO.auditStatus)" @click="detail(scope.row)" type="text" size="small">详情</el-button>
            <el-button v-if="scope.row.archiveBaseDTO.source !== 3" v-permission="'XFT_LIST_ADD'" @click="copy(scope.row)" type="text" size="small">复制</el-button>
            <el-button v-permission="'XFT_LIST_STATUS'" @click="changeStatus(scope.row)" type="text" size="small" v-if="scope.row.archiveBaseDTO.auditStatus !== 0">{{
              scope.row.archiveBaseDTO.stopUse ? '启用' : '停用'
            }}</el-button>
            <el-popconfirm class="e-popover_con" @confirm="handleDraftList(scope)" placement="top-start" title="确定删除所选数据吗？" v-else>
              <el-button type="text" size="small" slot="reference">删除</el-button>
            </el-popconfirm>
            <el-dropdown trigger="click" style="margin-left: 12px" v-if="scope.row.archiveChannelList">
              <el-button type="text" size="small">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="[6, 7].includes(scope.row.archiveBaseDTO.auditStatus)" style="color: #3377FF" @click.native="archiveDetail(scope.row)">进件详情</el-dropdown-item>
                <el-dropdown-item style="color: #3377FF" @click.native="queryStatus(scope.row)">认证状态</el-dropdown-item>
                <el-dropdown-item v-permission="'XFT_LIST_SHOP_QRCODE'"
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
          :page-sizes="[10, 30, 50]"
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
    <el-dialog class="p-export-con" title="导出记录" :visible.sync="exportVisible" custom-class="p-dialog-order">
      <el-table :data="exportLists" v-loading="exportLock">
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="createTime" label="导出时间" width="180"></el-table-column>
        <el-table-column label="进度" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.result === 1 ? '生成中' : scope.row.result === 2 ? '已生成' : '失败' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <template v-if="scope.row.result === 2">
              <el-link :href="scope.row.fileCompleteUrl" :underline="false">
                <el-button size="small" type="text">下载</el-button>
              </el-link>
              <el-button size="small" @click="handleExportDel(scope.row)" type="text" class="p-export_del">删除</el-button>
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-export-pagination">
        <el-pagination
          background
          @size-change="handleExportSizeChange"
          @current-change="handleExportCurrentChange"
          :page-sizes="[10, 15, 20, 25]"
          :current-page="exportCurrentPage"
          :page-size="exportPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="exportPageTotal"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  queryPage,
  queryCertificationStatus,
  stopUse,
  queryContactQrCode,
  queryTotalByStatus,
  delList,
  queryBankChannelType,
  xftArchiveExport,
  xftArchiveExportLog,
  xftArchiveExportDel
} from '@/api/xftArchive'
import { mapActions } from 'vuex'
import moment from 'moment'
import { tableMaxHeight } from '@/mixins/tableMaxHeight'

export default {
  name: 'xftArchive',
  mixins: [tableMaxHeight],
  data() {
    return {
      countData: [],
      certificationForm: {},
      form: {
        createTime: 'desc',
        name: '',
        time: [],
        auditStatusList: [],
        auditStatus: '',
        wxCertStatus: '',
        status: 0,
        channelTypeCode: ''
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
        { id: 1, name: '提交失败' },
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
        1: '提交失败',
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
      channelList: [],
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      certificationVisible: false,
      cxLoading: false,
      tableLoading: false,
      imgSrc: '',
      countOptions: [
        { auditStatus: 0, label: '草稿', total: 0 },
        { auditStatus: 2, label: '待审核', total: 0 },
        { auditStatus: 9, label: '资料补充待审核', total: 0 },
        { auditStatus: 3, label: '平台审核中', total: 0 },
        { auditStatus: 8, label: '资料待补充', total: 0 },
        { auditStatus: 1, label: '未通过审核编辑中', total: 0 },
        { auditStatus: 4, label: '未通过审核', total: 0 },
        { auditStatus: '', label: '微信认证审核驳回', total: 0 }
      ],
      // dialog
      exportVisible: false,
      exportLoad: false,
      exportLock: false,
      exportLists: [],
      exportCurrentPage: 1,
      exportPageSize: 10,
      exportPageTotal: 0
    }
  },
  activated() {
    this.countData = this.countOptions
    this.getList()
    this.handleQueryTotalByStatus()
  },
  mounted() {
    this.countData = this.countOptions
    this.getList()
    this.handleQueryTotalByStatus()
    this.getQueryBankChannelType()
  },
  methods: {
    ...mapActions(['delCachedView']),
    handleWxCertReason(row){
      this.$alert(row.archiveBaseDTO.wxCertResultMsg, '认证失败原因', { confirmButtonText: '知道了' })
    },
    handleExportDel(row) {
      this.$confirm('确定要删除这条导出记录吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            xftArchiveExportDel({ id: row.id })
              .then(() => {
                this.$message({ type: 'success', message: '删除成功' })
                if (!--this.exportLists.length) this.exportCurrentPage = Math.ceil((this.exportPageTotal - 1) / this.exportPageSize) || 1
                this.handleExportRecord()
              })
              .finally(() => {
                instance.confirmButtonLoading = false
                done()
              })
          } else done()
        }
      }).catch(err => {})
    },
    handleExportCurrentChange(val) {
      this.exportCurrentPage = val
      this.handleExportRecord()
    },
    handleExportSizeChange(val) {
      this.exportCurrentPage = 1
      this.exportPageSize = val
      this.handleExportRecord()
    },
    handleExportRecord: async function() {
      const data = { exportType: 1, page: this.exportCurrentPage, rows: this.exportPageSize }
      try {
        this.exportLock = true
        const res = await xftArchiveExportLog(data)
        this.exportLists = res.results
        this.exportPageTotal = res.totalCount
      } finally {
        this.exportLock = false
      }
    },
    handleExportLists() {
      this.handleExportRecord()
      this.exportVisible = true
    },
    handleQueryParams() {
      return {
        orders: { createTime: this.form.createTime },
        startTime: this.form.time && this.form.time.length > 0 ? this.form.time[0] + ' 00:00:00' : '',
        endTime: this.form.time && this.form.time.length > 0 ? this.form.time[1] + ' 23:59:59' : '',
        auditStatusList: this.form.auditStatus === '' || this.form.auditStatus === null ? null : this.form.auditStatus === 5 ? [5, 10, 11] : [this.form.auditStatus],
        merchantName: this.form.name,
        merchantShortName: this.form.name,
        channelTypeCode: this.form.channelTypeCode,
        companyName: this.form.name,
        bankCard: this.form.name,
        wxCertStatus: this.form.wxCertStatus,
        stopUse: this.form.status,
        page: this.currentPage,
        rows: this.pageSize
      }
    },
    handleExport: async function() {
      if (!this.form.time?.length || moment(this.form.time[1]).diff(moment(this.form.time[0]), 'days') > 62) {
        this.$message({ type: 'warning', message: '导出数据的时间范围最大支持62天，请更改时间条件后重试' })
        return false
      }
      this.exportLoad = true
      try {
        this.$message({ type: 'success', message: '数据文件生成中，请稍后在导出记录中下载' })
        await xftArchiveExport({ menu: this.$route.meta.title, params: this.handleQueryParams() })
      } catch (error) {} finally {
        this.exportLoad = false
      }
    },
    handleQueryTotalByStatus: async function() {
      try {
        const res = await queryTotalByStatus(this.handleQueryParams())
        this.countData = []
        const intersectionBy = (a, b, fn) => {
          const s = new Set(b.map(fn))
          return [...new Set(a)].filter(x => s.has(fn(x)))
        }
        const auditStatuses = intersectionBy(res.auditStatuses, this.countOptions, x => x.auditStatus)
        if (auditStatuses.length > 0) {
          for (const ele of this.countOptions) {
            for (const item of res.auditStatuses) {
              if (ele.auditStatus === item.auditStatus) this.countData.push({ label: ele.label, total: item.total })
            }
          }
          if(res.wxCertStatuses?.length) this.countData.push({ label: '微信认证审核驳回', total: res.wxCertStatuses.filter(item => item.wxCertStatus === 6)[0].wxCertTotal || 0 })
        } else this.countData = this.countOptions
      } catch (error) {}
    },
    handleDraftList: async function(scope) {
      try {
        await delList({ id: scope.row.archiveBaseDTO.id })
        this.getList()
        this.handleQueryTotalByStatus()
      } catch (error) {}
    },
    tableSortChange({ column, prop, order }) {
      this.form.createTime = order ? order.substring(0, order.indexOf('ending')) : ''
      this.currentPage = 1
      this.getList()
    },
    add() {
      this.delCachedView({ name: 'xftArchiveAdd' }).then(() => {
        this.$router.push({ name: 'xftArchiveAdd' })
      })
    },
    edit(row) {
      this.delCachedView({ name: 'xftArchiveAdd' }).then(() => {
        this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: row.archiveBaseDTO.auditStatus, id: row.archiveBaseDTO.id } })
      })
    },
    check(row) {
      this.delCachedView({ name: 'xftArchiveAdd' }).then(() => {
        this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: row.archiveBaseDTO.auditStatus, id: row.archiveBaseDTO.id } })
      })
    },
    detail(row) {
      this.delCachedView({ name: 'xftArchiveAdd' }).then(() => {
        this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: row.archiveBaseDTO.auditStatus, id: row.archiveBaseDTO.id } })
      })
    },
    copy(row) {
      this.delCachedView({ name: 'xftArchiveAdd' }).then(() => {
        this.$router.push({ name: 'xftArchiveAdd', query: { isCopy: true, id: row.archiveBaseDTO.id } })
      })
    },
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
      this.handleQueryTotalByStatus()
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
      this.$router.push({ name: 'xftArchiveDetail', query: { id: row.archiveBaseDTO.id, contact: row.archiveBaseDTO.contact, contactPhone: row.archiveBaseDTO.contactPhone } })
    },
    async getQueryBankChannelType() {
      try {
        let res = await queryBankChannelType()
        this.channelList = res
        this.channelList.unshift({ channelCode: '', channelName: '全部' })
      } catch (error) {}
    },
    async getList() {
      this.tableLoading = true
      try {
        const res = await queryPage(this.handleQueryParams())
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
  }
}
</script>

<style lang="scss" scoped>
/deep/ .p-dialog-order {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  .el-dialog__body {
    flex: 1;
    overflow: auto;
  }
}
.search-box {
  margin-left: -16px;
  margin-right: -16px;
  border-bottom: 16px solid #f7f8fa;
}
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
      width: 240px;
      height: 240px;
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
    &-con {
      min-height: 34px;
      margin: 0 8px 16px 8px;
    }
    &-main {
      background: rgba(255, 96, 16, 0.08);
      border: 1px solid rgba(255, 96, 16, 0.4);
      border-radius: 2px;
      display: flex;
      align-items: center;
      padding: 7px 16px;
      font-size: 14px;
      color: #3d4966;
      img {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }
    &_item {
      &:not(:last-child) {
        margin-right: 30px;
      }
    }
  }
  &-export {
    &-con {
      /deep/ {
        .has-gutter th {
          padding: 12px 0;
        }
        .el-link {
          vertical-align: inherit;
        }
      }
    }
    &-pagination {
      padding-top: 18px;
      text-align: right;
    }
    &_del {
      margin-left: 8px;
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
  &-btn{
    &-mgl{
      margin-left: 10px;
    }
  }
}
</style>
<style lang="scss">
.archived-channel {
  .cell {
    display: block !important;
  }
}
</style>
