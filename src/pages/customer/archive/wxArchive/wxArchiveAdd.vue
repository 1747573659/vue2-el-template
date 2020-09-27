<template>
  <section class="p-wxArchive-con">
    <header v-if="pageAction && pageAction !== 'add'">
      <el-row>
        <el-col :span="12" v-if="form.archiveBaseVO.auditStatus !== ''">
          <label>进件状态：</label>
          <span class="e-wxArchive-status_pd e-wxArchive-warning">{{ form.archiveBaseVO.auditStatus | filterReview }}</span>
        </el-col>
        <el-col :span="12" v-if="form.archiveBaseVO.auditRemark !== ''">
          <label>审核结果：</label>
          <span>{{ form.archiveBaseVO.auditRemark }}</span>
          <span class="e-wxArchive-warning">审核不通过</span>
        </el-col>
      </el-row>
    </header>
    <section>
      <el-form ref="form" :model="form" :rules="rules" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
        <div class="p-wxArchive-item">
          <div class="p-wxArchive-itemTitle">基本信息</div>
          <el-row class="p-wxArchive-baseInfo">
            <el-col :span="12">
              <el-form-item label="商户" prop="archiveBaseVO.merchantId">
                <select-page
                  v-if="pageAction === 'add' || JSON.parse($route.query.isCopy)"
                  :isMaxPage="isMaxPage"
                  :options="selectOptions"
                  @remoteMethod="remoteSelect"
                  @selectPageMore="selectPageMore('merchant')"
                  @resetSelectPage="resetSelectPage"
                  @changeSelectPage="changeSelectPage"
                  label="companyName"
                  value="id"
                  :echoValue="form.archiveBaseVO.merchantName"
                  placeholder="请输入商户"
                ></select-page>
                <span v-else>{{ form.archiveBaseVO.merchantName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="进件类型">
                <el-radio-group v-model="form.archiveBaseVO.archiveType">
                  <el-radio :label="1">微信直连</el-radio>
                  <el-radio :label="9">小微商户</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业场景">
                <el-checkbox-group v-model="businessSceneList">
                  <el-checkbox :label="1">公众号</el-checkbox>
                  <el-checkbox :label="2">小程序</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="businessSceneList.includes(1)">
              <el-form-item label="公众号APPID" prop="archiveBaseVO.publicId">
                <el-input v-model="form.archiveBaseVO.publicId" placeholder="请输入公众号APPID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="businessSceneList.includes(2)">
              <el-form-item label="小程序APPID" prop="archiveBaseVO.appletId">
                <el-input v-model="form.archiveBaseVO.appletId" placeholder="请输入小程序APPID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商户类型">
                <el-radio-group v-model="form.archiveBaseVO.merchantType">
                  <el-radio :label="1">个体工商户</el-radio>
                  <el-radio :label="2">企业</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="archiveBaseVO.companyName">
                <el-input v-model="form.archiveBaseVO.companyName" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
                <el-input v-model="form.archiveBaseVO.merchantShortName" placeholder="请输入商户简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区" prop="archiveBaseVO.area">
                <area-select :key="areaKey" @change="value => handleArea('area', value)" :areaList="areaList"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址" prop="archiveBaseVO.address">
                <el-input v-model="form.archiveBaseVO.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="archiveBaseVO.contact">
                <el-input v-model="form.archiveBaseVO.contact" placeholder="请输入联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="archiveBaseVO.contactPhone">
                <el-input v-model="form.archiveBaseVO.contactPhone" placeholder="请输入联系人电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮箱" prop="archiveBaseVO.email">
                <el-input v-model="form.archiveBaseVO.email" placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
                <upload-pic
                  alt="门店门头照"
                  :imagePath="form.archiveOtherVO.signboardUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'signboardUrl')"
                  :fileServer="fileServer"
                >
                </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照1" prop="archiveOtherVO.businessSiteOneUrl">
                <upload-pic
                  alt="经营场所照1"
                  :imagePath="form.archiveOtherVO.businessSiteOneUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteOneUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照2" prop="archiveOtherVO.businessSiteTwoUrl">
                <upload-pic
                  alt="经营场所照2"
                  :imagePath="form.archiveOtherVO.businessSiteTwoUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteTwoUrl')"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照3" prop="archiveOtherVO.businessSiteThreeUrl">
                <upload-pic
                  alt="经营场所照3"
                  :imagePath="form.archiveOtherVO.businessSiteThreeUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteThreeUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="经营场地证明">
                <upload-pic
                  alt="经营场地证明"
                  :imagePath="form.archiveOtherVO.businessSiteUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="补充资料1">
                <upload-pic
                  alt="补充资料1"
                  :imagePath="form.archiveOtherVO.additionalOneUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'additionalOneUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="补充资料2">
                <upload-pic
                  alt="补充资料2"
                  :imagePath="form.archiveOtherVO.additionalTwoUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'additionalTwoUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="p-wxArchive-item">
          <div class="p-wxArchive-itemTitle">营业执照</div>
          <el-row class="p-wxArchive-baseInfo">
            <el-col :span="24">
              <el-form-item label="证件类型" prop="archiveExpandVO.licType">
                <el-radio-group v-model="form.archiveExpandVO.licType">
                  <el-radio :label="1">多证合一</el-radio>
                  <el-radio :label="2">旧证</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照" prop="archiveExpandVO.businessLicenseUrl">
                <upload-pic
                  alt="营业执照"
                  :imagePath="form.archiveExpandVO.businessLicenseUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'businessLicenseUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类目特殊资质">
                <upload-pic
                  alt="类目特殊资质"
                  :imagePath="form.archiveOtherVO.typeAptitudeUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'typeAptitudeUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照注册号" prop="archiveExpandVO.licId">
                <el-input v-model="form.archiveExpandVO.licId" placeholder="营业执照注册号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照有效期" prop="archiveExpandVO.licValidityBigen">
                <el-date-picker v-model="form.archiveExpandVO.licValidityBigen" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <el-date-picker v-model="form.archiveExpandVO.licValidityEnd" type="date" clearable placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="经营范围" prop="archiveExpandVO.businessScope">
                <el-input v-model="form.archiveExpandVO.businessScope" style="width: 240px" type="textarea" :autosize="{ minRows: 3 }" placeholder="经营范围"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="经营类目" prop="archiveBaseVO.businessCategoryRemark">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.businessCategoryRemark" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="售卖商品描述" prop="archiveExpandVO.sellShopDescribe">
                <el-input v-model="form.archiveExpandVO.sellShopDescribe" style="width: 240px" type="textarea" :autosize="{ minRows: 3 }" placeholder="售卖商品描述"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="组织机构代码号" prop="archiveExpandVO.orgInstitutionCode">
                <el-input v-model="form.archiveExpandVO.orgInstitutionCode" placeholder="组织机构代码号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="组织机构代码有效期" prop="archiveExpandVO.orgInstitutionBigen">
                <el-date-picker v-model="form.archiveExpandVO.orgInstitutionBigen" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <el-date-picker v-model="form.archiveExpandVO.orgInstitutionEnd" type="date" clearable placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="组织机构代码证" prop="archiveExpandVO.orgInstitutionUrl">
                <upload-pic
                  alt="组织机构代码证"
                  :imagePath="form.archiveExpandVO.orgInstitutionUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'orgInstitutionUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="税务登记证" prop="archiveExpandVO.taxRegistrationUrl">
                <upload-pic
                  alt="税务登记证"
                  :imagePath="form.archiveExpandVO.taxRegistrationUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'taxRegistrationUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="p-wxArchive-item">
          <div class="p-wxArchive-itemTitle">法人信息</div>
          <el-row class="p-wxArchive-baseInfo">
            <el-col :span="12">
              <el-form-item label="法人姓名" prop="archiveExpandVO.legalPersonName">
                <el-input v-model="form.archiveExpandVO.legalPersonName" placeholder="法人姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件类型" prop="archiveExpandVO.idType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.idType" placeholder="全部">
                  <el-option label="身份证" :value="1"></el-option>
                  <el-option label="护照" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码" prop="archiveExpandVO.idNumber">
                <el-input style="width:240px" v-model="form.archiveExpandVO.idNumber" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件有效期" prop="archiveExpandVO.idBegin">
                <el-date-picker v-model="form.archiveExpandVO.idBegin" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <el-date-picker v-model="form.archiveExpandVO.idEnd" type="date" clearable placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证正面照" prop="archiveExpandVO.idFrontUrl">
                <upload-pic
                  alt="身份证正面照"
                  :imagePath="form.archiveExpandVO.idFrontUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'idFrontUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证背面照" prop="archiveExpandVO.idBackUrl">
                <upload-pic
                  alt="身份证背面照"
                  :imagePath="form.archiveExpandVO.idBackUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'idBackUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手持身份证正面照" prop="archiveExpandVO.hardIdUrl">
                <upload-pic
                  alt="手持身份证正面照"
                  :imagePath="form.archiveExpandVO.hardIdUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'hardIdUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="p-wxArchive-item">
          <div class="p-wxArchive-itemTitle">银行卡资料</div>
          <el-row class="p-wxArchive-baseInfo">
            <el-col :span="24" v-if="form.archiveBaseVO.merchantType === 2">
              <el-form-item label="开户许可证" prop="archiveExpandVO.openingPermitUrl">
                <upload-pic
                  alt="开户许可证"
                  :imagePath="form.archiveExpandVO.openingPermitUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'openingPermitUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.archiveBaseVO.merchantType === 1">
              <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
                <upload-pic
                  alt="银行卡正面照"
                  :imagePath="form.archiveExpandVO.bankCardFrontUrl"
                  :exampleImg="exampleImg"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'bankCardFrontUrl')"
                  @click="imgClick"
                  :fileServer="fileServer"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行" prop="archiveExpandVO.bank">
                <select-page
                  v-if="pageAction === 'add'"
                  :isMaxPage="isMaxPage"
                  :options="selectOptions"
                  @remoteMethod="remoteSelect"
                  @selectPageMore="selectPageMore('merchant')"
                  @resetSelectPage="resetSelectPage"
                  @changeSelectPage="changeSelectPage"
                  label="companyName"
                  value="id"
                  placeholder="请输入商户"
                ></select-page>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属支行" prop="archiveExpandVO.bankSub">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.bankSub" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="archiveExpandVO.bankCard">
                <el-input style="width:240px" v-model="form.archiveExpandVO.bankCard" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户名" prop="archiveExpandVO.bankAccountName">
                <el-input style="width:240px" v-model="form.archiveExpandVO.bankAccountName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行所在地区" prop="archiveExpandVO.bankArea">
                <area-select :key="bankAreaKey" @change="value => handleArea('bankArea', value)" :areaList="bankAreaList"></area-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="p-wxArchive-item" v-if="form.archiveBaseVO.archiveType === 9">
          <div class="p-wxArchive-itemTitle">费率</div>
          <el-row class="p-wxArchive-baseInfo">
            <el-col :span="12">
              <el-form-item label="费率" prop="archiveBaseVO.bankArea">
                <el-select v-model="form.archiveBaseVO.fixFeeRate" placeholder="请选择">
                  <el-option v-for="item in rateOptions" :key="item.value" :label="item.lable" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </section>
    <div class="p-wxArchive-action" v-if="detailStatusArr.includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'">
      <el-button
        size="small"
        type="primary"
        class="e-wxArchive-action_pd"
        @click="handleArchive"
        v-if="[0, 1, 4, 8].includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'"
        >保存</el-button
      >
      <el-button
        size="small"
        type="primary"
        plain
        class="e-wxArchive-action_pd"
        @click="handleVerify"
        v-if="detailStatusArr.includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'"
        >提交审核</el-button
      >
      <el-button size="small" class="e-wxArchive-action_pd" @click="isReason = true" v-if="[2].includes(form.archiveBaseVO.auditStatus)">拒绝</el-button>
      <el-button
        size="small"
        class="e-wxArchive-action_pd"
        @click="$router.push('wxArchive')"
        v-if="detailStatusArr.includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'"
        >取消</el-button
      >
    </div>
    <!-- dialog -->
    <el-dialog append-to-body :visible.sync="isReason" title="拒绝原因" width="507px" :close-on-press-escape="false">
      <el-form ref="refundForm" :model="refundForm" :rules="refundRules" label-width="60px">
        <el-form-item label="原因" prop="remark">
          <el-input type="textarea" v-model="refundForm.remark" placeholder="请输入审核不能过的原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isReason = false" size="small" class="e-wxArchive-action_pd">取消</el-button>
        <el-button @click="handleRefund" type="primary" size="small" class="e-wxArchive-action_pd">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import selectPage from '@/components/selectPage/selectPage'
import uploadPic from '../components/uploadPic'
import areaSelect from '@/components/areaSelect'
import { queryShopListByPage, queryBankPage, submit, detail, submitToVerify, refund } from '@/api/wxArchive'
import fileServer from '@/mixins/fileServe'
import { detailValidate, formObj, rateOptions, refundForm, refundRules } from './index'
import { filterReview } from './filters/reviewStatus'

export default {
  mixins: [fileServer],
  components: {
    selectPage,
    uploadPic,
    areaSelect
  },
  data() {
    return {
      rateOptions,
      refundForm,
      refundRules,
      pageAction: this.$route.query.action,
      selectOptions: [],
      searchString: '',
      isMaxPage: false,
      form: formObj,
      rules: detailValidate,
      businessSceneList: [],
      statusList: [],
      selectPageNo: 1,
      formDisabled: false,
      exampleImg: require('@/assets/images/home/home.png'),
      isReason: false,
      detailStatusArr: [0, 1, 2, 4, 8],
      areaKey: Symbol('areaKey'),
      bankAreaKey: Symbol('bankAreaKey'),
      areaList: [],
      bankAreaList: []
    }
  },
  filters: {
    filterReview
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.pageAction === 'detail') {
        vm.handleDetail()
      }
    })
  },
  methods: {
    handleRefund() {
      this.$refs.refundForm.validate(async valid => {
        if (valid) {
          const data = {
            archiveId: this.$route.query.id,
            auditRemark: this.refundForm.remark
          }
          const res = await refund(data)
          this.handleDetail()
          this.isReason = false
        }
      })
    },
    handleVerify: async function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const res = await submitToVerify(this.form)
          console.info(res)
        }
      })
    },
    handleDetail: async function() {
      const res = await detail({ archiveId: this.$route.query.id })
      this.form.archiveBaseVO = res.archiveBaseDTO
      this.form.archiveExpandVO = res.archiveExpandDTO
      this.form.archiveOtherVO = res.archiveOtherDTO
      this.areaList = [res.archiveBaseDTO.province, res.archiveBaseDTO.city, res.archiveBaseDTO.area]
      this.areaKey = Symbol('areaKey')
      this.bankAreaList = [res.archiveExpandDTO.bankProvince, res.archiveExpandDTO.bankCity, res.archiveExpandDTO.bankArea]
      this.bankAreaKey = Symbol('bankAreaKey')
      if (!this.detailStatusArr.includes(res.archiveBaseDTO.auditStatus)) {
        this.formDisabled = true
      }
      // 复制
      if (this.$route.query.isCopy) {
        this.form.archiveBaseVO.id = null
        this.form.archiveExpandVO.id = null
        this.form.archiveOtherVO.id = null
        this.form.archiveExpandVO.openingPermitUrl = null
        this.form.archiveExpandVO.bankCardFrontUrl = null
        this.form.archiveExpandVO.bank = null
        this.form.archiveExpandVO.bankSub = null
        this.form.archiveExpandVO.bankCard = null
        this.form.archiveExpandVO.bankAccountName = null
        this.form.archiveExpandVO.bankProvince = null
        this.form.archiveExpandVO.bankCity = null
        this.form.archiveExpandVO.bankArea = null
        this.bankAreaList = []
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    },
    handleArchive() {
      console.info(this.form)
      this.$refs.form.validateField('archiveBaseVO.merchantId', async errorMessage => {
        if (!errorMessage) {
          const res = await submit(this.form)
          console.info(res)
        }
      })
      // this.$refs.form.validate(async valid => {})
    },
    handleArea(type, value) {
      if (type === 'area') {
        this.form.archiveBaseVO.province = value[0]
        this.form.archiveBaseVO.city = value[1]
        this.form.archiveBaseVO.area = value[2]
      } else {
        this.form.archiveExpandVO.bankProvince = value[0]
        this.form.archiveExpandVO.bankCity = value[1]
        this.form.archiveExpandVO.bankArea = value[2]
      }
    },
    selectPageMore(type) {
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteSelect(this.searchString)
      }
    },
    resetSelectPage() {
      this.selectOptions = []
      this.selectPageNo = 1
      this.isMaxPage = false
      this.searchString = ''
    },
    changeSelectPage(value) {
      this.form.archiveBaseVO.userId = value
      this.form.archiveBaseVO.merchantId = value
    },
    remoteSelect: async function(query) {
      if (!!this.searchString && query !== this.searchString) {
        this.resetSelectPage()
      }
      const data = {
        page: this.selectPageNo,
        rows: 10,
        id: query
      }
      const res = await queryShopListByPage(data)
      if (res?.results && res.results.length !== 0) {
        this.searchString = query
        this.selectOptions = this.selectOptions.concat(res.results)
        if (res.results.length !== 10) this.isMaxPage = true
      }
    },
    imgClick() {
      if (this.formDisabled) alert('hahahah')
    },
    setUploadSrc(res, type, url) {
      this.form[type][url] = res.data.path
    },
    areaChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-wxArchive {
    &-con {
      margin: 16px 16px 72px;
      background-color: #fff;
      header {
        min-height: 72px;
        /deep/ .el-col {
          height: 72px;
          display: flex;
          align-items: center;
          padding-left: 10%;
          color: #3d4966;
          font-size: 14px;
        }
      }
    }
    &-itemTitle {
      height: 48px;
      line-height: 48px;
      padding-left: 16px;
      font-size: 16px;
      color: #1f2e4d;
      border-bottom: 1px solid #e6e9f0;
      font-weight: 500;
    }
    &-baseInfo {
      padding-top: 24px;
    }
    &-action {
      width: 100%;
      height: 56px;
      position: fixed;
      bottom: 0;
      background-color: #fff;
      line-height: 56px;
      text-align: center;
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
    }
  }
}
.e {
  &-wxArchive {
    &-warning {
      color: #ff6010;
      margin-left: 10px;
    }
    &-status {
      &_pd {
        padding: 5px 12px;
        background: #ffefe8;
      }
    }
    &-action {
      &_pd {
        padding: 8px 22px;
      }
    }
  }
}
</style>
