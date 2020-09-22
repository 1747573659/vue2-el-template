<template>
  <div>
    <div class="xft-add">
      <div class="header">
        <el-row>
          <el-col :span="12" class="title-text">
            <span class="archive-title">进件状态：</span>
            <span class="archive-status">编辑中</span>
          </el-col>
          <el-col :span="12" class="title-text">
            <span class="archive-title">审核结果：</span>
            <span>你的资料不全，</span>
            <span class="archive-result">审核不通过</span>
          </el-col>
        </el-row>
      </div>
      <el-form :disabled="formDisabled" ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="190px">
        <div class="title">基本信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="商户" prop="status">
                <select-page
                  @remoteMethod="remoteMethod"
                  @loadMore="loadMore"
                  id="id"
                  name="name"
                  :options="shopList"
                  :isMaxPage="isMaxPage"
                  @focus="shopFocus"
                  @change="shopChange"
                  @clear="shopClear"
                >
                </select-page>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="商户类型" prop="archiveBaseVO.merchantType">
                <el-radio-group v-model="form.archiveBaseVO.merchantType" @change="merchantTypeChange">
                  <el-radio :label="3">持证商户</el-radio>
                  <el-radio :label="4">非持证商户</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开通超级码" prop="archiveBaseVO.superCode">
                <el-radio-group v-model="form.archiveBaseVO.superCode">
                  <el-radio :label="3">是</el-radio>
                  <el-radio :label="6">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="公司名称" prop="archiveBaseVO.companyName">
                <el-input style="width:240px" v-model="form.archiveBaseVO.companyName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
                <el-input style="width:240px" v-model="form.archiveBaseVO.merchantShortName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="地区" prop="archiveBaseVO.address">
                <area-select @change="bankAreaChange"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="详细地址" prop="archiveBaseVO.address">
                <el-input style="width:240px" v-model="form.archiveBaseVO.address" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="客服电话" prop="archiveBaseVO.serviceTel">
                <el-input style="width:240px" v-model="form.archiveBaseVO.serviceTel" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="负责人" prop="archiveBaseVO.contact">
                <el-input style="width:240px" v-model="form.archiveBaseVO.contact" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="负责人证件号码" prop="archiveBaseVO.idNumber">
                <el-input style="width:240px" v-model="form.archiveBaseVO.idNumber" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="负责人电话" prop="archiveBaseVO.contactPhone">
                <el-input style="width:240px" v-model="form.archiveBaseVO.contactPhone" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="邮箱" prop="archiveBaseVO.email">
                <el-input style="width:240px" v-model="form.archiveBaseVO.email" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="经营类型" prop="archiveBaseVO.mchDealType">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.mchDealType" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="经营类目" prop="archiveBaseVO.industrId">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.industrId" placeholder="全部" @change="industrIdChange">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveBaseVO.merchantType === 3 && form.archiveBaseVO.industrIdName.includes('事业单位')">
              <el-form-item label="登记证书类型" prop="archiveBaseVO.certType">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.certType" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
                <upload-pic alt="门店门头照" :fileServer="fileServer" :exampleImg="exampleImg.signboardUrl" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="收银台照片" prop="archiveOtherVO.cashierDesk">
                <upload-pic alt="收银台照片" :fileServer="fileServer" :exampleImg="exampleImg.cashierDesk" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.merchantType === 3">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="企业信息公示网照片" prop="archiveOtherVO.enterpriseInfoScreenshot">
                <upload-pic alt="企业信息公示网照片" :fileServer="fileServer" :exampleImg="exampleImg.enterpriseInfoScreenshot" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.merchantType === 4">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="经营场所照" prop="archiveOtherVO.businessSiteOneUrl">
                <upload-pic alt="经营场所照" :fileServer="fileServer" :exampleImg="exampleImg.businessSiteOneUrl" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="租赁合同照一" prop="archiveOtherVO.contractOfTenancy1">
                <upload-pic alt="租赁合同照一" :fileServer="fileServer" :exampleImg="exampleImg.contractOfTenancy" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.merchantType === 4">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="租赁合同照二" prop="archiveOtherVO.contractOfTenancy2">
                <upload-pic alt="租赁合同照二" :fileServer="fileServer" :exampleImg="exampleImg.contractOfTenancy" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="租赁合同照三" prop="archiveOtherVO.contractOfTenancy3">
                <upload-pic alt="租赁合同照三" :fileServer="fileServer" :exampleImg="exampleImg.contractOfTenancy" @click="imgClick"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title" v-if="form.archiveBaseVO.merchantType === 3">营业执照</div>
        <div class="form-info" v-if="form.archiveBaseVO.merchantType === 3">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="营业执照" prop="archiveExpandVO.businessLicenseUrl">
                <upload-pic alt="营业执照" :fileServer="fileServer" :exampleImg="exampleImg.businessLicenseUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="营业执照注册号" prop="archiveExpandVO.licId">
                <el-input style="width:240px" v-model="form.archiveExpandVO.licId" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="营业执照有效期" prop="archiveExpandVO.licValidity">
                <el-date-picker v-model="form.archiveExpandVO.licValidity" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">法人信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="法人姓名" prop="archiveExpandVO.legalPersonName">
                <el-input style="width:240px" v-model="form.archiveExpandVO.legalPersonName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件类型" prop="archiveExpandVO.cardholderIdType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.cardholderIdType" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件号码" prop="archiveExpandVO.idNumber">
                <el-input style="width:240px" v-model="form.archiveExpandVO.idNumber" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件有效期" prop="archiveExpandVO.legalPersonValidity">
                <el-date-picker v-model="form.archiveExpandVO.legalPersonValidity" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="身份证正面照" prop="archiveExpandVO.idFrontUrl">
                <upload-pic alt="身份证正面照" :fileServer="fileServer" :exampleImg="exampleImg.idFrontUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="身份证背面照" prop="archiveExpandVO.idBackUrl">
                <upload-pic alt="身份证背面照" :fileServer="fileServer" :exampleImg="exampleImg.idBackUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">银行卡信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="账户类型" prop="archiveExpandVO.acctType">
                <el-select style="width: 240px" @change="acctTypeChange" :disabled="form.archiveBaseVO.merchantType === 4" clearable v-model="form.archiveExpandVO.acctType" placeholder="全部">
                  <el-option v-for="item in acctTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveExpandVO.acctType === 2">
              <el-form-item label="收款类型" prop="archiveExpandVO.cashreceiveType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.cashreceiveType" placeholder="全部">
                  <el-option v-for="item in cashreceiveTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveExpandVO.acctType === 1">
              <el-form-item label="持卡人类型" prop="archiveExpandVO.cardholderType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.cardholderType" placeholder="全部">
                  <el-option v-for="item in cardholderTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开户支行" prop="archiveExpandVO.bankSub">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.bankSub" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开户支行所在省市" prop="archiveBaseVO.address">
                <area-select @change="areaChange" :level="1"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="账户名" prop="archiveExpandVO.bankAccountName">
                <el-input clearable style="width:240px" v-model="form.archiveExpandVO.bankAccountName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行账号" prop="archiveExpandVO.bankCard">
                <el-input clearable style="width:240px" v-model="form.archiveExpandVO.bankCard" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="预留手机号" prop="archiveExpandVO.cardholderPhone">
                <el-input clearable style="width:240px" v-model="form.archiveExpandVO.cardholderPhone" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人证件类型" prop="archiveExpandVO.cardholderIdType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.cardholderIdType" placeholder="全部">
                  <el-option v-for="item in cardholderIdTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人证件号码" prop="archiveExpandVO.cardholderIdNumber">
                <el-input style="width:240px" v-model="form.archiveExpandVO.cardholderIdNumber" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
                <upload-pic alt="银行卡正面照" :fileServer="fileServer" :exampleImg="exampleImg.bankCardFrontUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行卡背面照" prop="archiveExpandVO.bankCardBackUrl">
                <upload-pic alt="银行卡背面照" :fileServer="fileServer" :exampleImg="exampleImg.bankCardBackUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开户许可证" prop="archiveExpandVO.openingPermitUrl">
                <upload-pic alt="开户许可证" :fileServer="fileServer" :exampleImg="exampleImg.openingPermitUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2 && form.archiveExpandVO.cashreceiveType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="收款企业法人身份证正面照" prop="archiveExpandVO.cashreceiveIdFrontUrl">
                <upload-pic alt="收款企业法人身份证正面照" :fileServer="fileServer" :exampleImg="exampleImg.cashreceiveIdFrontUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="收款企业法人身份证反面照" prop="archiveExpandVO.cashreceiveIdBackUrl">
                <upload-pic alt="收款企业法人身份证反面照" :fileServer="fileServer" :exampleImg="exampleImg.cashreceiveIdBackUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2 && form.archiveExpandVO.cashreceiveType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="第三方对公结算授权函" prop="archiveExpandVO.publicAuthorization">
                <upload-pic alt="第三方对公结算授权函" :fileServer="fileServer" :exampleImg="exampleImg.publicAuthorization" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人身份证正面照" prop="archiveOtherVO.cardholderIdFrontUrl">
                <upload-pic alt="持卡人身份证正面照" :fileServer="fileServer" :exampleImg="exampleImg.cardholderIdFrontUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人身份证反面照" prop="archiveOtherVO.cardholderIdBackUrl">
                <upload-pic alt="持卡人身份证反面照" :fileServer="fileServer" :exampleImg="exampleImg.cardholderIdBackUrl" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人手持身份证照片" prop="archiveOtherVO.cardholderPhoto">
                <upload-pic alt="持卡人手持身份证照片" :fileServer="fileServer" :exampleImg="exampleImg.cardholderPhoto" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="第三方对私结算授权函" prop="archiveExpandVO.privateAuthorization">
                <upload-pic alt="第三方对私结算授权函" :fileServer="fileServer" :exampleImg="exampleImg.privateAuthorization" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">其他</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开通星POS刷卡" prop="archiveBaseVO.isOpenXingPos">
                <el-switch style="display: block" :active-value="1" :inactive-value="2" @change="isOpenXingPosChange" v-model="form.archiveBaseVO.isOpenXingPos" active-color="#3377FF" inactive-color="#D3DBEB"> </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.isOpenXingPos === 1">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人身份证正面照" prop="archiveOtherVO.cardholderIdCardFront">
                <upload-pic alt="持卡人身份证正面照" :fileServer="fileServer" :exampleImg="exampleImg.cardholderIdCardFront" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">费率</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="费率" prop="archiveBaseVO.fixFeeRate">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.fixFeeRate" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item" v-if="isExchangeFeeRate">
              <el-form-item label="享钱汇银费率" prop="archiveBaseVO.exchangeFeeRate">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.exchangeFeeRate" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="备注" prop="archiveBaseVO.remark">
                <el-input style="width: 240px" type="textarea" :autosize="{ minRows: 3 }" placeholder="" v-model="form.archiveBaseVO.remark"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="bottom">
      <el-button size="small" type="primary" class="archive-bottom-btn">保存</el-button>
      <el-button size="small" type="primary" plain class="archive-bottom-btn">新增</el-button>
      <el-button size="small" class="archive-bottom-btn">拒绝</el-button>
      <el-button size="small" class="archive-bottom-btn">取消</el-button>
    </div>
  </div>
</template>

<script>
import selectPage from '@/components/selectPage'
import uploadPic from '../components/uploadPic'
import areaSelect from '@/components/areaSelect'
import fileServer from '@/mixins/fileServe'

export default {
  mixins: [fileServer],
  components: {
    selectPage,
    uploadPic,
    areaSelect
  },
  data() {
    return {
      form: {
        archiveBaseVO: {
          address: '',
          agentId: null,
          agentName: '',
          alIndustryId: '',
          alIndustryIdName: '',
          aliOrgTypeCode: '',
          appid: '',
          appletId: '',
          appsecret: '',
          archiveMode: null,
          archiveType: null,
          area: '',
          areaName: '',
          auditRemark: '',
          auditStatus: null,
          auditTime: '',
          auditUserId: null,
          bossAuditTime: '',
          businessCategory: '',
          businessCategoryRemark: '',
          city: '',
          cityName: '',
          companyName: '',
          contact: '',
          contactPhone: '',
          createId: null,
          createTime: '',
          creditcardFeeRate: null,
          debitcardFeeRate: null,
          directAgentId: null,
          email: '',
          exchangeFeeRate: null,
          fixFeeRate: null,
          id: null,
          idNumber: '',
          industrId: '',
          industrIdName: '',
          isOpenXingPos: 2,
          mchDealType: null,
          mchTypeId: null,
          mchTypeName: '',
          merchantId: null,
          merchantName: '',
          merchantShortName: '',
          merchantType: 3,
          partner: '',
          pid: '',
          province: '',
          provinceName: '',
          publicId: '',
          remark: '',
          serviceTel: '',
          source: null,
          status: null,
          submitLevel: null,
          superCode: null,
          unionpaycodeFeeRate: null,
          useChannelCode: '',
          userId: null,
          wxCertStatus: null,
          wxFlag: null,
          wxIndustryId: '',
          wxIndustryIdName: ''
        },
        archiveExpandVO: {
          acctType: 1,
          archiveId: null,
          bank: '',
          bankAccountName: '',
          bankArea: '',
          bankAreaName: '',
          bankCard: '',
          bankCardBackUrl: '',
          bankCardFrontUrl: '',
          bankCity: '',
          bankCityName: '',
          bankName: '',
          bankProvince: '',
          bankProvinceName: '',
          bankSub: '',
          bankSubName: '',
          businessLicenseUrl: '',
          businessScope: '',
          cardholderIdNumber: '',
          cardholderIdType: '',
          cardholderPhone: '',
          cardholderType: 1,
          cashreceiveType: 1,
          certType: '',
          certTypeName: '',
          hardIdUrl: '',
          idBackUrl: '',
          idBegin: '',
          idEnd: '',
          idFrontUrl: '',
          idNumber: '',
          idType: '',
          legalPersonName: '',
          legalPersonValidityBegin: '',
          legalPersonValidityEnd: '',
          licId: '',
          licType: null,
          licValidityBigen: '',
          licValidityEnd: '',
          openingPermitUrl: '',
          orgInstitutionBigen: '',
          orgInstitutionCode: '',
          orgInstitutionEnd: '',
          orgInstitutionUrl: '',
          sellShopDescribe: '',
          taxRegistrationUrl: ''
        },
        archiveOtherVO: {
          additionalFiveUrl: '',
          additionalFourUrl: '',
          additionalOneUrl: '',
          additionalRemark: '',
          additionalThreeUrl: '',
          additionalTwoUrl: '',
          archiveId: null,
          authorizationOfCompany: '',
          businessSiteOneUrl: '',
          businessSiteThreeUrl: '',
          businessSiteTwoUrl: '',
          businessSiteUrl: '',
          cardholderIdBackUrl: '',
          cardholderIdCardFront: '',
          cardholderIdFrontUrl: '',
          cardholderPhoto: '',
          cashierDesk: '',
          cashreceiveIdBackUrl: '',
          cashreceiveIdFrontUrl: '',
          contractOfTenancy1: '',
          contractOfTenancy2: '',
          contractOfTenancy3: '',
          enterpriseInfoScreenshot: '',
          privateAuthorization: '',
          publicAuthorization: '',
          signboardUrl: '',
          typeAptitudeUrl: ''
        }
      },
      acctTypeList: [
        {id: 1, name: '对私'},
        {id: 2, name: '对公'}
      ],
      cashreceiveTypeList: [
        {id: 1, name: '本企业收款'},
        {id: 2, name: '其他企业收款'}
      ],
      cardholderTypeList: [
        {id: 1, name: '个体商户 持卡人为法人'},
        {id: 2, name: '个体商户 持卡人为非法人'}
      ],
      cardholderIdTypeList: [
        {id: 1, name: '对私'},
        {id: 2, name: '对公'}
      ],
      industrIdList: [],
      statusList: [],
      shopList: [],
      selectPageNo: 1,
      formDisabled: false,
      isMaxPage: false,
      isExchangeFeeRate: false,
      searchString: '',
      exampleImg: {
        signboardUrl: require('@/assets/images/xftArchive/store_front.png'),
        enterpriseInfoScreenshot: require('@/assets/images/xftArchive/company_information.png'),
        businessLicenseUrl: require('@/assets/images/xftArchive/business_license.jpg'),
        idFrontUrl: require('@/assets/images/xftArchive/idcard_front.png'),
        idBackUrl: require('@/assets/images/xftArchive/idcard_back.png'),
        bankCardFrontUrl: require('@/assets/images/xftArchive/bank_card.png'),
        bankCardBackUrl: require('@/assets/images/xftArchive/bank_card_back.png'),
        cardholderIdCardFront: require('@/assets/images/xftArchive/idcard_front.png'),
        openingPermitUrl: require('@/assets/images/xftArchive/licence_for_opening_accounts.png'),
        cashreceiveIdFrontUrl: require('@/assets/images/xftArchive/idcard_front.png'),
        cashreceiveIdBackUrl: require('@/assets/images/xftArchive/idcard_back.png'),
        publicAuthorization: require('@/assets/images/xftArchive/authorization.jpg'),
        cardholderPhoto: require('@/assets/images/xftArchive/cardholder_photo.png'),
        cardholderIdFrontUrl: require('@/assets/images/xftArchive/idcard_front.png'),
        cardholderIdBackUrl: require('@/assets/images/xftArchive/idcard_back.png'),
        privateAuthorization: require('@/assets/images/xftArchive/authorization.jpg'),
        cashierDesk: require('@/assets/images/xftArchive/cashier_desk.jpg'),
        businessSiteOneUrl: require('@/assets/images/xftArchive/shop_cash.png'),
        contractOfTenancy: require('@/assets/images/xftArchive/contract_of_tenancy.png')
      }
    }
  },
  methods: {
    isOpenXingPosChange(value) {
      console.log(Number(value))
    },
    acctTypeChange(value) {
      console.log(value)
    },
    merchantTypeChange(value) {
      console.log(value)
      if (value === 4) {
        this.form.archiveExpandVO.acctType = 1
      }
    },
    industrIdChange(value) {
      if (value) {
        this.industrIdList.forEach(item => {
          item.id = value
          this.form.archiveBaseVO.industrIdName = item.name
        })
      }
    },
    remoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (!value || (this.searchString !== '' && value !== this.searchString)) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.shopList = []
      }
      // 只有value有值的时候才去请求接口
      if (value) {
        let data = {
          name: value,
          page: this.selectPageNo,
          rows: 10
        }
        import('@/api/setting/account').then(async module => {
          const res = await module.queryPage(data)
          // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
          if (res.results && res.results.length !== 0) {
            this.shopList = this.shopList.concat(res.results)
            this.searchString = value
            if (res.results?.length !== 10) {
              this.isMaxPage = true
            }
          }
        })
      }
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
    // 如果点击了清除按钮则将相关数据清空
    shopClear() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    // 每次focus都将相关数据清空
    shopFocus() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    shopChange(value) {
      this.form.archiveBaseVO.merchantName = value
    },
    imgClick() {
      if (this.formDisabled) alert('hahahah')
    },
    areaChange(value) {
      this.form.archiveBaseVO.province = value[0]
      this.form.archiveBaseVO.city = value[1]
      this.form.archiveBaseVO.area = value[2]
    },
    bankAreaChange(value) {
      this.form.archiveBaseVO.bankProvince = value[0]
      this.form.archiveBaseVO.bankCity = value[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.xft-add {
  background-color: #fff;
  margin: 16px 16px 72px;
  .header {
    height: 72px;
    div {
      height: 100%;
    }
    .title-text {
      padding-left: 17%;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3d4966;
      .archive-status {
        padding: 5px 12px;
        background: #ffefe8;
        border-radius: 3px;
        color: #ff6010;
        line-height: 14px;
      }
      .archive-result {
        color: #ff6010;
      }
    }
  }
  .title {
    height: 48px;
    padding-left: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1f2e4d;
    line-height: 48px;
    border-bottom: 1px solid #e6e9f0;
  }
  .form-info {
    padding-top: 24px;
    .archive-form-item {
      padding-left: 10%;
      .el-switch {
        line-height: 32px;
      }
    }
    /deep/.el-form-item {
      margin-bottom: 24px;
    }
  }
}
.bottom {
  width: 100%;
  background-color: #fff;
  height: 56px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
}
.archive-bottom-btn {
  padding: 8px 22px;
}
</style>
