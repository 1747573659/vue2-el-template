<template>
  <div v-permission.page="'XFT_LIST_ADD,XFT_LIST_EDIT'">
    <div class="xft-add" v-loading="addLoading">
      <header v-if="!isCopy && auditStatus">
        <el-row>
          <el-col :span="12" v-if="auditStatus">
            <label class="el-form-item__label" style="width: 210px">进件状态:</label>
            <span class="e-wxArchive-status_pd e-wxArchive-warning">{{ auditStatusList[auditStatus] }}</span>
          </el-col>
          <el-col :span="12" v-if="[1, 4, 8].includes(auditStatus)">
            <label class="el-form-item__label" style="width: 210px">审核结果:</label>
            <el-tooltip effect="dark" placement="top">
              <span class="e-wxArchive-review">{{ form.archiveBaseVO.auditRemark }}</span>
              <template #content>
                <div style="max-width: 500px">{{ form.archiveBaseVO.auditRemark }}</div>
              </template>
            </el-tooltip>
          </el-col>
        </el-row>
      </header>
      <el-form :disabled="isDetail" ref="form" :rules="rules" class="xft-add-form" size="small" label-suffix=":" :inline="true" :model="form" label-width="210px">
        <div class="title">基本信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户" prop="archiveBaseVO.merchantId">
                <km-select-page
                  ref="merchant"
                  v-model="form.archiveBaseVO.merchantId"
                  :disabled="formYQDisabled || [1, 4, 8].includes(this.auditStatus)"
                  option-label="companyName"
                  option-value="id"
                  :data.sync="shopVO"
                  :request="getShopPage"
                  :is-max-page.sync="isShopVOMaxPage"
                  @change="handleShopChange"
                  placeholder="商户"
                  style="width: 240px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户类型" prop="archiveBaseVO.merchantType">
                <el-radio-group v-model="form.archiveBaseVO.merchantType" :disabled="formYQDisabled" @change="merchantTypeChange">
                  <el-radio :label="3">持证商户</el-radio>
                  <el-radio :label="4">非持证商户</el-radio>
                </el-radio-group>
                <el-tooltip effect="dark" placement="top">
                  <div slot="content">若商户无营业执照，可按非持证商户进件。<br />非持证商户日限额2W，月限额5W。<br />持证商户日限额50W，月限额500W。</div>
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <div v-if="form.archiveBaseVO.merchantType === 3">
            <el-row>
              <el-col :span="12">
                <el-form-item label="营业执照" prop="archiveExpandVO.businessLicenseUrl">
                  <upload-panel
                    alt="营业执照"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :example-img="exampleImg.businessLicenseUrl"
                    :image-url="form.archiveExpandVO.businessLicenseUrl"
                    :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.businessLicenseUrl', 'business_license')"
                    @click="handleImgPreview(fileServe + form.archiveExpandVO.businessLicenseUrl)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="营业执照注册号" prop="archiveExpandVO.licId">
                  <el-input v-model="form.archiveExpandVO.licId" placeholder="营业执照注册号" style="width: 240px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="营业执照有效期" prop="archiveExpandVO.licValidityBigen">
                  <el-date-picker v-model="form.archiveExpandVO.licValidityBigen" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 140px"></el-date-picker>
                  <span style="margin: 5px">至</span>
                  <span v-if="[3, 5, 6, 7, 9].includes(auditStatus) && !form.archiveExpandVO.licValidityEnd">长期有效</span>
                  <el-date-picker v-else v-model="form.archiveExpandVO.licValidityEnd" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 140px"></el-date-picker>
                  <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="archiveBaseVO.companyName">
                <el-input :disabled="formYQDisabled" v-model="form.archiveBaseVO.companyName" placeholder="公司名称" style="width: 240px"></el-input>
                <el-tooltip effect="dark" content="公司名称必须与营业执照/登记证书一致" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
                <el-input v-model="form.archiveBaseVO.merchantShortName" placeholder="商户简称" style="width: 240px"></el-input>
                <el-tooltip effect="dark" content="用于支付完成页面向消费者展示" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区" prop="archiveBaseVO.province">
                <area-select :key="areaKey" @change="value => handleArea('area', value)" :areaList="areaList" placeholder="省/市/区" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址" prop="archiveBaseVO.address">
                <el-input v-model="form.archiveBaseVO.address" placeholder="详细地址" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营类型" prop="archiveBaseVO.mchDealType">
                <el-select :disabled="formYQDisabled" v-model="form.archiveBaseVO.mchDealType" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in mchDealTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营类目" prop="archiveBaseVO.industrId">
                <el-select v-model="form.archiveBaseVO.industrId" @change="handleIndustrId" filterable clearable placeholder="全部" style="width: 240px">
                  <el-option v-for="item in industrIdList" :key="item.tradeCode" :label="item.tradeName" :value="item.tradeCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="form.archiveBaseVO.merchantType === 3 && form.archiveBaseVO.industrIdName && form.archiveBaseVO.industrIdName.includes('事业单位') ? 12 : 24">
              <el-form-item label="客服电话" prop="archiveBaseVO.serviceTel">
                <el-input :disabled="formYQDisabled" v-model="form.archiveBaseVO.serviceTel" placeholder="客服电话" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <template v-if="form.archiveBaseVO.merchantType === 3 && form.archiveBaseVO.industrIdName && form.archiveBaseVO.industrIdName.includes('事业单位')">
              <el-col :span="12">
                <el-form-item label="登记证书类型" prop="archiveExpandVO.certType">
                  <el-select clearable v-model="form.archiveExpandVO.certType" placeholder="全部" style="width: 240px">
                    <el-option v-for="item in certTypeList" :key="item.certNum" :label="item.certName" :value="item.certNum"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="12">
              <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
                <upload-panel
                  alt="门店门头照"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.signboardUrl"
                  :image-url="form.archiveOtherVO.signboardUrl"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.signboardUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.signboardUrl)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收银台照片" prop="archiveOtherVO.cashierDesk">
                <upload-panel
                  alt="收银台照片"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cashierDesk"
                  :image-url="form.archiveOtherVO.cashierDesk"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.cashierDesk')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cashierDesk)" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.merchantType === 3">
              <el-form-item label="企业信息公示网照片" prop="archiveOtherVO.enterpriseInfoScreenshot">
                <upload-panel
                  alt="企业信息公示网照片"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.enterpriseInfoScreenshot"
                  :image-url="form.archiveOtherVO.enterpriseInfoScreenshot"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.enterpriseInfoScreenshot')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.enterpriseInfoScreenshot)" />
              </el-form-item>
            </el-col>
            <template v-if="form.archiveBaseVO.merchantType === 4">
              <el-col :span="12">
                <el-form-item label="经营场所照" :disabled="formYQDisabled" prop="archiveOtherVO.businessSiteOneUrl">
                  <upload-panel
                    alt="经营场所照"
                    :disabled="formYQDisabled"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.businessSiteOneUrl"
                    :image-url="form.archiveOtherVO.businessSiteOneUrl"
                    :on-success="res => handleUpload(res, 'archiveOtherVO.businessSiteOneUrl')"
                    @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteOneUrl)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租赁合同照一">
                  <upload-panel
                    alt="租赁合同照一"
                    :disabled="formYQDisabled"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.contractOfTenancy"
                    :image-url="form.archiveOtherVO.contractOfTenancy1"
                    :on-success="res => handleUpload(res, 'archiveOtherVO.contractOfTenancy1')"
                    @click="handleImgPreview(fileServe + form.archiveOtherVO.contractOfTenancy1)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租赁合同照二">
                  <upload-panel
                    alt="租赁合同照二"
                    :disabled="formYQDisabled"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.contractOfTenancy"
                    :image-url="form.archiveOtherVO.contractOfTenancy2"
                    :on-success="res => handleUpload(res, 'archiveOtherVO.contractOfTenancy2')"
                    @click="handleImgPreview(fileServe + form.archiveOtherVO.contractOfTenancy2)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="租赁合同照三">
                  <upload-panel
                    alt="租赁合同照三"
                    :disabled="formYQDisabled"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.contractOfTenancy"
                    :image-url="form.archiveOtherVO.contractOfTenancy3"
                    :on-success="res => handleUpload(res, 'archiveOtherVO.contractOfTenancy3')"
                    @click="handleImgPreview(fileServe + form.archiveOtherVO.contractOfTenancy3)" />
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </div>
        <div class="title">法人信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人证件照头像面" prop="archiveExpandVO.idFrontUrl">
                <upload-panel
                  alt="法人证件照头像面"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.idFrontUrl"
                  :image-url="form.archiveExpandVO.idFrontUrl"
                  :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.idFrontUrl', 'idcard')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.idFrontUrl)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人证件照国徽面" prop="archiveExpandVO.idBackUrl">
                <upload-panel
                  alt="法人证件照国徽面"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.idBackUrl"
                  :image-url="form.archiveExpandVO.idBackUrl"
                  :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.idBackUrl', 'idcard')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.idBackUrl)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人姓名" prop="archiveExpandVO.legalPersonName">
                <el-input v-model="form.archiveExpandVO.legalPersonName" placeholder="法人姓名" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件类型">
                <el-select disabled clearable v-model="form.archiveExpandVO.cardType" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码" prop="archiveExpandVO.idNumber">
                <el-input v-model="form.archiveExpandVO.idNumber" placeholder="证件号码" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件有效期" prop="archiveExpandVO.legalPersonValidityBegin">
                <el-date-picker value-format="yyyy-MM-dd" v-model="form.archiveExpandVO.legalPersonValidityBegin" placeholder="选择日期" style="width: 140px"></el-date-picker>
                <span style="margin: 5px">至</span>
                <span v-if="[3, 5, 6, 7, 9].includes(auditStatus) && !form.archiveExpandVO.legalPersonValidityEnd"> 长期有效 </span>
                <el-date-picker v-else value-format="yyyy-MM-dd" v-model="form.archiveExpandVO.legalPersonValidityEnd" placeholder="选择日期" style="width: 140px">
                </el-date-picker>
                <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <template v-if="checkLegalPersonStatus">
              <el-col :span="12">
                <el-form-item label="证件居住地址" prop="archiveExpandVO.legalPersonArea">
                  <area-select :key="legalPersonAddressKey" @change="value => handleArea('legalPersonArea', value)" :areaList="legalPersonAddressList" placeholder="省/市/区" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件详细地址" prop="archiveExpandVO.credentialsAddress">
                  <el-input v-model="form.archiveExpandVO.credentialsAddress" placeholder="证件详细地址" style="width: 240px"></el-input>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </div>
        <div class="title">联系人信息</div>
        <div class="form-info">
          <el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="联系人是否同法人">
                  <el-select v-model="form.archiveExpandVO.contactSameLegal" filterable placeholder="联系人是否同法人" style="width: 240px">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="否" :value="0"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="!form.archiveExpandVO.contactSameLegal">
              <el-col :span="12">
                <el-form-item label="联系人证件照头像面" prop="archiveExpandVO.contractHeadUrl">
                  <upload-panel
                    alt="联系人证件照头像面"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.idFrontUrl"
                    :image-url="form.archiveExpandVO.contractHeadUrl"
                    :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.contractHeadUrl', 'idcard')"
                    @click="handleImgPreview(fileServe + form.archiveExpandVO.contractHeadUrl)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人证件照国徽面" prop="archiveExpandVO.contractNationalUrl">
                  <upload-panel
                    alt="联系人证件照国徽面"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.idBackUrl"
                    :image-url="form.archiveExpandVO.contractNationalUrl"
                    :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.contractNationalUrl', 'idcard')"
                    @click="handleImgPreview(fileServe + form.archiveExpandVO.contractNationalUrl)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人姓名" prop="archiveBaseVO.contact">
                  <el-input v-model="form.archiveBaseVO.contact" placeholder="联系人姓名" style="width: 240px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件类型">
                  <el-select disabled v-model="form.archiveExpandVO.contactCredentialsTypeXft" placeholder="全部" style="width: 240px">
                    <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件号码" prop="archiveBaseVO.idNumber">
                  <el-input v-model="form.archiveBaseVO.idNumber" placeholder="证件号码" style="width: 240px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证件有效期" prop="archiveExpandVO.credentialsValidDateBegin">
                  <el-date-picker v-model="form.archiveExpandVO.credentialsValidDateBegin" placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
                  <span style="margin: 0 10px">至</span>
                  <span v-if="!form.archiveExpandVO.credentialsValidDateEnd && formDisabled && pageStatus === 'detail'">长期有效</span>
                  <el-date-picker
                    v-else
                    v-model="form.archiveExpandVO.credentialsValidDateEnd"
                    placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    style="width: 140px"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系人电话" prop="archiveBaseVO.contactPhone">
                  <el-input v-model="form.archiveBaseVO.contactPhone" clearable placeholder="联系人电话" style="width: 240px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="archiveBaseVO.email">
                  <el-input v-model="form.archiveBaseVO.email" clearable placeholder="邮箱" style="width: 240px"></el-input>
                </el-form-item>
              </el-col>
              <template v-if="!form.archiveExpandVO.contactSameLegal">
                <el-col :span="12">
                  <el-form-item label="业务办理授权函" prop="archiveExpandVO.businessAuthLetterUrl">
                    <upload-panel
                      alt="业务办理授权函"
                      action="/uploadPic"
                      :fileServer="fileServer"
                      :exampleImg="exampleImg.idFrontUrl"
                      :image-url="form.archiveExpandVO.businessAuthLetterUrl"
                      :on-success="res => handleUpload(res, 'archiveExpandVO.businessAuthLetterUrl')"
                      @click="handleImgPreview(fileServe + form.archiveExpandVO.businessAuthLetterUrl)">
                      <div style="width: 350px">
                        <header>下载、填写商户信息后打印授权函，加盖</header>
                        <section>① 商户号主体红章</section>
                        <section>② 法定代表人/负责人章或签字（①、②二选一）后扫描或拍照上传，要求图片清晰可见，2MB以内</section>
                        <el-link :href="businessAuthLetterUrl" type="primary" :underline="false" target="_blank"> 模板下载 </el-link>
                      </div>
                    </upload-panel>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-row>
        </div>
        <div class="title">银行卡信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="24">
              <el-form-item label="账户类型" prop="archiveExpandVO.acctType">
                <el-select :disabled="form.archiveBaseVO.merchantType === 4" v-model="form.archiveExpandVO.acctType" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in acctTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="form.archiveExpandVO.acctType === 1">
              <el-col :span="12">
                <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
                  <upload-panel
                    alt="银行卡正面照"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.bankCardFrontUrl"
                    :image-url="form.archiveExpandVO.bankCardFrontUrl"
                    :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.bankCardFrontUrl', 'bank_card')"
                    @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardFrontUrl)" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="银行卡背面照" prop="archiveExpandVO.bankCardBackUrl">
                  <upload-panel
                    alt="银行卡背面照"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.bankCardBackUrl"
                    :image-url="form.archiveExpandVO.bankCardBackUrl"
                    :on-success="res => handleUpload(res, 'archiveExpandVO.bankCardBackUrl')"
                    @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardBackUrl)" />
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="12" v-if="form.archiveExpandVO.acctType === 2">
              <el-form-item label="收款类型" prop="archiveExpandVO.cashreceiveType">
                <el-select clearable v-model="form.archiveExpandVO.cashreceiveType" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in cashreceiveTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="archiveExpandVO.bankCard">
                <el-input clearable v-model="form.archiveExpandVO.bankCard" placeholder="银行账号" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户支行" prop="archiveExpandVO.bankSub">
                <km-select-page
                  ref="bankSub"
                  v-model="form.archiveExpandVO.bankSub"
                  option-label="bname"
                  option-value="bcode"
                  :data.sync="bankVO"
                  :request="getBankPage"
                  :is-max-page.sync="isBankVOMaxPage"
                  placeholder="开户支行"
                  style="width: 240px" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户名" prop="archiveExpandVO.bankAccountName">
                <el-input clearable v-model="form.archiveExpandVO.bankAccountName" placeholder="账户名" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预留手机号" prop="archiveExpandVO.cardholderPhone">
                <el-input clearable :disabled="formYQDisabled" v-model="form.archiveExpandVO.cardholderPhone" placeholder="预留手机号" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户支行所在省市" prop="archiveExpandVO.bankProvince">
                <area-select-for-two :key="bankAreaKey" @change="value => handleArea('bankProvince', value)" :areaList="bankAreaList" placeholder="省/市" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.acctType === 1 && form.archiveBaseVO.merchantType === 3">
              <el-form-item label="持卡人类型" prop="archiveExpandVO.cardholderType">
                <el-select v-model="form.archiveExpandVO.cardholderType" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in cardholderTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2 && form.archiveBaseVO.merchantType === 3">
            <el-col :span="12">
              <el-form-item label="持卡人身份证正面照" prop="archiveOtherVO.cardholderIdFrontUrl">
                <upload-panel
                  alt="持卡人身份证正面照"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cardholderIdFrontUrl"
                  :image-url="form.archiveOtherVO.cardholderIdFrontUrl"
                  :on-success="(res, file) => handleUploadToOCR(file, 'archiveOtherVO.cardholderIdFrontUrl', 'idcard')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderIdFrontUrl)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="持卡人身份证反面照" prop="archiveOtherVO.cardholderIdBackUrl">
                <upload-panel
                  alt="持卡人身份证反面照"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cardholderIdBackUrl"
                  :image-url="form.archiveOtherVO.cardholderIdBackUrl"
                  :on-success="(res, file) => handleUploadToOCR(file, 'archiveOtherVO.cardholderIdBackUrl', 'idcard')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderIdBackUrl)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2">
            <el-col :span="12">
              <el-form-item label="持卡人证件类型" prop="archiveExpandVO.cardholderIdType">
                <el-select :disabled="formYQDisabled" clearable v-model="form.archiveExpandVO.cardholderIdType" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in cardholderIdTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.acctType === 1">
              <el-form-item label="持卡人证件号码" prop="archiveExpandVO.cardholderIdNumber">
                <el-input :disabled="formYQDisabled" v-model="form.archiveExpandVO.cardholderIdNumber" placeholder="持卡人证件号码" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <template v-if="form.archiveBaseVO.merchantType === 3 && form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2">
              <el-col :span="12">
                <el-form-item label="持卡人证件有效期" prop="archiveExpandVO.cardholderIdBegin">
                  <el-date-picker value-format="yyyy-MM-dd" v-model="form.archiveExpandVO.cardholderIdBegin" type="date" placeholder="选择日期" style="width: 140px">
                  </el-date-picker>
                  <span style="margin: 5px">至</span>
                  <span v-if="[3, 5, 6, 7, 9].includes(auditStatus) && !form.archiveExpandVO.cardholderIdEnd">长期有效</span>
                  <el-date-picker v-else value-format="yyyy-MM-dd" v-model="form.archiveExpandVO.cardholderIdEnd" type="date" placeholder="选择日期" style="width: 140px">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="form.archiveBaseVO.merchantType === 4 && form.archiveExpandVO.acctType === 1">
              <el-form-item label="法人手持身份证" prop="archiveExpandVO.hardIdUrl">
                <upload-panel
                  alt="法人手持身份证"
                  :disabled="formYQDisabled"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :image-url="form.archiveExpandVO.hardIdUrl"
                  :on-success="res => handleUpload(res, 'archiveExpandVO.hardIdUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.hardIdUrl)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2">
            <el-col :span="12">
              <el-form-item label="开户许可证" prop="archiveExpandVO.openingPermitUrl">
                <upload-panel
                  alt="开户许可证"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.openingPermitUrl"
                  :image-url="form.archiveExpandVO.openingPermitUrl"
                  :on-success="res => handleUpload(res, 'archiveExpandVO.openingPermitUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.openingPermitUrl)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2 && form.archiveExpandVO.cashreceiveType === 2">
            <el-col :span="12">
              <el-form-item label="收款企业法人身份证正面照" prop="archiveOtherVO.cashreceiveIdFrontUrl">
                <upload-panel
                  alt="收款企业法人身份证正面照"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cashreceiveIdFrontUrl"
                  :image-url="form.archiveOtherVO.cashreceiveIdFrontUrl"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.cashreceiveIdFrontUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cashreceiveIdFrontUrl)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收款企业法人身份证反面照" prop="archiveOtherVO.cashreceiveIdBackUrl">
                <upload-panel
                  alt="收款企业法人身份证反面照"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cashreceiveIdBackUrl"
                  :image-url="form.archiveOtherVO.cashreceiveIdBackUrl"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.cashreceiveIdBackUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cashreceiveIdBackUrl)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2 && form.archiveExpandVO.cashreceiveType === 2">
            <el-col :span="12">
              <el-form-item label="第三方对公结算授权函" prop="archiveOtherVO.publicAuthorization">
                <upload-panel
                  alt="第三方对公结算授权函"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.publicAuthorization"
                  :image-url="form.archiveOtherVO.publicAuthorization"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.publicAuthorization')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.publicAuthorization)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2 && form.archiveBaseVO.merchantType === 3">
            <el-col :span="12">
              <el-form-item label="持卡人手持身份证照片" prop="archiveOtherVO.cardholderPhoto">
                <upload-panel
                  alt="持卡人手持身份证照片"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cardholderPhoto"
                  :image-url="form.archiveOtherVO.cardholderPhoto"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.cardholderPhoto')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderPhoto)" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="第三方对私结算授权函" prop="archiveOtherVO.privateAuthorization">
                <div class="e-private-con">
                  <upload-panel
                    alt="第三方对私结算授权函"
                    action="/uploadPic"
                    :fileServer="fileServer"
                    :exampleImg="exampleImg.privateAuthorization"
                    :image-url="form.archiveOtherVO.privateAuthorization"
                    :on-success="res => handleUpload(res, 'archiveOtherVO.privateAuthorization')"
                    @click="handleImgPreview(fileServe + form.archiveOtherVO.privateAuthorization)" />
                  <img ref="template" src="../../../../assets/images/xftArchive/privateTemplate.jpg" alt="" style="display: none" />
                  <el-button type="text" @click="handlePrivateLetter">下载模板</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">其他</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开通星POS刷卡" prop="archiveBaseVO.isOpenXingPos" style="width: 100%">
                <el-switch
                  style="display: block; line-height: 32px"
                  :disabled="formYQDisabled"
                  :active-value="2"
                  :inactive-value="1"
                  v-model="form.archiveBaseVO.isOpenXingPos"
                  active-color="#3377FF"
                  inactive-color="#D3DBEB">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.isOpenXingPos === 2">
            <el-col :span="12">
              <el-form-item label="持卡人身份证正面照" prop="archiveOtherVO.cardholderIdCardFront">
                <upload-panel
                  alt="持卡人身份证正面照"
                  action="/uploadPic"
                  :fileServer="fileServer"
                  :exampleImg="exampleImg.cardholderIdCardFront"
                  :image-url="form.archiveOtherVO.cardholderIdCardFront"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.cardholderIdCardFront')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderIdCardFront)" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">费率</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12">
              <el-form-item label="费率" prop="archiveBaseVO.fixFeeRate">
                <el-select :disabled="formYQDisabled" clearable v-model="form.archiveBaseVO.fixFeeRate" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in fixFeeRateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="享钱汇银费率" prop="archiveBaseVO.exchangeFeeRate">
                <el-select :disabled="formYQDisabled" clearable v-model="form.archiveBaseVO.exchangeFeeRate" placeholder="全部" style="width: 240px">
                  <el-option v-for="item in exchangeFeeRateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <el-tooltip effect="dark" content="享钱汇银费率填写和手续费率一致" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注" prop="archiveBaseVO.remark">
                <el-input :disabled="formYQDisabled" type="textarea" :autosize="{ minRows: 3 }" placeholder="" v-model="form.archiveBaseVO.remark" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="bottom">
      <template v-if="[undefined, 0, 1, 2, 4, 8].includes(auditStatus) || isCopy">
        <el-button @click="handleVerify" :loading="checkVerify" size="small" type="primary" class="archive-bottom-btn">提交</el-button>
      </template>
      <template v-if="[undefined, 0, 1, 2, 4, 8, 5, 10, 11].includes(auditStatus) || isCopy || ([6, 7].includes(auditStatus) && [1, 6].includes(form.archiveBaseVO.wxCertStatus))">
        <el-button v-if="!isDetail" @click="toSave" :loading="checkArchive" size="small" type="primary" plain class="archive-bottom-btn">保存</el-button>
      </template>
      <template v-if="[2, 5, 10, 11].includes(auditStatus) || isCopy || ([6, 7].includes(auditStatus) && [1, 6].includes(form.archiveBaseVO.wxCertStatus))">
        <el-button v-if="isDetail" @click="isDetail = false" size="small" type="primary" plain class="archive-bottom-btn">编辑</el-button>
      </template>
      <el-button v-if="[2].includes(auditStatus)" @click="toRefuse" size="small" class="archive-bottom-btn">拒绝</el-button>
      <el-button @click="toCancle" size="small" class="archive-bottom-btn">取消</el-button>
    </div>
    <el-dialog title="拒绝原因" :visible.sync="refuseDialogVisible" width="30%">
      <el-form :model="refuseForm" :rules="refuseRules" ref="refuseForm" class="demo-ruleForm">
        <el-form-item label="请输入审核不能过的原因" prop="remark">
          <el-input type="textarea" :autosize="{ minRows: 4 }" v-model="refuseForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refuseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="refuseConfirm">确定</el-button>
      </span>
    </el-dialog>
    <!-- image-preview -->
    <el-image-preview v-if="showViewer" :initial-index="imageIndex" :url-list="previewList" :on-close="() => (showViewer = false)" class="e-preview-con"></el-image-preview>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import { deepClone } from '@/utils'

import fileServer from '@/mixins/fileServe'
import { getSysShop } from '@/mixins/getSysShop'

import UploadPanel from '../components/uploadPanel'
import areaSelect from '@/components/areaSelect'
import areaSelectForTwo from '@/components/areaSelectForTwo'
import ElImagePreview from 'element-ui/packages/image/src/image-viewer'
import {
  xftValidator,
  exampleImg,
  acctTypeList,
  cashreceiveTypeList,
  cardholderTypeList,
  cardholderIdTypeList,
  cardTypeList,
  mchDealTypeList,
  fixFeeRateList,
  exchangeFeeRateList,
  auditStatusList,
  formYQValids,
  formObj,
  businessAuthLetterUrl
} from './xftValidator'

import { getWftAllTrade, queryCertType, getBankCnapByName, audit, submit, refuse, detail, imageOCR } from '@/api/xftArchive'

export default {
  name: 'xftArchiveAdd',
  mixins: [fileServer, getSysShop],
  components: { UploadPanel, areaSelect, areaSelectForTwo, ElImagePreview },
  data() {
    return {
      exampleImg,
      auditStatusList,
      acctTypeList,
      cashreceiveTypeList,
      cardholderTypeList,
      cardholderIdTypeList,
      cardTypeList,
      mchDealTypeList,
      fixFeeRateList,
      exchangeFeeRateList,
      formYQValids,
      businessAuthLetterUrl,
      questionIcon: require('@/assets/images/icon/questioin.png'),
      addLoading: false,
      isCopy: false,
      auditStatus: null,
      isDetail: false,
      areaKey: Symbol('areaKey'),
      legalPersonAddressKey: Symbol('legalPersonAddressKey'),
      bankAreaKey: Symbol('bankAreaKey'),
      areaList: [],
      legalPersonAddressList: [],
      bankAreaList: [],
      form: {},
      rules: xftValidator(),
      industrIdList: [],
      certTypeList: [],
      bankVO: [],
      isBankVOMaxPage: false,
      refuseDialogVisible: false,
      refuseForm: { remark: '' },
      refuseRules: { remark: [{ required: true, message: '请输入审核不能过的原因', trigger: 'blur' }] },
      formDisabled: false,
      previewList: [],
      showViewer: false,
      imageIndex: 0,
      isArchiveYQ: false,
      formYQDisabled: false,
      checkVerify: false,
      checkArchive: false,
      checkLegalPersonStatus: false
    }
  },
  created() {
    this.form = deepClone(formObj)
    if (this.$route.query.isCopy) this.isCopy = true
    this.auditStatus = this.$route.query.auditStatus && Number(this.$route.query.auditStatus)
    if ([2, 3, 5, 6, 7, 9, 10, 11].includes(this.auditStatus)) this.isDetail = true
    if (this.$route.query.id) this.getDetail()
  },
  mounted() {
    this.getShopPage()
    this.getIndustrIdList()
    this.$nextTick(() => {
      let pageStatus = ''
      if (this.auditStatus && this.isDetail) pageStatus = '详情'
      else if ([0, 1, 4, 8].includes(this.auditStatus)) pageStatus = '编辑'
      else pageStatus = '新增'
      this.updateTagView({ tagRoute: this.$route, title: `享付通资质进件/${pageStatus}` })
    })
  },
  methods: {
    ...mapActions(['updateTagView']),
    handlePrivateLetter() {
      window.open(this.$refs.template.src)
    },
    handleShopChange(value) {
      const merchantObj = this.shopVO.find(item => item.id === value)
      const { userId, shortName: merchantShortName, companyName, address, provinceCode: province, cityCode: city, districtCode: area } = merchantObj
      this.form.archiveBaseVO = Object.assign(this.form.archiveBaseVO, { userId, merchantShortName, companyName, address, province, city, area })
      this.areaList = [province, city, area]
      this.areaKey = Symbol('areaKey')
    },
    handleIndustrId(val) {
      if (val) {
        const industrItem = this.industrIdList.find(item => item.tradeCode === val)
        this.form.archiveBaseVO.industrIdName = industrItem.tradeName
        this.checkLegalPersonStatus = industrItem.tradeName.startsWith('企业') && this.form.archiveBaseVO.merchantType === 3
        if (industrItem.tradeName.startsWith('事业单位')) this.getCertTypeList()
      }
    },
    // 图片上传模块
    handleImgPreview(url) {
      if (this.isDetail && url) {
        this.previewList = []
        let imgList = document.querySelectorAll('.avatar')
        for (let i = 0; i < imgList.length; i++) {
          this.previewList.push(imgList[i].src)
        }
        this.showViewer = true
        this.imageIndex = this.previewList.findIndex(item => item === url)
      }
    },
    handleUpload(res, type) {
      if (res.data) {
        const typeList = type.split('.')
        this.form[typeList[0]][typeList[1]] = res.data.path
      }
    },
    handleUploadToOCR(file, type, code) {
      const OCRMap = new Map([
        ['archiveExpandVO.businessLicenseUrl', 'getBusinessLicenseOCR'],
        ['archiveExpandVO.idFrontUrl', 'getFaceIdOCR'],
        ['archiveExpandVO.idBackUrl', 'getBackIdOCR'],
        ['archiveExpandVO.contractHeadUrl', 'getContractFaceIdOCR'],
        ['archiveExpandVO.contractNationalUrl', 'getContractBackIdOCR'],
        ['archiveOtherVO.cardholderIdFrontUrl', 'getCardholderFaceIdOCR'],
        ['archiveOtherVO.cardholderIdBackUrl', 'getCardholderBackIdOCR'],
        ['archiveExpandVO.bankCardFrontUrl', 'getBankCardOCR']
      ])
      this.handleUpload(file.response, type)
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        let OCRData = { image: reader.result.split(',')[1], imageCode: code }
        if (code === 'idcard') {
          OCRData = Object.assign(OCRData, {
            side: ['archiveExpandVO.idFrontUrl', 'archiveExpandVO.contractHeadUrl', 'archiveOtherVO.cardholderIdFrontUrl'].includes(type) ? 'face' : 'back'
          })
        }
        this.$message({ type: 'success', message: '正在进行图片解析' })
        imageOCR(OCRData)
          .then(res => {
            this.$message({ type: 'success', message: '图片解析成功' })
            this[OCRMap.get(type)](res)
          })
          .catch(() => {})
      }
    },
    getBusinessLicenseOCR(res) {
      this.form.archiveExpandVO.licId = res.reg_num
      this.form.archiveBaseVO.companyName = res.name
      this.form.archiveBaseVO.address = res.address.replace(/.*(省|市|自治区|自治州|区)/, '')
      if (res.valid_period) {
        const validPeriod = res.valid_period.replace(/[年月./-]/g, '-').replace(/日/g, '')
        if (
          validPeriod.split('至')[0].split('-')[0].length !== 4 ||
          !Date.parse(validPeriod.split('至')[0]) ||
          (validPeriod.split('至')[1] !== '长期' && !Date.parse(validPeriod.split('至')[1].replace(/长期/, '')))
        ) {
          this.form.archiveExpandVO.licValidityBigen = ''
          this.form.archiveExpandVO.licValidityEnd = ''
        } else {
          this.form.archiveExpandVO.licValidityBigen = dayjs(validPeriod.split('至')[0]).format('YYYY-MM-DD')
          this.form.archiveExpandVO.licValidityEnd = validPeriod.split('至')[1].replace(/长期/, '')
            ? dayjs(validPeriod.split('至')[1].replace(/长期/, '')).format('YYYY-MM-DD')
            : ''
        }
      } else {
        this.form.archiveExpandVO.licValidityBigen = ''
        this.form.archiveExpandVO.licValidityEnd = ''
      }
    },
    getFaceIdOCR(res) {
      this.form.archiveExpandVO.legalPersonName = res.name
      this.form.archiveExpandVO.idNumber = res.num
    },
    getBackIdOCR(res) {
      const startDate = res.start_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      const endDate = res.end_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      this.form.archiveExpandVO.legalPersonValidityBegin = res.start_date && new Date(startDate) ? startDate : ''
      this.form.archiveExpandVO.legalPersonValidityEnd = res.end_date && new Date(endDate) ? endDate : ''
    },
    getContractFaceIdOCR(res) {
      this.form.archiveBaseVO.contact = res.name
      this.form.archiveBaseVO.idNumber = res.num
    },
    getContractBackIdOCR(res) {
      const startDate = res.start_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      const endDate = res.end_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      this.form.archiveExpandVO.credentialsValidDateBegin = res.start_date && new Date(startDate) ? startDate : ''
      this.form.archiveExpandVO.credentialsValidDateEnd = res.end_date && new Date(endDate) ? endDate : ''
    },
    getCardholderFaceIdOCR(res) {
      this.form.archiveExpandVO.cardholderIdNumber = res.num
    },
    getCardholderBackIdOCR(res) {
      const startDate = res.start_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      const endDate = res.end_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      this.form.archiveExpandVO.cardholderIdBegin = res.start_date && new Date(startDate) ? startDate : ''
      this.form.archiveExpandVO.cardholderIdEnd = res.end_date && new Date(endDate) ? endDate : ''
    },
    getBankCardOCR(res) {
      this.form.archiveExpandVO.bankCard = res.card_num
    },
    merchantTypeChange(value) {
      if (value === 4) this.form.archiveExpandVO.acctType = 1
    },
    handleArea(type, value) {
      if (type === 'area') this.form.archiveBaseVO = Object.assign(this.form.archiveBaseVO, { province: value[0], city: value[1], area: value[2] })
      else if (type === 'bankProvince') this.form.archiveExpandVO = Object.assign(this.form.archiveExpandVO, { bankProvince: value[0], bankCity: value[1] })
      else {
        this.form.archiveExpandVO = Object.assign(this.form.archiveExpandVO, { legalPersonProvince: value[0], legalPersonCity: value[1], legalPersonArea: value[2] })
      }
    },
    resetArchiveBaseVOAttr() {
      if (this.$route.query.isCopy) {
        this.form.archiveBaseVO = Object.assign(this.form.archiveBaseVO, { auditTime: '', bossAuditTime: '', createTime: '', auditStatus: '', useChannelCode: '' })
      }
    },
    toRefuse() {
      this.refuseForm.remark = ''
      this.refuseDialogVisible = true
    },
    toCancle() {
      this.$store.dispatch('delTagView', this.$route).then(() => this.$router.push({ path: 'xftArchive' }))
    },
    refuseConfirm() {
      this.$refs.refuseForm.validate(async valid => {
        if (valid) {
          try {
            await refuse({ archiveId: this.$route.query.id, auditRemark: this.refuseForm.remark })
            this.refuseDialogVisible = false
            this.toCancle()
            this.$message.success('操作成功')
          } catch (error) {}
        }
      })
    },
    handleCardholderId() {
      if (this.form.archiveExpandVO.acctType === 1 && this.form.archiveExpandVO.cardholderType === 1) {
        const { cardType, idNumber } = this.form.archiveExpandVO
        this.form.archiveExpandVO = Object.assign(this.form.archiveExpandVO, { cardholderIdType: cardType, cardholderIdNumber: idNumber })
      }
    },
    handleSetContactVO() {
      if (this.form.archiveExpandVO.contactSameLegal) {
        const { idFrontUrl, idBackUrl, legalPersonName, cardType, idNumber, legalPersonValidityBegin, legalPersonValidityEnd } = this.form.archiveExpandVO
        this.form.archiveExpandVO = Object.assign(this.form.archiveExpandVO, {
          contractHeadUrl: idFrontUrl,
          contractNationalUrl: idBackUrl,
          contactCredentialsType: cardType,
          credentialsValidDateBegin: legalPersonValidityBegin,
          credentialsValidDateEnd: legalPersonValidityEnd
        })
        this.form.archiveBaseVO = Object.assign(this.form.archiveBaseVO, { contact: legalPersonName, idNumber })
      }
    },
    async toSave() {
      this.resetArchiveBaseVOAttr()
      this.$refs.form.validateField('archiveBaseVO.merchantId', async errorMessage => {
        if (!errorMessage) {
          try {
            this.checkArchive = true
            this.handleSetContactVO()
            this.handleCardholderId()
            const res = await submit(this.form)
            if (!this.form.archiveBaseVO.id) {
              this.$router.push({ name: 'xftArchiveAdd', query: { auditStatus: 0, id: res } })
              this.isCopy = false
              this.getDetail()
              this.updateTagView({ tagRoute: this.$route, title: `享付通资质进件/编辑` })
            }
            this.$message.success('保存成功')
          } catch (error) {
          } finally {
            this.checkArchive = false
          }
        }
      })
    },
    async handleVerify() {
      const handleSubReview = async () => {
        this.resetArchiveBaseVOAttr()
        try {
          this.checkVerify = true
          this.handleSetContactVO()
          this.handleCardholderId()
          await audit(this.form)
          this.toCancle()
          this.$message.success('提交成功')
        } catch (error) {
        } finally {
          this.checkVerify = false
        }
      }
      if (this.formYQDisabled) {
        Promise.all(
          this.formYQValids.map(item => {
            return new Promise(resolve => {
              this.$refs.form.validateField(item, error => resolve(error))
            })
          })
        ).then(async valid => {
          if (valid.every(item => item === '')) handleSubReview()
        })
      } else {
        this.$refs.form.validate(async valid => {
          if (valid) handleSubReview()
        })
      }
    },
    handleAreaKeyAndVO(res) {
      this.areaKey = Symbol('areaKey')
      this.bankAreaKey = Symbol('bankAreaKey')
      this.legalPersonAddressKey = Symbol('legalPersonAddressKey')
      this.areaList = [res.archiveBaseDTO.province, res.archiveBaseDTO.city, res.archiveBaseDTO.area]
      this.bankAreaList = [res.archiveExpandDTO.bankProvince, res.archiveExpandDTO.bankCity]
      this.legalPersonAddressList = [res.archiveExpandDTO.legalPersonProvince, res.archiveExpandDTO.legalPersonCity, res.archiveExpandDTO.legalPersonArea]
    },
    async getDetail() {
      this.addLoading = true
      try {
        const res = await detail({ archiveId: Number(this.$route.query.id) })
        this.form.archiveBaseVO = res.archiveBaseDTO
        this.form.archiveExpandVO = res.archiveExpandDTO
        this.form.archiveOtherVO = res.archiveOtherDTO
        this.form.archiveExpandVO.cardType = 1
        this.handleAreaKeyAndVO(res)
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.merchant.selectVal = this.form.archiveBaseVO.merchantName
            this.$refs.bankSub.selectVal = this.form.archiveExpandVO.bankSubName
          }, 200)
        })
        if (this.isCopy) {
          this.form.archiveBaseVO.id = null
          this.form.archiveExpandVO.id = null
          this.form.archiveOtherVO.id = null
          this.form.archiveBaseVO.wxCertStatus = null
          this.form.archiveBaseVO.auditStatus = null
        }
        this.auditStatus = this.form.archiveBaseVO.auditStatus
        this.form.archiveExpandVO.openingPermitUrl = res.archiveExpandDTO.openingPermitUrl
        this.formYQDisabled = res.archiveBaseDTO.source === 3
        this.checkLegalPersonStatus = this.form.archiveBaseVO.industrIdName.startsWith('企业') && this.form.archiveBaseVO.merchantType === 3
      } catch (error) {
      } finally {
        this.addLoading = false
      }
    },
    async getBankPage({ query = '', page = 1, rows = 10 } = {}) {
      try {
        const res = await getBankCnapByName({ bankName: query, page, rows })
        this.bankVO = this.bankVO.concat(res.results || [])
        this.isBankVOMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    },
    async getIndustrIdList() {
      try {
        this.industrIdList = (await getWftAllTrade()) || []
      } catch (error) {}
    },
    async getCertTypeList() {
      try {
        this.certTypeList = (await queryCertType()) || []
      } catch (error) {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/xftArchiveAdd';
</style>
