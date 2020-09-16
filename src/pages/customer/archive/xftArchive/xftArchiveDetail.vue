<template>
  <div>
    <div class="data-box">
      <el-table
        :loading="tableLoading"
        :max-height="tableMaxHeight"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="name"
          fixed
          width="114px"
          label="支付通道">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="微信支付">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="支付宝支付">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="微信子商户号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="授权状态">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="授权费率">
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          width="400px">
          <template slot-scope="scope">
            <el-button @click="toAuthor(scope.row)" type="text" size="small">子商户号授权</el-button>
            <el-button @click="queryStatus(scope.row)" type="text" size="small">查询授权状态</el-button>
            <el-button @click="querySubShop(scope.row)" type="text" size="small">查询子商户号</el-button>
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
      title="微信子商户号授权流程"
      :visible.sync="authorVisible"
      width="507px"
      class="author-dialog">
      <div class="author-dialog-text">1. 确认商户联系人：已在微信客户端内为  完成了实名认证，且商户法人已完成认证，且进件资料为“审核通过”</div>
      <div class="author-dialog-text">2. 商户联系人：扫描下方小程序二维码，按照流程指引为特约商户号完成授权</div>
      <img :src="imgSrc" class="author-dialog-img" alt="qrcode">
    </el-dialog>
    <el-dialog
      title="子商户信息"
      :visible.sync="subShopInfoVisible"
      class="shop-dialog"
      width="507px">
      <el-form ref="form" size="small" label-suffix=":" style="width: 300px" label-width="120px" :model="subShopForm">
        <el-form-item label="微信子商户号">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              {{subShopForm.name}}
            </el-col>
            <el-col :span="6">
              <el-button style="float:right" @click="copy(subShopForm.name)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="支付宝子商户号">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              {{subShopForm.url}}
            </el-col>
            <el-col :span="6">
              <el-button style="float:right" @click="copy(subShopForm.url)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="银总联商户号">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              {{subShopForm.creatorName}}
            </el-col>
            <el-col :span="6">
              <el-button style="float:right" @click="copy(subShopForm.creatorName)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="银联子商户号">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              {{subShopForm.completeUrl}}
            </el-col>
            <el-col :span="6">
              <el-button style="float:right" @click="copy(subShopForm.completeUrl)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="subShopInfoVisible = false">取 消</el-button>
        <el-button type="primary" @click="subShopInfoVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryDocumentByPage } from '@/api/setting/material'
export default {
  data() {
    return {
      subShopForm: {
      },
      tableData: [],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10,
      tableLoading: false,
      authorVisible: false,
      subShopInfoVisible: false,
      imgSrc: require('@/assets/images/abnormal/404.png')
    }
  },
  methods: {
    copy (value) {
      let transfer = document.createElement('input')
      document.body.appendChild(transfer)
      transfer.value = value // 这里表示想要复制的内容
      transfer.focus()
      transfer.select()
      if (document.execCommand('copy')) {
          document.execCommand('copy')
      }
      transfer.blur()
      this.$message.success('复制成功')
      document.body.removeChild(transfer)
    },
    toAuthor(row) {
      this.authorVisible = true
    },
    queryStatus(row) {},
    querySubShop(row) {
      this.subShopForm = row
      this.subShopInfoVisible = true
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
    async getList() {
      this.tableLoading = true
      let data = {
        "orders": {},
        "page": this.currentPage,
        "rows": this.pageSize,
      }
      try {
        const res = await queryDocumentByPage(data)
        this.tableData = res.results
        this.totalPage = res.totalCount
      } catch (e) {} finally {
        this.tableLoading = false
      }
    }
  },
  computed: {
    tableMaxHeight() {
      return document.documentElement.clientHeight - 56 - 48 - 32 - 116
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss" scoped>
.author-dialog {
  /deep/.el-dialog__body {
    height: 380px;
    .author-dialog-text {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 22px;
      color: #3D4966;
    }
    .author-dialog-text:first-child {
      margin-bottom: 12px;
    }
    .author-dialog-img {
      top: 50%;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      width: 152px;
      height: 152px;
    }
  }
}
.shop-dialog {
  /deep/.el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
.shop-dialog-row {
  display: flex;
  align-items: center;
  line-height: 32px;
}
</style>
