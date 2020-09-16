<template>
  <div>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="100px">
        <el-row>
          <el-col :span="21">
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="form.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="资料状态">
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="认证状态">
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商户信息">
          <el-input style="width: 240px" maxlength="50" clearable placeholder="商户名称/简称/公司名称/银行卡号" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="停用">
          <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-left:30px">
          <el-button type="primary" class="km-archive-search" :loading="cxLoading" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" class="add-btn" size="small" @click="add" plain icon="el-icon-plus" v-permission="'ACCOUNT_ROLE_ADD'">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-box">
      <el-table
        :loading="tableLoading"
        :max-height="tableMaxHeight"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="createTime"
          label="商户简称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="公司名称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="银行卡号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="资料状态">
          <template slot-scope="scope">
            <span class="table-text-color" @click="statusClick(scope.row)">
              {{scope.row.creatorName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="微信认证状态">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="费率">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="停用">
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          width="240px">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="copy(scope.row)" type="text" size="small">复制</el-button>
            <el-button @click="changeStatus(scope.row)" type="text" size="small">停用</el-button>
            <el-dropdown style="margin-left: 12px">
              <span class="el-dropdown-link">
                ···
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="toDetail(scope.row)">进件详情</el-dropdown-item>
                <el-dropdown-item @click.native="shopQRCode(scope.row)">认证状态</el-dropdown-item>
                <el-dropdown-item @click.native="shopQRCode(scope.row)">商户扫码认证</el-dropdown-item>
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
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="商户微信实名认证指引流程"
      :visible.sync="certificationVisible"
      width="507px"
      class="certification-dialog">
      <div class="certification-dialog-text">1. 商户联系人：<span style="color: #FF6010">郭鼎(手机尾号9902)</span>微信扫描下方二维码，按照指引补充或修改联系人信息</div>
      <img :src="imgSrc" class="certification-dialog-img" alt="qrcode">
      <div class="certification-dialog-text">2. 完成信息补充后，引导公司法人完成法人的实名认证（或对公账户验证）</div>
      <div class="certification-dialog-text">3. 完成1-2两步操作之后，即完成了微信关于系统风控，用户资金安全的监管要求，开户成功！</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" style="padding: 8px 22px" @click="certificationVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryDocumentByPage } from '@/api/setting/material'

export default {
  data() {
    return {
      form: {
        name: '',
        time: [],
        status: ''
      },
      statusList: [],
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      certificationVisible: false,
      cxLoading: false,
      tableLoading: false,
      imgSrc: require('@/assets/images/abnormal/404.png')
    }
  },
  methods: {
    add() {
      this.$router.push({ name: 'xftArchiveAdd' })
    },
    edit(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { type: 'edit' }})
    },
    copy(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { type: 'copy' }})
    },
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
    },
    changeStatus(row) {
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
      this.$alert(row.name)
    },
    shopQRCode (row) {
      this.certificationVisible = true
    },
    toDetail (row) {
      this.$router.push({ name: 'xftArchiveDetail' })
    },
    async getList() {
      this.tableLoading = true
      let data = {
        "endTime": this.form.time && this.form.time[1],
        "name": this.form.name,
        "orders": {},
        "page": this.currentPage,
        "rows": this.pageSize,
        "startTime": this.form.time && this.form.time[0]
      }
      try {
        const res = await queryDocumentByPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (e) {} finally {
        this.cxLoading = false
        this.tableLoading = false
      }
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 112.5 - 32 - 116
    }
  },
  mounted() {
    this.getList()
  }
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
      color: #3D4966;
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
  color: #3377FF;
  cursor: pointer;
}
.table-text-color {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FF6010;
  cursor: pointer;
}
</style>
