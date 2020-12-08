<template>
  <div>
    <div class="data-box">
      <el-table
        v-loading="tableLoading"
        :max-height="tableMaxHeight"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="channelName"
          label="支付通道">
        </el-table-column>
        <el-table-column
          prop="mchId"
          label="通道商户号">
        </el-table-column>
        <el-table-column
          prop="shopName"
          label="公司名称">
        </el-table-column>
        <el-table-column
          prop="bankCardNo"
          label="银行卡号">
          <template slot-scope="scope">
            {{scope.row.bankCardNo || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="进件时间">
          <template slot-scope="scope">
            {{scope.row.createDate || '--'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="wxBindType"
          label="微信支付">
          <template slot-scope="scope">
            <span v-if="scope.row.wxBindType === 1">默认使用</span>
            <span v-else-if="scope.row.wxBindType === 2">正在使用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="aliBindType"
          label="支付宝支付">
          <template slot-scope="scope">
            <span v-if="scope.row.aliBindType === 1">默认使用</span>
            <span v-else-if="scope.row.aliBindType === 2">正在使用</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wxSubMchId"
          label="微信子商户号">
        </el-table-column>
        <el-table-column
          prop="wxAuthStatus"
          label="授权状态">
          <template slot-scope="scope">
            {{scope.row.wxAuthStatus === 1 ? '已授权' : '未授权'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="feeRate"
          label="授权费率">
          <template slot-scope="scope">
            {{scope.row.feeRate + '%'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="right"
          width="380px">
          <template slot-scope="scope">
            <el-button @click="querySubShop(scope.row)" v-if="['7', '30'].includes(scope.row.channelCode)" type="text" size="small">查询子商户号</el-button>
            <el-button v-permission="'XFT_DETAIL_AUTHOR'" @click="toAuthor(scope.row)" type="text" size="small" v-if="['7', '20', '22', '25', '27', '29', '30'].includes(scope.row.channelCode)">子商户号授权</el-button>
            <el-button @click="queryStatus(scope.row)" type="text" size="small" v-if="['7', '20', '22', '25', '27', '29', '30'].includes(scope.row.channelCode)">查询授权状态</el-button>
            <el-button @click="signUpOL(scope.row)" type="text" size="small" v-if="['27'].includes(scope.row.channelCode)">电子签约</el-button>
            <!-- <el-button @click="signUpOL(scope.row)" type="text" size="small">电子签约</el-button> -->
            <el-button @click="shopInfo(scope.row)" type="text" size="small" v-if="['27'].includes(scope.row.channelCode)">查询商户信息</el-button>
            <!-- <el-button @click="shopInfo(scope.row)" type="text" size="small">查询商户信息</el-button> -->
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
      <div class="author-dialog-text">1. 确认商户联系人：<span style="color: #FF6010">{{authorForm.contactName}}(手机尾号{{authorForm.contactPhone}})</span>已在微信客户端内为<span style="color: #FF6010">{{authorForm.shopName}}</span>完成了实名认证，且商户法人已完成认证，且进件资料为“审核通过”</div>
      <div class="author-dialog-text">2. 商户联系人：扫描下方小程序二维码，按照流程指引为特约商户号完成授权</div>
      <img :src="imgSrc" class="author-dialog-img" alt="qrcode">
    </el-dialog>
    <el-dialog
      title="电子签约"
      :visible.sync="signUpVisible"
      width="507px"
      class="author-dialog">
      <div class="author-dialog-text">请商户<span style="color: #FF6010">{{signUpForm.shopName}}</span>负责人<span style="color: #FF6010">{{signUpForm.contact}}</span>,使用手机号码<span style="color: #FF6010">{{signUpForm.contactPhone}}</span>扫描下方二维码，完成交行签约</div>
      <img :src="codeSrc" class="author-dialog-img signup-img" alt="qrcode">
    </el-dialog>
    <el-dialog
      title="查询商户信息"
      :visible.sync="shopInfoVisible"
      width="507px"
      class="shop-info-dialog">
      <div class="shop-info-item">
        <div class="shop-info-item-label">商户状态：</div>
        <div class="shop-info-item-content">{{shopInfoForm.status}}</div>
      </div>
      <div class="shop-info-item">
        <div class="shop-info-item-label">微信子商户号：</div>
        <div class="shop-info-item-content">{{shopInfoForm.wechatMchtId}}</div>
      </div>
      <div class="shop-info-item">
        <div class="shop-info-item-label">支付宝子商户号：</div>
        <div class="shop-info-item-content">{{shopInfoForm.alipayMchtId}}</div>
      </div>
      <div class="shop-info-item">
        <div class="shop-info-item-label">银联子商户号：</div>
        <div class="shop-info-item-content">{{shopInfoForm.mchId}}</div>
      </div>
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
              <span v-for="(item, index) in subShopForm.wxSubMchIds" :key="index">{{item + (index === subShopForm.wxSubMchIds.length - 1 ? '' : ',')}}</span>
            </el-col>
            <el-col :span="6" v-if="subShopForm.wxSubMchIds">
              <el-button style="float:right" @click="copy(subShopForm.wxSubMchIds)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="支付宝子商户号">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              <span v-for="(item, index) in subShopForm.aliSmids" :key="index">{{item + (index === subShopForm.aliSmids.length - 1 ? '' : ',')}}</span>
            </el-col>
            <el-col :span="6" v-if="subShopForm.aliSmids">
              <el-button style="float:right" @click="copy(subShopForm.aliSmids)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="银总联商户号" v-if="subShopForm.channelCode !== '30'">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              <span v-for="(item, index) in subShopForm.unionPayMchIds" :key="index">{{item + (index === subShopForm.unionPayMchIds.length - 1 ? '' : ',')}}</span>
            </el-col>
            <el-col :span="6" v-if="subShopForm.unionPayMchIds">
              <el-button style="float:right" @click="copy(subShopForm.unionPayMchIds)" type="text" size="small">复制</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="银联子商户号">
          <el-row class="shop-dialog-row">
            <el-col :span="18">
              <span v-for="(item, index) in subShopForm.corMchNos" :key="index">{{item + (index === subShopForm.corMchNos.length - 1 ? '' : ',')}}</span>
            </el-col>
            <el-col :span="6" v-if="subShopForm.corMchNos">
              <el-button style="float:right" @click="copy(subShopForm.corMchNos)" type="text" size="small">复制</el-button>
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
import { 
  queryXftPage,
  queryContactInfo,
  queryAuthorizationStatus,
  querySubMerchantNo,
  querySubMchIdForSxf,
  mchICBSign,
  queryCommunicationMerchantInfo
} from '@/api/xftArchive'
export default {
  data() {
    return {
      signUpVisible: false,
      shopInfoVisible: false,
      codeSrc: '',
      shopInfoForm: {
        status: 0,
        wechatMchtId: '',
        alipayMchtId: '',
        mchId: ''
      },
      authorForm: {},
      signUpForm: {
        shopName: '张店区于汗成便利店',
        contact: '刘燕',
        contactPhone: '1654516515'
      },
      subShopForm: {
        wxSubMchIds: '',
        aliSmids: '',
        unionPayMchIds: '',
        corMchNos: ''
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
    copy (list) {
      let value = ''
      list.forEach((item,index) => {
        if (index === list.length - 1) {
          value += item
        } else {
          value += (item + ',')
        }
      })
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
    async toAuthor(row) {
      let data = {
        archiveId: row.baseinfoId
      }
      try {
        const res = await queryContactInfo(data)
        this.authorForm = {
          contactName: res.contactName,
          contactPhone: res.contactPhone.substring(7),
          shopName: row.shopName
        }
        switch(row.channelCode) {
          case '7':
            this.imgSrc = require('@/assets/images/xftArchive/channel/7.png')
            break
          case '20':
            this.imgSrc = require('@/assets/images/xftArchive/channel/20.png')
            break
          case '22':
            this.imgSrc = require('@/assets/images/xftArchive/channel/22.png')
            break
          case '25':
            this.imgSrc = require('@/assets/images/xftArchive/channel/25.png')
            break
          case '27':
            this.imgSrc = require('@/assets/images/xftArchive/channel/27.png')
            break
          case '29':
            this.imgSrc = require('@/assets/images/xftArchive/channel/29.png')
            break
          case '30':
            this.imgSrc = require('@/assets/images/xftArchive/channel/30.png')
            break
        }
      this.authorVisible = true
      } catch(error) {}
    },
    async queryStatus(row) {
      let data = {
        bankChannelCode: row.channelCode,
        baseInfoId: row.baseinfoId,
        masterId: row.mchMasterId,
        mchId: row.mchId
      }
      try {
        const res = await queryAuthorizationStatus(data)
        this.$alert(res, '', {
          confirmButtonText: '确定',
          callback: action => {
            this.getList()
          }
        })
      } catch(error){}
    },
    async querySubShop(row) {
      let data = {
        masterId: row.mchMasterId,
        mchId: row.mchId
      }
      try {
        const res = row.channelCode === '7' ? await querySubMerchantNo(data) : await querySubMchIdForSxf(data)
        this.subShopForm = res
        this.subShopForm.channelCode = row.channelCode
        this.subShopInfoVisible = true
      } catch(error) {}
    },
    handleSizeChange(value) {
      this.pageSize = value
      this.currentPage = 1
      this.getList()
    },
    async signUpOL(row) {
      this.signUpForm = {
        shopName: row.shopName,
        contactPhone: this.$route.query.contactPhone,
        contact: this.$route.query.contact
      }
      let data = {
        baseInfoId: row.baseinfoId,
        channelCode: '27'
      }
      try {
        let res = await mchICBSign(data)
        this.codeSrc =
          'data:image/png;base64,' +
          btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      } catch (error) {
      } finally {
        this.signUpVisible = true
      }
    },
    async shopInfo(row) {
      let data = {
        baseInfoId: row.baseinfoId,
        channelCode: '27'
      }
      try {
        let res = await queryCommunicationMerchantInfo(data)
        const statusArr = ['正常', '注销', '停用', '限制入账', '未激活 (表示入驻成功但商户还未电子签约)', '入驻中']
        this.shopInfoForm = {
          status: statusArr[res.status] || '--',
          wechatMchtId: res.wechatMchtId || '--',
          alipayMchtId: res.alipayMchtId || '--',
          mchId: res.mchId || '--'
        }
      } catch (error) {} finally {
        this.shopInfoVisible = true
      }
    },
    handleCurrentChange(value) {
      this.currentPage = value
      this.getList()
    },
    async getList() {
      this.tableLoading = true
      let data = {
        "archiveId": this.$route.query.id,
        "page": this.currentPage,
        "rows": this.pageSize,
      }
      try {
        const res = await queryXftPage(data)
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
      transform: translate(-50%,-20%);
      width: 152px;
      height: 152px;
    }
    .signup-img {
      width: 200px;
      height: 200px
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
.shop-info-dialog {
  .shop-info-item {
    padding-bottom: 15px;
    display: flex;
    align-items: center;
    // .shop-info-item-label {}
    // .shop-info-item-content {}
  }
}
</style>
