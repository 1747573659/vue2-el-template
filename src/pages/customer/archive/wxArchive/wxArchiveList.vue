<template>
  <section>
    <!-- <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="100px" @submit.native.prevent>
        <el-row class="p-general_row">
          <el-col :span="21">
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="资料状态">
              <el-select v-model="form.status" class="p-general_formWidth" clearable placeholder="全部">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户信息">
              <el-input v-model="form.msg" class="p-general_formWidth" maxlength="50" clearable placeholder="请输入商户名称/简称/公司名称/银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="停用">
              <el-select v-model="form.isDeactivate" class="p-general_formWidth" clearable placeholder="全部">
                <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="p-general_btnLabel">
                <el-button type="primary" class="km-archive-search">查询</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item class="p-general_fr">
              <el-button type="primary" class="add-btn" size="small" plain icon="el-icon-plus" v-permission="'ACCOUNT_ROLE_ADD'">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div> -->
    <div class="data-box">
      <el-table :max-height="tableMaxHeight" :data="tableData">
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable width="110" align="center"></el-table-column>
        <el-table-column prop="merchantName" label="商户名称"></el-table-column>
        <el-table-column prop="archiveBaseDTO.merchantShortName" label="商户简称"></el-table-column>
        <el-table-column prop="archiveBaseDTO.companyName" label="公司名称"></el-table-column>
        <el-table-column label="进件类型">
          <template slot-scope="scope">
            <p>{{ scope.row.archiveBaseDTO.archiveType === 1 ? '微信直连' : '小微商户' }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="archiveBaseDTO.auditStatus" label="资料状态">
          <template slot-scope="scope">
            <span :class="{ 'table-text-color': [4, 8].includes(scope.row.archiveBaseDTO.auditStatus) }">{{ scope.row.archiveBaseDTO.auditStatus | filterReview }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小微进件状态">
          <template slot-scope="scope">
            <span>{{ scope.row.xiaoWeiArchiveStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="xiaoWeiUpgradeStatus" label="升级状态">
          <template slot-scope="scope">
            <span>{{ scope.row.xiaoWeiUpgradeStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="archiveBaseDTO.fixFeeRate" label="费率"></el-table-column>
        <!-- <el-table-column prop="createTime" label="停用"></el-table-column> -->
        <el-table-column label="操作" align="right" width="240px">
          <template slot-scope="scope">
            <!-- 按钮状态 编辑、审核、详情、复制、启用、停用 -->
            <el-button type="text" size="small" v-if="scope.row.archiveBaseDTO.auditStatus === 2">审核</el-button>
            <el-button type="text" size="small" v-else-if="[0, 1, 4, 8].includes(scope.row.archiveBaseDTO.auditStatus)">编辑</el-button>
            <el-button type="text" size="small" v-else>详情</el-button>
            <!-- <el-button type="text" size="small">启用/停用</el-button> -->
            <el-button type="text" size="small">复制</el-button>
            <el-button type="text" size="small">进件详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="km-page-block">
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
      </div> -->
    </div>
  </section>
  <!-- <div> -->
  <!-- <div class="search-box"></div> -->
  <!-- <div class="data-box">
      <el-table :loading="tableLoading" :max-height="tableMaxHeight" :data="tableData" style="width: 100%">
        <el-table-column prop="createTime" label="商户简称"> </el-table-column>
        <el-table-column prop="createTime" label="公司名称"> </el-table-column>
        <el-table-column prop="createTime" label="银行卡号"> </el-table-column>
        <el-table-column prop="createTime" label="资料状态">
          <template slot-scope="scope">
            <span class="table-text-color" @click="statusClick(scope.row)">
              {{ scope.row.creatorName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="微信认证状态"> </el-table-column>
        <el-table-column prop="createTime" label="费率"> </el-table-column>
        <el-table-column prop="createTime" label="停用"> </el-table-column>
        <el-table-column label="操作" align="right" width="240px">
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
          :total="totalPage"
        >
        </el-pagination>
      </div>
    </div> -->
  <!-- <el-dialog title="商户微信实名认证指引流程" :visible.sync="certificationVisible" width="507px" class="certification-dialog">
      <div class="certification-dialog-text">1. 商户联系人：<span style="color: #FF6010">郭鼎(手机尾号9902)</span>微信扫描下方二维码，按照指引补充或修改联系人信息</div>
      <img :src="imgSrc" class="certification-dialog-img" alt="qrcode" />
      <div class="certification-dialog-text">2. 完成信息补充后，引导公司法人完成法人的实名认证（或对公账户验证）</div>
      <div class="certification-dialog-text">3. 完成1-2两步操作之后，即完成了微信关于系统风控，用户资金安全的监管要求，开户成功！</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" style="padding: 8px 22px" @click="certificationVisible = false">关闭</el-button>
      </span>
    </el-dialog> -->
  <!-- </div> -->
</template>

<script>
import { queryDocumentByPage } from '@/api/setting/material'
import { filterReview } from './filters/reviewStatus'

export default {
  data() {
    return {
      form: {
        createTime: '',
        status: '',
        msg: '',
        isDeactivate: ''
      },

      statusList: [],
      tableData: []
      // currentPage: 1,
      // totalPage: 0,
      // pageSize: 10,
      // certificationVisible: false,
      // cxLoading: false,
      // tableLoading: false,
      // imgSrc: require('@/assets/images/abnormal/404.png')
    }
  },
  filters: {
    filterReview
  },
  methods: {
    add() {
      this.$router.push({ name: 'xftArchiveAdd' })
    },
    edit(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { type: 'edit' } })
    },
    copy(row) {
      this.$router.push({ name: 'xftArchiveAdd', query: { type: 'copy' } })
    },
    search() {
      this.cxLoading = true
      this.currentPage = 1
      this.getList()
    },
    changeStatus(row) {},
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
    shopQRCode(row) {
      this.certificationVisible = true
    },
    toDetail(row) {
      this.$router.push({ name: 'xftArchiveDetail' })
    },
    async getList() {
      this.tableLoading = true
      let data = {
        endTime: this.form.time && this.form.time[1],
        name: this.form.name,
        orders: {},
        page: this.currentPage,
        rows: this.pageSize,
        startTime: this.form.time && this.form.time[0]
      }
      try {
        const res = await queryDocumentByPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (e) {
      } finally {
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
.p {
  &-general {
    &_row {
      display: flex;
      align-items: flex-end;
    }
    &_formWidth {
      width: 240px;
    }
    &_fr {
      float: right;
    }
    &_btnLabel {
      width: 100px;
      text-align: right;
      padding-right: 12px;
    }
  }
}
.test {
  background-color: red;
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
</style>
