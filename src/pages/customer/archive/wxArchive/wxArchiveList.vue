<template>
  <section>
    <div class="search-box">
      <el-form ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="100px" @submit.native.prevent>
        <el-row class="p-general_row">
          <el-col :span="21">
            <el-form-item label="申请时间">
              <el-date-picker
                v-model="applicationTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="资料状态">
              <el-select v-model="form.status" class="p-general_formWidth" clearable placeholder="全部">
                <template v-for="item in statusOptions">
                  <el-option v-if="!item.hidden" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="商户信息">
              <el-input v-model="form.msg" class="p-general_formWidth" maxlength="50" clearable placeholder="请输入商户名称/简称/公司名称/银行卡号"></el-input>
            </el-form-item>
            <el-form-item label="停用">
              <el-select v-model="form.isDeactivate" class="p-general_formWidth" clearable placeholder="全部">
                <el-option v-for="item in deactivateOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="p-general_btnLabel">
                <el-button type="primary" class="e-general-btn" @click="handleSearch" :loading="isSearchLock">查询</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item class="p-general_fr">
              <el-button type="primary" class="e-general-add" size="small" plain icon="el-icon-plus" v-permission="'ACCOUNT_ROLE_ADD'">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-box" v-loading="isTabLock">
      <el-table :data="tableData" @sort-change="handleTabSort">
        <el-table-column prop="archiveBaseDTO.createTime" label="申请时间" sortable="custom" width="110" align="center"></el-table-column>
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
            <span :class="{ 'e-general_tabOrange': [4, 8].includes(scope.row.archiveBaseDTO.auditStatus) }" @click="handleReason(scope.row)">{{
              scope.row.archiveBaseDTO.auditStatus | filterReview
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小微进件状态" prop="xiaoWeiArchiveStatus">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.xiaoWeiArchiveStatus | filterArchiveStatus(xiaoWeiArchiveData) }}</span> -->
            <span>{{ scope.row.xiaoWeiArchiveStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="xiaoWeiUpgradeStatus" label="升级状态">
          <template slot-scope="scope">
            <!-- <span>{{ scope.row.xiaoWeiUpgradeStatus | filterArchiveStatus(xiaoWeiUpgradeData) }}</span> -->
            <span>{{ scope.row.xiaoWeiUpgradeStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="费率">
          <template slot-scope="scope">
            <span>{{ scope.row.archiveBaseDTO.fixFeeRate / 100 }}%</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="createTime" label="停用"></el-table-column> -->
        <el-table-column label="操作" align="right" width="240px">
          <template slot-scope="scope">
            <!-- 按钮状态 编辑、审核、详情、复制、启用、停用 -->
            <el-button type="text" size="small" v-if="scope.row.archiveBaseDTO.auditStatus === 2">审核</el-button>
            <el-button type="text" size="small" v-else-if="[0, 1, 4, 8].includes(scope.row.archiveBaseDTO.auditStatus)">编辑</el-button>
            <el-button type="text" size="small" v-else>详情</el-button>
            <!-- <el-button type="text" size="small">启用/停用</el-button> -->
            <el-button type="text" size="small">复制</el-button>
            <el-button type="text" size="small" v-if="scope.row.xiaoWeiArchiveStatus" @click="$router.push({ name: 'wxArchiveDetail' })">进件详情</el-button>
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
    <!-- dialog -->
    <el-dialog append-to-body :visible.sync="isReason" title="原因" width="507px">
      <p>{{ reasonMsg }}</p>
      <div slot="footer">
        <el-button @click="isReason = false" type="primary" size="small">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { filterReview, filterArchiveStatus } from './filters/reviewStatus'
import { statusOptions, deactivateOptions } from './index'
import { xiaoWeiArchiveStatus, xiaoWeiUpgradeStatus } from '@/api/wxArchive'

export default {
  data() {
    return {
      statusOptions,
      deactivateOptions,
      applicationTime: '',
      form: {
        status: '',
        msg: '',
        isDeactivate: 0
      },
      isSearchLock: false, // 锁状态
      isTabLock: false,
      isReason: false, // 异常状态原因
      reasonMsg: '',
      xiaoWeiArchiveData: [],
      xiaoWeiUpgradeData: [],
      tableData: [
        {
          archiveBaseDTO: {
            id: 37,
            userId: 1554,
            archiveMode: 1,
            archiveType: 1,
            agentId: 25,
            agentName: null,
            merchantId: 92,
            merchantName: null,
            merchantType: 2,
            merchantShortName: '测试',
            companyName: '测试公司1212',
            businessCategory: null,
            businessCategoryRemark: null,
            province: '110000',
            provinceName: null,
            city: '110100',
            cityName: null,
            area: '110101',
            areaName: null,
            address: '天安门附近',
            contact: '121212',
            contactPhone: '12121212120',
            email: '12121212@qq.com',
            publicId: null,
            appletId: null,
            superCode: 2,
            submitLevel: 2,
            fixFeeRate: 55,
            debitcardFeeRate: 0,
            creditcardFeeRate: 0,
            unionpaycodeFeeRate: 0,
            exchangeFeeRate: 0,
            auditUserId: 1,
            auditTime: '2020-04-10 14:10:29',
            auditRemark: '345345',
            auditStatus: 4,
            remark: null,
            createId: 1554,
            createTime: '2017-01-11 14:26:48',
            source: null,
            aliOrgTypeCode: null,
            wxCertStatus: 0,
            serviceTel: null,
            wxFlag: null,
            idNumber: null,
            directAgentId: null,
            wxIndustryId: '',
            wxIndustryIdName: null,
            alIndustryId: '',
            alIndustryIdName: null,
            mchDealType: null,
            appid: '',
            appsecret: '',
            partner: '',
            pid: '',
            isOpenXingPos: null,
            status: null,
            industrId: null,
            industrIdName: null,
            mchTypeId: null,
            mchTypeName: null,
            bossAuditTime: null,
            useChannelCode: null
          },
          archiveExpandDTO: {
            archiveId: 37,
            licType: 1,
            licId: '',
            licValidityBigen: '2017-01-12',
            licValidityEnd: '2017-01-24',
            orgInstitutionCode: null,
            orgInstitutionBigen: '2017-01-01',
            orgInstitutionEnd: '2017-01-01',
            businessLicenseUrl: '/uploadFiles/7097bd389504486590b374a1c1a9f558.jpg',
            orgInstitutionUrl: null,
            taxRegistrationUrl: null,
            businessScope: null,
            sellShopDescribe: null,
            legalPersonName: '121',
            idType: '身份证',
            idNumber: '121211212121219',
            idBegin: '2016-07-03',
            idEnd: '2016-07-03',
            idFrontUrl: '/uploadFiles/d66fc57b5a8043daa47fa338fd74ca2b.jpg',
            idBackUrl: '/uploadFiles/e1fc95d24f394cc28f4c52fb4878e2c2.jpg',
            hardIdUrl: '/uploadFiles/bc3a8315dc33432a8eca0201c1673865.jpg',
            bank: '13',
            bankName: null,
            bankSub: null,
            bankSubName: '车公庙支行',
            bankAccountName: '撒大声地',
            bankCard: '按时大大',
            bankCardFrontUrl: '/default/408d93bb17754aa6beae17c7d158b7ed.jpg',
            openingPermitUrl: '/default/408d93bb17754aa6beae17c7d158b7ed.jpg',
            bankProvince: '110000',
            bankProvinceName: null,
            bankCity: '110100',
            bankCityName: null,
            bankArea: '110101',
            bankAreaName: null,
            acctType: null,
            cardholderIdType: '身份证',
            cardholderIdNumber: '',
            bankCardBackUrl: '',
            legalPersonValidityBegin: null,
            legalPersonValidityEnd: null,
            certType: '',
            certTypeName: null,
            cashreceiveType: null,
            cardholderPhone: null,
            cardholderType: null,
            oldAndNewHolder: '',
            merchantInfoChange: ''
          },
          archiveOtherDTO: null,
          merchantName: '测试商户B',
          agentName: '代理测试A',
          hasArchive: null,
          xiaoWeiId: null,
          xiaoWeiArchiveStatus: 1,
          xiaoWeiUpgradeStatus: null,
          businessScene: null,
          businessSceneShow: null,
          isRegister: null,
          archiveChannelList: null,
          useBankChannelCode: null,
          useBankChannelCodeName: null
        }
      ],
      currentPage: 1,
      totalPage: 0,
      pageSize: 10
    }
  },
  filters: {
    filterReview,
    filterArchiveStatus
  },
  // computed: {
  //   tableMaxHeight() {
  //     return document.documentElement.clientHeight - 56 - 48 - 112.5 - 32 - 116
  //   }
  // },
  mounted() {},
  methods: {
    test() {
      console.info(123)
    },
    handleReason(row) {
      this.reasonMsg = row.archiveBaseDTO.auditRemark
      this.isReason = true
    },
    handleTabSort({ column, prop, order }) {
      console.info(order)
      // 点击排序时
      this.handleQueryPage()
    },
    handleSearch() {
      this.pageSize = 1
      this.isSearchLock = true
      this.handleQueryPage().finally(() => {
        this.isSearchLock = true
      })
    },
    handleCurrentChange(val) {
      // 切换当前页
      this.currentPage = val
      this.handleQueryPage()
    },
    handleSizeChange(val) {
      // 切换页面总条数
      this.currentPage = 1
      this.pageSize = val
      this.handleQueryPage()
    },
    handleQueryPage: async function() {
      const data = Object.assign({ startTime: this.applicationTime[0], endTime: this.applicationTime[1] }, this.form, { page: this.pageSize, rows: this.currentPage })
      // 查询调用接口
      try {
        this.isTabLock = true
      } catch (error) {
      } finally {
        this.isTabLock = false
      }
    },
    getXiaoWeiArchiveStatus: async function() {
      const res = await xiaoWeiArchiveStatus()
      this.xiaoWeiArchiveData = res
    },
    getXiaoWeiUpgradeStatus: async function() {
      const res = await xiaoWeiUpgradeStatus()
      this.xiaoWeiUpgradeData = res
    }
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
.e {
  &-general {
    &-btn {
      padding: 8px 13px;
    }
    &-add {
      padding: 8px 15.5px;
    }
    &_tabOrange {
      color: #ff6010;
      cursor: pointer;
    }
  }
}
</style>
