<template>
  <div v-permission.page="'XFT_LIST_ADD,XFT_LIST_EDIT'">
    <div class="xft-add" v-loading="addLoading">
      <div class="header" v-if="!isCopy && auditStatus !== undefined">
        <el-row>
          <el-col :span="12" class="title-text" v-if="auditStatus !== undefined">
            <span class="archive-title">进件状态：</span>
            <span class="archive-status">{{ auditStatusList[auditStatus] }}</span>
          </el-col>
          <el-col :span="12" class="title-text" v-if="[1, 4, 8].includes(auditStatus)">
            <span class="archive-title">审核结果：</span>
            <span>{{ form.archiveBaseVO.auditRemark }}</span>
          </el-col>
        </el-row>
      </div>
      <el-form :disabled="isDetail" ref="form" :rules="rules" class="xft-add-form" size="small" label-suffix=":" :inline="true" :model="form" label-width="210px">
        <div class="title">基本信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="商户" prop="archiveBaseVO.merchantId">
                <select-page
                  :disabled="formYQDisabled || [1, 4, 8].includes(this.auditStatus)"
                  style="width: 240px"
                  :value="form.archiveBaseVO.merchantName"
                  @remoteMethod="shopRemoteMethod"
                  @loadMore="shopLoadMore"
                  id="id"
                  name="companyName"
                  :options="shopList"
                  :isMaxPage="isMaxPageShop"
                  @change="shopChange"
                  @clear="shopClear">
                </select-page>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
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
              <el-col :span="12" class="archive-form-item">
                <el-form-item label="营业执照" prop="archiveExpandVO.businessLicenseUrl">
                  <upload-pic
                    alt="营业执照"
                    :hasBase64="true"
                    :imagePath="form.archiveExpandVO.businessLicenseUrl"
                    :fileServer="fileServer"
                    @on-success="(value, base64Code) => setBusinessLicenseAndBase64(value, base64Code, 'archiveExpandVO', 'businessLicenseUrl')"
                    :exampleImg="exampleImg.businessLicenseUrl"
                    @click="handleImgPreview(fileServe + form.archiveExpandVO.businessLicenseUrl)">
                  </upload-pic>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12" class="archive-form-item">
                <el-form-item label="营业执照注册号" prop="archiveExpandVO.licId">
                  <el-input style="width: 240px" v-model="form.archiveExpandVO.licId" placeholder=""></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" class="archive-form-item">
                <el-form-item label="营业执照有效期" prop="archiveExpandVO.licValidityBigen">
                  <el-date-picker
                    style="width: 140px"
                    value-format="yyyy-MM-dd"
                    v-model="form.archiveExpandVO.licValidityBigen"
                    @change="value => timeChange(value, 'licValidityBigen')"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <span style="margin: 5px">至</span>
                  <span v-if="[3, 5, 6, 7, 9].includes(auditStatus) && !form.archiveExpandVO.licValidityEnd"> 长期有效 </span>
                  <el-date-picker
                    v-else
                    style="width: 140px"
                    value-format="yyyy-MM-dd"
                    v-model="form.archiveExpandVO.licValidityEnd"
                    @change="value => timeChange(value, 'licValidityEnd')"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="公司名称" prop="archiveBaseVO.companyName">
                <el-input style="width: 240px" :disabled="formYQDisabled" v-model="form.archiveBaseVO.companyName" placeholder=""></el-input>
                <el-tooltip effect="dark" content="公司名称必须与营业执照/登记证书一致" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
                <el-input style="width: 240px" v-model="form.archiveBaseVO.merchantShortName" placeholder=""></el-input>
                <el-tooltip effect="dark" content="用于支付完成页面向消费者展示" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="地区" prop="archiveBaseVO.province">
                <area-select :key="areaKey" @change="areaChange" :areaList="areaList"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="详细地址" prop="archiveBaseVO.address">
                <el-input style="width: 240px" v-model="form.archiveBaseVO.address" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="客服电话" prop="archiveBaseVO.serviceTel">
                <el-input style="width: 240px" :disabled="formYQDisabled" v-model="form.archiveBaseVO.serviceTel" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="负责人" prop="archiveBaseVO.contact">
                <el-input style="width: 240px" :disabled="formYQDisabled" v-model="form.archiveBaseVO.contact" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="负责人证件号码" prop="archiveBaseVO.idNumber">
                <el-input style="width: 240px" :disabled="formYQDisabled" v-model="form.archiveBaseVO.idNumber" clearable placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="负责人电话" prop="archiveBaseVO.contactPhone">
                <el-input style="width: 240px" v-model="form.archiveBaseVO.contactPhone" clearable placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="邮箱" prop="archiveBaseVO.email">
                <el-input style="width: 240px" v-model="form.archiveBaseVO.email" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="经营类型" prop="archiveBaseVO.mchDealType">
                <el-select style="width: 240px" :disabled="formYQDisabled" clearable v-model="form.archiveBaseVO.mchDealType" placeholder="全部">
                  <el-option v-for="item in mchDealTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="经营类目" prop="archiveBaseVO.industrId">
                <el-select style="width: 240px" clearable v-model="form.archiveBaseVO.industrId" placeholder="全部">
                  <el-option v-for="item in industrIdList" :key="item.tradeCode" :label="item.tradeName" :value="item.tradeCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              class="archive-form-item"
              v-if="form.archiveBaseVO.merchantType === 3 && form.archiveBaseVO.industrIdName && form.archiveBaseVO.industrIdName.includes('事业单位')">
              <el-form-item label="登记证书类型" prop="archiveExpandVO.certType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.certType" placeholder="全部">
                  <el-option v-for="item in certTypeList" :key="item.certNum" :label="item.certName" :value="item.certNum"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
                <upload-pic
                  alt="门店门头照"
                  :imagePath="form.archiveOtherVO.signboardUrl"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.signboardUrl')"
                  :exampleImg="exampleImg.signboardUrl"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.signboardUrl)"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="收银台照片" prop="archiveOtherVO.cashierDesk">
                <upload-pic
                  alt="收银台照片"
                  :imagePath="form.archiveOtherVO.cashierDesk"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.cashierDesk')"
                  :exampleImg="exampleImg.cashierDesk"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cashierDesk)"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.merchantType === 3">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="企业信息公示网照片" prop="archiveOtherVO.enterpriseInfoScreenshot">
                <upload-pic
                  alt="企业信息公示网照片"
                  :imagePath="form.archiveOtherVO.enterpriseInfoScreenshot"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.enterpriseInfoScreenshot')"
                  :exampleImg="exampleImg.enterpriseInfoScreenshot"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.enterpriseInfoScreenshot)"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.merchantType === 4">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="经营场所照" :disabled="formYQDisabled" prop="archiveOtherVO.businessSiteOneUrl">
                <upload-pic
                  alt="经营场所照"
                  :disabled="formYQDisabled"
                  :imagePath="form.archiveOtherVO.businessSiteOneUrl"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.businessSiteOneUrl')"
                  :exampleImg="exampleImg.businessSiteOneUrl"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteOneUrl)"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="租赁合同照一" prop="archiveOtherVO.contractOfTenancy1">
                <upload-pic
                  alt="租赁合同照一"
                  :disabled="formYQDisabled"
                  :imagePath="form.archiveOtherVO.contractOfTenancy1"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.contractOfTenancy1')"
                  :exampleImg="exampleImg.contractOfTenancy"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.contractOfTenancy1)"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveBaseVO.merchantType === 4">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="租赁合同照二" prop="archiveOtherVO.contractOfTenancy2">
                <upload-pic
                  alt="租赁合同照二"
                  :disabled="formYQDisabled"
                  :imagePath="form.archiveOtherVO.contractOfTenancy2"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.contractOfTenancy2')"
                  :exampleImg="exampleImg.contractOfTenancy"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.contractOfTenancy2)"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="租赁合同照三" prop="archiveOtherVO.contractOfTenancy3">
                <upload-pic
                  alt="租赁合同照三"
                  :disabled="formYQDisabled"
                  :imagePath="form.archiveOtherVO.contractOfTenancy3"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.contractOfTenancy3')"
                  :exampleImg="exampleImg.contractOfTenancy"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.contractOfTenancy3)"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">法人信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="身份证正面照" prop="archiveExpandVO.idFrontUrl">
                <upload-pic
                  alt="身份证正面照"
                  :hasBase64="true"
                  :imagePath="form.archiveExpandVO.idFrontUrl"
                  :fileServer="fileServer"
                  @on-success="(value, base64Code) => setIdCardAndBase64(value, base64Code, 'archiveExpandVO', 'idFrontUrl', 'face')"
                  :exampleImg="exampleImg.idFrontUrl"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.idFrontUrl)"></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="身份证背面照" prop="archiveExpandVO.idBackUrl">
                <upload-pic
                  alt="身份证背面照"
                  :hasBase64="true"
                  :imagePath="form.archiveExpandVO.idBackUrl"
                  :fileServer="fileServer"
                  @on-success="(value, base64Code) => setIdCardAndBase64(value, base64Code, 'archiveExpandVO', 'idBackUrl', 'back')"
                  :exampleImg="exampleImg.idBackUrl"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.idBackUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="法人姓名" prop="archiveExpandVO.legalPersonName">
                <el-input style="width: 240px" v-model="form.archiveExpandVO.legalPersonName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件类型">
                <el-select style="width: 240px" disabled clearable v-model="form.archiveExpandVO.cardType" placeholder="全部">
                  <el-option v-for="item in cardTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件号码" prop="archiveExpandVO.idNumber">
                <el-input style="width: 240px" v-model="form.archiveExpandVO.idNumber" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件有效期" prop="archiveExpandVO.legalPersonValidityBegin">
                <el-date-picker
                  style="width: 140px"
                  value-format="yyyy-MM-dd"
                  v-model="form.archiveExpandVO.legalPersonValidityBegin"
                  @change="value => timeChange(value, 'legalPersonValidityBegin')"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <span style="margin: 5px">至</span>
                <span v-if="[3, 5, 6, 7, 9].includes(auditStatus) && !form.archiveExpandVO.legalPersonValidityEnd"> 长期有效 </span>
                <el-date-picker
                  v-else
                  style="width: 140px"
                  value-format="yyyy-MM-dd"
                  v-model="form.archiveExpandVO.legalPersonValidityEnd"
                  @change="value => timeChange(value, 'legalPersonValidityEnd')"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">银行卡信息</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="账户类型" prop="archiveExpandVO.acctType">
                <el-select style="width: 240px" :disabled="form.archiveBaseVO.merchantType === 4" clearable v-model="form.archiveExpandVO.acctType" placeholder="全部">
                  <el-option v-for="item in acctTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 之所有两个开户支行，是为了页面结构更加的好看 -->
            <el-col :span="12" class="archive-form-item" v-if="form.archiveBaseVO.merchantType === 4">
              <el-form-item label="开户支行" prop="archiveExpandVO.bankSub">
                <select-page
                  style="width: 240px"
                  :value="form.archiveExpandVO.bankSubName"
                  @remoteMethod="bankRemoteMethod"
                  @loadMore="bankLoadMore"
                  id="bcode"
                  name="bname"
                  :options="bankList"
                  :isMaxPage="isMaxPageBank"
                  @focus="bankFocus"
                  @change="bankChange"
                  @clear="bankClear">
                </select-page>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
                <upload-pic
                  alt="银行卡正面照"
                  :hasBase64="true"
                  :imagePath="form.archiveExpandVO.bankCardFrontUrl"
                  :fileServer="fileServer"
                  @on-success="(value, base64Code) => setBankCardAndBase64(value, base64Code, 'archiveExpandVO', 'bankCardFrontUrl')"
                  :exampleImg="exampleImg.bankCardFrontUrl"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardFrontUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行卡背面照" prop="archiveExpandVO.bankCardBackUrl">
                <upload-pic
                  alt="银行卡背面照"
                  :imagePath="form.archiveExpandVO.bankCardBackUrl"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveExpandVO.bankCardBackUrl')"
                  :exampleImg="exampleImg.bankCardBackUrl"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardBackUrl)">
                </upload-pic>
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
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行账号" prop="archiveExpandVO.bankCard">
                <el-input clearable style="width: 240px" v-model="form.archiveExpandVO.bankCard" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveBaseVO.merchantType === 3">
              <el-form-item label="开户支行" prop="archiveExpandVO.bankSub">
                <select-page
                  style="width: 240px"
                  :value="form.archiveExpandVO.bankSubName"
                  @remoteMethod="bankRemoteMethod"
                  @loadMore="bankLoadMore"
                  id="bcode"
                  name="bname"
                  :options="bankList"
                  :isMaxPage="isMaxPageBank"
                  @focus="bankFocus"
                  @change="bankChange"
                  @clear="bankClear">
                </select-page>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="账户名" prop="archiveExpandVO.bankAccountName">
                <el-input clearable style="width: 240px" v-model="form.archiveExpandVO.bankAccountName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="预留手机号" prop="archiveExpandVO.cardholderPhone">
                <el-input clearable style="width: 240px" :disabled="formYQDisabled" v-model="form.archiveExpandVO.cardholderPhone" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开户支行所在省市" prop="archiveExpandVO.bankProvince">
                <area-select-for-two :key="bankAreaKey" @change="bankAreaChange" :areaList="bankAreaList"></area-select-for-two>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveExpandVO.acctType === 1 && form.archiveBaseVO.merchantType === 3">
              <el-form-item label="持卡人类型" prop="archiveExpandVO.cardholderType">
                <el-select style="width: 240px" clearable v-model="form.archiveExpandVO.cardholderType" placeholder="全部">
                  <el-option v-for="item in cardholderTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2 && form.archiveBaseVO.merchantType === 3">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人身份证正面照" prop="archiveOtherVO.cardholderIdFrontUrl">
                <upload-pic
                  alt="持卡人身份证正面照"
                  :hasBase64="true"
                  :imagePath="form.archiveOtherVO.cardholderIdFrontUrl"
                  :fileServer="fileServer"
                  @on-success="(value, base64Code) => setIdCardAndBase64(value, base64Code, 'archiveOtherVO', 'cardholderIdFrontUrl', 'face')"
                  :exampleImg="exampleImg.cardholderIdFrontUrl"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderIdFrontUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人身份证反面照" prop="archiveOtherVO.cardholderIdBackUrl">
                <upload-pic
                  alt="持卡人身份证反面照"
                  :hasBase64="true"
                  :imagePath="form.archiveOtherVO.cardholderIdBackUrl"
                  :fileServer="fileServer"
                  @on-success="(value, base64Code) => setIdCardAndBase64(value, base64Code, 'archiveOtherVO', 'cardholderIdBackUrl', 'back')"
                  :exampleImg="exampleImg.cardholderIdBackUrl"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderIdBackUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveExpandVO.acctType === 1">
              <el-form-item label="持卡人证件类型" prop="archiveExpandVO.cardholderIdType">
                <el-select style="width: 240px" :disabled="formYQDisabled" clearable v-model="form.archiveExpandVO.cardholderIdType" placeholder="全部">
                  <el-option v-for="item in cardholderIdTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveExpandVO.acctType === 1">
              <el-form-item label="持卡人证件号码" prop="archiveExpandVO.cardholderIdNumber">
                <el-input style="width: 240px" :disabled="formYQDisabled" v-model="form.archiveExpandVO.cardholderIdNumber" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <template v-if="form.archiveBaseVO.merchantType === 3 && form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2">
              <el-col :span="12" class="archive-form-item">
                <el-form-item label="持卡人证件有效期" prop="archiveExpandVO.cardholderIdBegin">
                  <el-date-picker style="width: 140px" value-format="yyyy-MM-dd" v-model="form.archiveExpandVO.cardholderIdBegin" type="date" placeholder="选择日期">
                  </el-date-picker>
                  <span style="margin: 5px">至</span>
                  <span v-if="[3, 5, 6, 7, 9].includes(auditStatus) && !form.archiveExpandVO.cardholderIdEnd"> 长期有效 </span>
                  <el-date-picker v-else style="width: 140px" value-format="yyyy-MM-dd" v-model="form.archiveExpandVO.cardholderIdEnd" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item" v-if="form.archiveBaseVO.merchantType === 4 && form.archiveExpandVO.acctType === 1">
              <el-form-item label="法人手持身份证" prop="archiveExpandVO.hardIdUrl">
                <upload-pic
                  alt="法人手持身份证"
                  :disabled="formYQDisabled"
                  :showExample="false"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.hardIdUrl"
                  @on-success="res => uploadSuccess(res, 'archiveExpandVO.hardIdUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.hardIdUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开户许可证" prop="archiveExpandVO.openingPermitUrl">
                <upload-pic
                  alt="开户许可证"
                  :imagePath="form.archiveExpandVO.openingPermitUrl"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveExpandVO.openingPermitUrl')"
                  :exampleImg="exampleImg.openingPermitUrl"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.openingPermitUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2 && form.archiveExpandVO.cashreceiveType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="收款企业法人身份证正面照" prop="archiveOtherVO.cashreceiveIdFrontUrl">
                <upload-pic
                  alt="收款企业法人身份证正面照"
                  :imagePath="form.archiveOtherVO.cashreceiveIdFrontUrl"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.cashreceiveIdFrontUrl')"
                  :exampleImg="exampleImg.cashreceiveIdFrontUrl"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cashreceiveIdFrontUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="收款企业法人身份证反面照" prop="archiveOtherVO.cashreceiveIdBackUrl">
                <upload-pic
                  alt="收款企业法人身份证反面照"
                  :imagePath="form.archiveOtherVO.cashreceiveIdBackUrl"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.cashreceiveIdBackUrl')"
                  :exampleImg="exampleImg.cashreceiveIdBackUrl"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cashreceiveIdBackUrl)">
                </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.archiveExpandVO.acctType === 2 && form.archiveExpandVO.cashreceiveType === 2">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="第三方对公结算授权函" prop="archiveOtherVO.publicAuthorization">
                <upload-pic
                  alt="第三方对公结算授权函"
                  :imagePath="form.archiveOtherVO.publicAuthorization"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.publicAuthorization')"
                  :exampleImg="exampleImg.publicAuthorization"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.publicAuthorization)">
                </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="form.archiveExpandVO.acctType === 1 && form.archiveExpandVO.cardholderType === 2 && form.archiveBaseVO.merchantType === 3">
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人手持身份证照片" prop="archiveOtherVO.cardholderPhoto">
                <upload-pic
                  alt="持卡人手持身份证照片"
                  :imagePath="form.archiveOtherVO.cardholderPhoto"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.cardholderPhoto')"
                  :exampleImg="exampleImg.cardholderPhoto"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderPhoto)">
                </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="第三方对私结算授权函" prop="archiveOtherVO.privateAuthorization">
                <upload-pic
                  style="display: inline-block"
                  alt="第三方对私结算授权函"
                  :imagePath="form.archiveOtherVO.privateAuthorization"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.privateAuthorization')"
                  :exampleImg="exampleImg.privateAuthorization"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.privateAuthorization)">
                </upload-pic>
                <div style="display: inline">
                  <img ref="template" src="../../../../assets/images/xftArchive/privateTemplate.jpg" alt="" style="display: none" />
                  <span class="xft-add-template" @click="handlePrivateLetter">下载模板</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">其他</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="开通星POS刷卡" prop="archiveBaseVO.isOpenXingPos" style="width: 100%">
                <el-switch
                  style="display: block"
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
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="持卡人身份证正面照" prop="archiveOtherVO.cardholderIdCardFront">
                <upload-pic
                  alt="持卡人身份证正面照"
                  :imagePath="form.archiveOtherVO.cardholderIdCardFront"
                  :fileServer="fileServer"
                  @on-success="res => uploadSuccess(res, 'archiveOtherVO.cardholderIdCardFront')"
                  :exampleImg="exampleImg.cardholderIdCardFront"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.cardholderIdCardFront)"></upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title">费率</div>
        <div class="form-info">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="费率" prop="archiveBaseVO.fixFeeRate">
                <el-select style="width: 240px" :disabled="formYQDisabled" clearable v-model="form.archiveBaseVO.fixFeeRate" placeholder="全部">
                  <el-option v-for="item in fixFeeRateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="享钱汇银费率" prop="archiveBaseVO.exchangeFeeRate">
                <el-select style="width: 240px" :disabled="formYQDisabled" clearable v-model="form.archiveBaseVO.exchangeFeeRate" placeholder="全部">
                  <el-option v-for="item in exchangeFeeRateList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
                <el-tooltip effect="dark" content="享钱汇银费率填写和手续费率一致" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="备注" prop="archiveBaseVO.remark">
                <el-input style="width: 240px" :disabled="formYQDisabled" type="textarea" :autosize="{ minRows: 3 }" placeholder="" v-model="form.archiveBaseVO.remark"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="bottom">
      <el-button v-if="[undefined, 0, 1, 2, 4, 8].includes(auditStatus) || isCopy" @click="toAdd" :loading="checkVerify" size="small" type="primary" class="archive-bottom-btn"
        >提交审核</el-button
      >
      <template
        v-if="
          ([undefined, 0, 1, 2, 4, 8, 5, 10, 11].includes(auditStatus) || isCopy || ([6, 7].includes(auditStatus) && [1, 6].includes(form.archiveBaseVO.wxCertStatus))) && !isDetail
        ">
        <el-button @click="toSave" :loading="checkArchive" size="small" type="primary" plain class="archive-bottom-btn">保存</el-button>
      </template>
      <template v-if="([2, 5, 10, 11].includes(auditStatus) || isCopy || ([6, 7].includes(auditStatus) && [1, 6].includes(form.archiveBaseVO.wxCertStatus))) && isDetail">
        <el-button @click="isDetail = false" size="small" type="primary" plain class="archive-bottom-btn">编辑</el-button>
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
        <el-button @click="refuseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="refuseConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- image-preview -->
    <el-image-preview
      ref="imageViewer"
      v-if="showViewer"
      :initial-index="imageIndex"
      :url-list="previewList"
      :on-close="handleClosePreview"
      class="e-preview-con"></el-image-preview>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import selectPage from '@/components/selectPage'
import uploadPic from '../components/uploadPic'
import areaSelect from '@/components/areaSelect'
import areaSelectForTwo from '@/components/areaSelectForTwo'
import ElImagePreview from 'element-ui/packages/image/src/image-viewer'
import fileServer from '@/mixins/fileServe'
import xftValidator from './xftValidator'
import dayjs from 'dayjs'
import { getWftAllTrade, queryCertType, queryShopListByPage, getBankCnapByName, isShowRate, audit, submit, refuse, detail, imageOCR } from '@/api/xftArchive'

export default {
  name: 'xftArchiveAdd',
  mixins: [fileServer],
  components: {
    selectPage,
    uploadPic,
    areaSelect,
    areaSelectForTwo,
    ElImagePreview
  },
  data() {
    return {
      questionIcon: require('@/assets/images/icon/questioin.png'),
      addLoading: false,
      isCopy: false,
      auditStatus: null,
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
      type: '',
      isDetail: false,
      areaKey: Symbol('areaKey'),
      bankAreaKey: Symbol('bankAreaKey'),
      rules: xftValidator(),
      refuseRules: {
        remark: [{ required: true, message: '请输入审核不能过的原因', trigger: 'blur' }]
      },
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
          isOpenXingPos: 1,
          mchDealType: 1,
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
          source: 2,
          status: null,
          submitLevel: null,
          unionpaycodeFeeRate: null,
          useChannelCode: '',
          userId: null,
          wxCertStatus: null,
          wxFlag: null,
          wxIndustryId: '',
          wxIndustryIdName: ''
        },
        archiveExpandVO: {
          cardType: 1,
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
          taxRegistrationUrl: '',
          cardholderIdBegin: '',
          cardholderIdEnd: ''
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
        { id: 2, name: '对公' },
        { id: 1, name: '对私' }
      ],
      cashreceiveTypeList: [
        { id: 1, name: '本企业收款' },
        { id: 2, name: '其他企业收款' }
      ],
      cardholderTypeList: [
        { id: 1, name: '个体商户 持卡人为法人' },
        { id: 2, name: '个体商户 持卡人为非法人' }
      ],
      cardholderIdTypeList: [
        { id: '1', name: '身份证' },
        { id: '2', name: '护照' }
      ],
      cardTypeList: [{ id: 1, name: '身份证' }],
      mchDealTypeList: [
        { id: 1, name: '实体' },
        { id: 2, name: '虚拟' }
      ],
      fixFeeRateList: [
        { id: 25, name: '0.' + '25' + '%' },
        { id: 28, name: '0.' + '28' + '%' },
        { id: 30, name: '0.' + '30' + '%' },
        { id: 35, name: '0.' + '35' + '%' },
        { id: 38, name: '0.' + '38' + '%' },
        { id: 45, name: '0.' + '45' + '%' },
        { id: 55, name: '0.' + '55' + '%' },
        { id: 60, name: '0.' + '60' + '%' }
      ],
      exchangeFeeRateList: [
        { id: 25, name: '0.' + '25' + '%' },
        { id: 28, name: '0.' + '28' + '%' },
        { id: 30, name: '0.' + '30' + '%' },
        { id: 35, name: '0.' + '35' + '%' },
        { id: 38, name: '0.' + '38' + '%' },
        { id: 45, name: '0.' + '45' + '%' },
        { id: 55, name: '0.' + '55' + '%' },
        { id: 60, name: '0.' + '60' + '%' }
      ],
      industrIdList: [],
      certTypeList: [],
      areaList: [],
      bankAreaList: [],
      statusList: [],
      shopList: [],
      bankList: [],
      selectPageNoShop: 1,
      selectPageNoBank: 1,
      refuseDialogVisible: false,
      refuseForm: {
        remark: ''
      },
      formDisabled: false,
      isMaxPageShop: false,
      isMaxPageBank: false,
      isExchangeFeeRate: false,
      searchStringShop: '',
      searchStringBank: '',
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
        cashierDesk: require('@/assets/images/xftArchive/cashier_desk.png'),
        businessSiteOneUrl: require('@/assets/images/xftArchive/shop_cash.png'),
        contractOfTenancy: require('@/assets/images/xftArchive/contract_of_tenancy.png')
      },
      previewList: [],
      showViewer: false,
      imageIndex: 0,
      isArchiveYQ: false,
      formYQDisabled: false,
      checkVerify: false,
      checkArchive: false
    }
  },
  computed: {
    getIndustrId() {
      return this.form.archiveBaseVO.industrId
    },
    getBankSub() {
      return this.form.archiveExpandVO.bankSub
    }
  },
  watch: {
    getIndustrId() {
      if (this.getIndustrId) {
        this.industrIdList.forEach(item => {
          if (item.tradeCode === this.getIndustrId) {
            this.form.archiveBaseVO.industrIdName = item.tradeName
          }
        })
        if (this.form.archiveBaseVO.industrIdName && this.form.archiveBaseVO.industrIdName.includes('事业单位')) {
          this.getCertTypeList()
        }
      }
    },
    getBankSub() {
      if (this.getBankSub) {
        try {
          isShowRate({ code: this.getBankSub }).then(res => {
            this.isExchangeFeeRate = res
          })
        } catch (error) {}
      }
    }
  },
  created() {
    if (this.$route.query.isCopy) {
      this.isCopy = true
    }
    this.auditStatus = this.$route.query.auditStatus && Number(this.$route.query.auditStatus)
    if ([2, 3, 5, 6, 7, 9, 10, 11].includes(this.auditStatus)) {
      this.isDetail = true
    }
    if (this.$route.query.id) {
      this.getDetail()
    }
  },
  mounted() {
    this.getIndustrIdList()
    this.shopRemoteMethod()
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
    handleClosePreview() {
      this.showViewer = false
    },
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
    setBusinessLicenseAndBase64(res, base64Code, type, url) {
      const OCRData = {
        image: base64Code.split(',')[1],
        imageCode: 'business_license'
      }
      this.$message.success('正在进行图片解析')
      imageOCR(OCRData)
        .then(async res => {
          this.$message.success('图片解析成功')
          this.form.archiveExpandVO.licId = res.reg_num
          this.form.archiveBaseVO.companyName = res.name
          this.form.archiveBaseVO.address = res.address.replace(/.*(省|市|自治区|自治州|区)/, '')
          if (res.valid_period) {
            const validPeriodArr = res.valid_period
              .replace(/[年月./-]/g, '-')
              .replace(/日/g, '')
              .split('至')
            let endTime = validPeriodArr[1].replace(/长期/, '')
            // 如果开始时间的年份不是四位，或者开始时间不是一个有效的时间字符串，或者结束时间既不是长期也不是有效的时间字符串
            // 那么此次解析出现的时间是错误的时间
            if (validPeriodArr[0].split('-')[0].length !== 4 || !Date.parse(validPeriodArr[0]) || (validPeriodArr[1] !== '长期' && !Date.parse(endTime))) {
              this.form.archiveExpandVO.licValidityBigen = ''
              this.form.archiveExpandVO.licValidityEnd = ''
            } else {
              this.form.archiveExpandVO.licValidityBigen = dayjs(validPeriodArr[0]).format('YYYY-MM-DD')
              this.form.archiveExpandVO.licValidityEnd = endTime ? dayjs(endTime).format('YYYY-MM-DD') : ''
            }
          } else {
            this.form.archiveExpandVO.licValidityBigen = ''
            this.form.archiveExpandVO.licValidityEnd = ''
          }
        })
        .catch(() => {})
      this.form[type][url] = res.data.path
    },
    setIdCardAndBase64(res, base64Code, type, url, side) {
      const OCRData = {
        image: base64Code.split(',')[1],
        imageCode: 'idcard',
        side
      }
      this.$message.success('正在进行图片解析')
      imageOCR(OCRData)
        .then(res => {
          this.$message.success('图片解析成功')
          if (side === 'face') {
            if (url === 'cardholderIdFrontUrl') this.form.archiveExpandVO.cardholderIdNumber = res.num
            else {
              this.form.archiveExpandVO.legalPersonName = res.name
              this.form.archiveExpandVO.idNumber = res.num
            }
          } else {
            const startDate = res.start_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
            const endDate = res.end_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
            if (url === 'cardholderIdBackUrl') {
              this.form.archiveExpandVO.cardholderIdBegin = res.start_date && !!Date.parse(startDate) ? startDate : ''
              this.form.archiveExpandVO.cardholderIdEnd = res.end_date && !!Date.parse(endDate) ? endDate : ''
            } else {
              this.form.archiveExpandVO.legalPersonValidityBegin = res.start_date && !!Date.parse(startDate) ? startDate : ''
              this.form.archiveExpandVO.legalPersonValidityEnd = res.end_date && !!Date.parse(endDate) ? endDate : ''
            }
          }
        })
        .catch(() => {})
      this.form[type][url] = res.data.path
    },
    setBankCardAndBase64(res, base64Code, type, url) {
      const OCRData = {
        image: base64Code.split(',')[1],
        imageCode: 'bank_card'
      }
      this.$message.success('正在进行图片解析')
      imageOCR(OCRData)
        .then(async res => {
          this.$message.success('图片解析成功')
          this.form.archiveExpandVO.bankCard = res.card_num
        })
        .catch(() => {})
      this.form[type][url] = res.data.path
    },
    uploadSuccess(res, type) {
      switch (type) {
        case 'archiveOtherVO.signboardUrl':
          this.form.archiveOtherVO.signboardUrl = res.data.path
          break
        case 'archiveOtherVO.cashierDesk':
          this.form.archiveOtherVO.cashierDesk = res.data.path
          break
        case 'archiveOtherVO.enterpriseInfoScreenshot':
          this.form.archiveOtherVO.enterpriseInfoScreenshot = res.data.path
          break
        case 'archiveOtherVO.businessSiteOneUrl':
          this.form.archiveOtherVO.businessSiteOneUrl = res.data.path
          break
        case 'archiveOtherVO.contractOfTenancy1':
          this.form.archiveOtherVO.contractOfTenancy1 = res.data.path
          break
        case 'archiveOtherVO.contractOfTenancy2':
          this.form.archiveOtherVO.contractOfTenancy2 = res.data.path
          break
        case 'archiveOtherVO.contractOfTenancy3':
          this.form.archiveOtherVO.contractOfTenancy3 = res.data.path
          break
        case 'archiveExpandVO.businessLicenseUrl':
          this.form.archiveExpandVO.businessLicenseUrl = res.data.path
          break
        case 'archiveExpandVO.bankCardFrontUrl':
          this.form.archiveExpandVO.bankCardFrontUrl = res.data.path
          break
        case 'archiveExpandVO.bankCardBackUrl':
          this.form.archiveExpandVO.bankCardBackUrl = res.data.path
          break
        case 'archiveExpandVO.openingPermitUrl':
          this.form.archiveExpandVO.openingPermitUrl = res.data.path
          break
        case 'archiveExpandVO.hardIdUrl':
          this.form.archiveExpandVO.hardIdUrl = res.data.path
          break
        case 'archiveOtherVO.cashreceiveIdFrontUrl':
          this.form.archiveOtherVO.cashreceiveIdFrontUrl = res.data.path
          break
        case 'archiveOtherVO.cashreceiveIdBackUrl':
          this.form.archiveOtherVO.cashreceiveIdBackUrl = res.data.path
          break
        case 'archiveOtherVO.publicAuthorization':
          this.form.archiveOtherVO.publicAuthorization = res.data.path
          break
        case 'archiveOtherVO.cardholderIdFrontUrl':
          this.form.archiveOtherVO.cardholderIdFrontUrl = res.data.path
          break
        case 'archiveOtherVO.cardholderIdBackUrl':
          this.form.archiveOtherVO.cardholderIdBackUrl = res.data.path
          break
        case 'archiveOtherVO.cardholderPhoto':
          this.form.archiveOtherVO.cardholderPhoto = res.data.path
          break
        case 'archiveOtherVO.privateAuthorization':
          this.form.archiveOtherVO.privateAuthorization = res.data.path
          break
        case 'archiveOtherVO.cardholderIdCardFront':
          this.form.archiveOtherVO.cardholderIdCardFront = res.data.path
          break
      }
    },
    merchantTypeChange(value) {
      if (value === 4) {
        this.form.archiveExpandVO.acctType = 1
      }
    },
    async shopRemoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (this.searchStringShop !== '' && value !== this.searchStringShop) {
        this.selectPageNoShop = 1
        this.searchStringShop = ''
        this.isMaxPageShop = false
        this.shopList = []
      }
      let data = {
        id: value,
        page: this.selectPageNoShop,
        rows: 10
      }
      try {
        const res = await queryShopListByPage(data)
        // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
        if (res.results && res.results.length !== 0) {
          this.shopList = this.shopList.concat(res.results)
          this.searchStringShop = value
          if (res.results?.length !== 10) {
            this.isMaxPageShop = true
          }
        }
      } catch (error) {}
    },
    async bankRemoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (!value || (this.searchStringBank !== '' && value !== this.searchStringBank)) {
        this.selectPageNoBank = 1
        this.searchStringBank = ''
        this.isMaxPageBank = false
        this.bankList = []
      }
      // 只有value有值的时候才去请求接口
      if (value) {
        let data = {
          bankName: value,
          page: this.selectPageNoBank,
          rows: 10
        }
        const res = await getBankCnapByName(data)
        // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
        if (res.results && res.results.length !== 0) {
          this.bankList = this.bankList.concat(res.results)
          this.searchStringBank = value
          if (res.results?.length !== 10) {
            this.isMaxPageBank = true
          }
        }
      }
    },
    shopLoadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPageShop) {
        this.selectPageNoShop++
        this.shopRemoteMethod(this.searchStringShop)
      }
    },
    bankLoadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPageBank) {
        this.selectPageNoBank++
        this.bankRemoteMethod(this.searchStringBank)
      }
    },
    // 如果点击了清除按钮则将相关数据清空
    shopClear() {
      this.isMaxPageShop = false
      this.shopList = []
      this.searchStringShop = ''
      this.selectPageNoShop = 1
    },
    bankClear() {
      this.isMaxPageBank = false
      this.bankList = []
      this.searchStringBank = ''
      this.selectPageNoBank = 1
    },
    // 每次focus都将相关数据清空
    shopFocus() {
      this.isMaxPageShop = false
      this.shopList = []
      this.searchStringShop = ''
      this.selectPageNoShop = 1
    },
    bankFocus() {
      this.isMaxPageBank = false
      this.bankList = []
      this.searchStringBank = ''
      this.selectPageNoBank = 1
    },
    shopChange(value) {
      this.form.archiveBaseVO.merchantId = value
      this.shopList?.forEach(item => {
        if (item.id === value) {
          this.form.archiveBaseVO.userId = item.userId
        }
      })
    },
    async bankChange(value) {
      this.form.archiveExpandVO.bankSub = value
      this.bankList?.forEach(item => {
        if (item.bcode === value) {
          this.form.archiveExpandVO.bankSubName = item.bname
        }
      })
      try {
        const res = await isShowRate({ code: value })
        this.isExchangeFeeRate = res
      } catch (error) {}
    },
    areaChange(value) {
      this.form.archiveBaseVO.province = value[0]
      this.form.archiveBaseVO.city = value[1]
      this.form.archiveBaseVO.area = value[2]
    },
    timeChange(value, bindvalue) {
      if (!value) {
        switch (bindvalue) {
          case 'licValidityBigen':
            this.form.archiveExpandVO.licValidityBigen = ''
            break
          case 'licValidityEnd':
            this.form.archiveExpandVO.licValidityBigen = ''
            break
          case 'legalPersonValidityBegin':
            this.form.archiveExpandVO.legalPersonValidityBegin = ''
            break
          case 'legalPersonValidityEnd':
            this.form.archiveExpandVO.legalPersonValidityEnd = ''
            break
        }
      }
    },
    bankAreaChange(value) {
      this.form.archiveExpandVO.bankProvince = value[0]
      this.form.archiveExpandVO.bankCity = value[1]
    },
    async getIndustrIdList() {
      try {
        const res = await getWftAllTrade()
        this.industrIdList = res
      } catch (error) {}
    },
    async getCertTypeList() {
      try {
        const res = await queryCertType()
        this.certTypeList = res
      } catch (error) {}
    },
    async toSave() {
      if (this.$route.query.isCopy) {
        this.form.archiveBaseVO.auditTime = ''
        this.form.archiveBaseVO.bossAuditTime = ''
        this.form.archiveBaseVO.createTime = ''
        this.form.archiveBaseVO.auditStatus = ''
        this.form.archiveBaseVO.useChannelCode = ''
      }
      this.$refs.form.validateField('archiveBaseVO.merchantId', async errorMessage => {
        if (!errorMessage) {
          try {
            this.checkArchive = true
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
    async toAdd() {
      const handleSubReview = async () => {
        if (this.$route.query.isCopy) {
          this.form.archiveBaseVO.auditTime = ''
          this.form.archiveBaseVO.bossAuditTime = ''
          this.form.archiveBaseVO.createTime = ''
          this.form.archiveBaseVO.auditStatus = ''
          this.form.archiveBaseVO.useChannelCode = ''
        }
        try {
          this.checkVerify = true
          await audit(this.form)
          this.$store.dispatch('delTagView', this.$route).then(() => {
            this.$router.push({ path: 'xftArchive' })
          })
          this.$message.success('提交成功')
        } catch (error) {
        } finally {
          this.checkVerify = false
        }
      }
      if (this.formYQDisabled) {
        const formYQValids = [
          'archiveBaseVO.merchantShortName',
          'archiveBaseVO.province',
          'archiveBaseVO.address',
          'archiveBaseVO.industrId',
          'archiveBaseVO.contactPhone',
          'archiveBaseVO.email',
          'archiveOtherVO.signboardUrl',
          'archiveOtherVO.cashierDesk',
          'archiveExpandVO.idFrontUrl',
          'archiveExpandVO.idBackUrl',
          'archiveExpandVO.legalPersonName',
          'archiveExpandVO.idNumber',
          'archiveExpandVO.legalPersonValidityBegin',
          'archiveExpandVO.bankCardFrontUrl',
          'archiveExpandVO.bankCardBackUrl',
          'archiveExpandVO.bankAccountName',
          'archiveExpandVO.bankCard',
          'archiveExpandVO.bankProvince',
          'archiveExpandVO.bankSub'
        ]
        Promise.all(
          formYQValids.map(item => {
            return new Promise(resolve => {
              this.$refs.form.validateField(item, error => {
                resolve(error)
              })
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
    toRefuse() {
      this.refuseForm.remark = ''
      this.refuseDialogVisible = true
    },
    toCancle() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ path: 'xftArchive' })
      })
    },
    refuseConfirm() {
      this.$refs.refuseForm.validate(async valid => {
        if (valid) {
          let data = {
            archiveId: this.$route.query.id,
            auditRemark: this.refuseForm.remark
          }
          try {
            await refuse(data)
            this.refuseDialogVisible = false
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ path: 'xftArchive' })
            })
            this.$message.success('操作成功')
          } catch (error) {}
        }
      })
    },
    async getDetail() {
      this.addLoading = true
      try {
        const res = await detail({ archiveId: Number(this.$route.query.id) })
        this.form.archiveBaseVO = res.archiveBaseDTO
        this.form.archiveExpandVO = res.archiveExpandDTO
        this.form.archiveOtherVO = res.archiveOtherDTO
        this.form.archiveExpandVO.cardType = 1
        this.areaList = [res.archiveBaseDTO.province, res.archiveBaseDTO.city, res.archiveBaseDTO.area]
        this.areaKey = Symbol('areaKey')
        this.bankAreaList = [res.archiveExpandDTO.bankProvince, res.archiveExpandDTO.bankCity]
        this.bankAreaKey = Symbol('bankAreaKey')
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
      } catch (error) {
      } finally {
        this.addLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.xft-add {
  border-top: 16px solid #f7f8fa;
  border-bottom: 72px solid #f7f8fa;
  background-color: #fff;
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
    font-weight: 500;
    color: #1f2e4d;
    line-height: 48px;
    border-bottom: 1px solid #e6e9f0;
  }
  .form-info {
    padding-top: 24px;
    .archive-form-item {
      .el-switch {
        line-height: 32px;
      }
      .el-form-item__content {
        width: 100%;
      }
    }
    ::v-deep.el-form-item {
      margin-bottom: 24px;
    }
  }
  &-template {
    padding-left: 12px;
    color: #3377ff;
    cursor: pointer;
  }
}
.bottom {
  width: calc(100% - 242px);
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
.xft-add-form {
  ::v-deep.el-input.is-disabled .el-input__inner {
    color: #212430 !important;
  }
  ::v-deep.el-radio__input.is-disabled + span.el-radio__label {
    color: #212430 !important;
  }
}
.e {
  &-preview {
    &-con {
      left: 35vw;
      right: 35vw;
      bottom: 20vh;
      top: 10vh;
      ::v-deep .el-image-viewer__mask {
        display: none;
      }
      ::v-deep .el-image-viewer__close {
        background-color: #606266;
        width: 44px;
        height: 44px;
        font-size: 30px;
      }
      ::v-deep .el-icon-circle-close:before {
        content: '\e6db';
        color: #fff;
      }
    }
  }
  &-icon {
    &-question {
      width: 18px;
      height: 18px;
      vertical-align: middle;
      margin-left: 10px;
    }
  }
}
.question-icon {
  display: inline-block;
  line-height: 32px;
  width: 16px;
}
</style>
