<template>
  <section class="p-wxArchive-con" v-loading="isDetailLoad">
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
                  style="width:240px"
                  v-if="pageAction === 'add' || ($route.query.isCopy && JSON.parse($route.query.isCopy))"
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
                <el-input v-model="form.archiveBaseVO.publicId" placeholder="请输入公众号APPID" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="businessSceneList.includes(2)">
              <el-form-item label="小程序APPID" prop="archiveBaseVO.appletId">
                <el-input v-model="form.archiveBaseVO.appletId" placeholder="请输入小程序APPID" style="width:240px"></el-input>
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
                <el-input v-model="form.archiveBaseVO.companyName" placeholder="请输入公司名称" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
                <el-input v-model="form.archiveBaseVO.merchantShortName" placeholder="请输入商户简称" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区" prop="archiveBaseVO.area">
                <area-select :key="areaKey" @change="value => handleArea('area', value)" :areaList="areaList"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址" prop="archiveBaseVO.address">
                <el-input v-model="form.archiveBaseVO.address" placeholder="请输入详细地址" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="archiveBaseVO.contact">
                <el-input v-model="form.archiveBaseVO.contact" placeholder="请输入联系人" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="archiveBaseVO.contactPhone">
                <el-input v-model="form.archiveBaseVO.contactPhone" placeholder="请输入联系人电话" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮箱" prop="archiveBaseVO.email">
                <el-input v-model="form.archiveBaseVO.email" placeholder="请输入邮箱" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
                <upload-pic
                  alt="门店门头照"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.signboardUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'signboardUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.signboardUrl)"
                >
                </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照1" prop="archiveOtherVO.businessSiteOneUrl">
                <upload-pic
                  alt="经营场所照1"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.businessSiteOneUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteOneUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteOneUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照2" prop="archiveOtherVO.businessSiteTwoUrl">
                <upload-pic
                  alt="经营场所照2"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.businessSiteTwoUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteTwoUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteTwoUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照3" prop="archiveOtherVO.businessSiteThreeUrl">
                <upload-pic
                  alt="经营场所照3"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.businessSiteThreeUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteThreeUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteThreeUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="经营场地证明">
                <upload-pic
                  alt="经营场地证明"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.businessSiteUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="补充资料1">
                <upload-pic
                  alt="补充资料1"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.additionalOneUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'additionalOneUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.additionalOneUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="补充资料2">
                <upload-pic
                  alt="补充资料2"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.additionalTwoUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'additionalTwoUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.additionalTwoUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="补充说明" prop="archiveOtherVO.additionalRemark">
                <el-input v-model="form.archiveOtherVO.additionalRemark" type="textarea" :autosize="{ minRows: 3 }" resize="none" style="width: 240px"></el-input>
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
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.businessLicenseUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'businessLicenseUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.businessLicenseUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类目特殊资质">
                <upload-pic
                  alt="类目特殊资质"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.typeAptitudeUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'typeAptitudeUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.typeAptitudeUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照注册号" prop="archiveExpandVO.licId">
                <el-input v-model="form.archiveExpandVO.licId" placeholder="营业执照注册号" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照有效期" prop="archiveExpandVO.licValidityBigen">
                <el-date-picker v-model="form.archiveExpandVO.licValidityBigen" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.licValidityEnd && pageAction === 'detail'">长期有效</span>
                <el-date-picker v-else v-model="form.archiveExpandVO.licValidityEnd" type="date" clearable placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="经营范围" prop="archiveExpandVO.businessScope">
                <el-input
                  v-model="form.archiveExpandVO.businessScope"
                  type="textarea"
                  :autosize="{ minRows: 3 }"
                  maxlength="140"
                  show-word-limit
                  placeholder="会写入商户合同条款或用于后续公众号展示，请谨慎填写"
                  style="width: 240px"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.archiveBaseVO.archiveType === 9">
              <el-form-item label="经营类目">
                <el-cascader ref="cascader" :options="businessOptions" @change="handleBusinessCategory" style="width: 240px"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="售卖商品描述" prop="archiveExpandVO.sellShopDescribe">
                <el-input v-model="form.archiveExpandVO.sellShopDescribe" type="textarea" :autosize="{ minRows: 3 }" maxlength="140" show-word-limit style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="组织机构代码号" prop="archiveExpandVO.orgInstitutionCode">
                <el-input v-model="form.archiveExpandVO.orgInstitutionCode" placeholder="组织机构代码号" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="组织机构代码有效期" prop="archiveExpandVO.orgInstitutionBigen">
                <el-date-picker v-model="form.archiveExpandVO.orgInstitutionBigen" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.orgInstitutionEnd && pageAction === 'detail'">长期有效</span>
                <el-date-picker v-else v-model="form.archiveExpandVO.orgInstitutionEnd" type="date" clearable placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="组织机构代码证" prop="archiveExpandVO.orgInstitutionUrl">
                <upload-pic
                  alt="组织机构代码证"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.orgInstitutionUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'orgInstitutionUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.orgInstitutionUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.archiveExpandVO.licType === 2">
              <el-form-item label="税务登记证" prop="archiveExpandVO.taxRegistrationUrl">
                <upload-pic
                  alt="税务登记证"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.taxRegistrationUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'taxRegistrationUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.taxRegistrationUrl)"
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
                <el-input v-model="form.archiveExpandVO.legalPersonName" placeholder="法人姓名" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件类型" prop="archiveExpandVO.idType">
                <el-select clearable v-model="form.archiveExpandVO.idType" placeholder="全部" style="width: 240px">
                  <el-option label="身份证" :value="1"></el-option>
                  <el-option label="护照" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码" prop="archiveExpandVO.idNumber">
                <el-input v-model="form.archiveExpandVO.idNumber" placeholder="" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件有效期" prop="archiveExpandVO.idBegin">
                <el-date-picker v-model="form.archiveExpandVO.idBegin" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.idEnd && pageAction === 'detail'">长期有效</span>
                <el-date-picker v-else v-model="form.archiveExpandVO.idEnd" type="date" clearable placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证正面照" prop="archiveExpandVO.idFrontUrl">
                <upload-pic
                  alt="身份证正面照"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.idFrontUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'idFrontUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.idFrontUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证背面照" prop="archiveExpandVO.idBackUrl">
                <upload-pic
                  alt="身份证背面照"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.idBackUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'idBackUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.idBackUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手持身份证正面照" prop="archiveExpandVO.hardIdUrl">
                <upload-pic
                  alt="手持身份证正面照"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.hardIdUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'hardIdUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.hardIdUrl)"
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
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.openingPermitUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'openingPermitUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.openingPermitUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-if="form.archiveBaseVO.merchantType === 1">
              <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
                <upload-pic
                  alt="银行卡正面照"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.bankCardFrontUrl"
                  :exampleImg="exampleImg"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'bankCardFrontUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardFrontUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行" prop="archiveExpandVO.bank">
                <el-select v-model="form.archiveExpandVO.bank" filterable clearable remote reserve-keyword placeholder="请输入关键词" :remote-method="handleBankRemote" style="width: 240px">
                  <el-option v-for="item in bankOptions" :key="item.bankCode" :label="item.bankName" :value="item.bankCode"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属支行" prop="archiveExpandVO.bankSub">
                <el-select v-model="form.archiveExpandVO.bankSub" filterable clearable remote reserve-keyword placeholder="请输入关键词" :remote-method="handleBranchRemote" style="width: 240px">
                  <el-option v-for="item in branchOptions" :key="item.bCode" :label="item.bName" :value="item.bCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="archiveExpandVO.bankCard">
                <el-input v-model="form.archiveExpandVO.bankCard" placeholder="" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账户名" prop="archiveExpandVO.bankAccountName">
                <el-input v-model="form.archiveExpandVO.bankAccountName" placeholder="" style="width:240px"></el-input>
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
                <el-select v-model="form.archiveBaseVO.fixFeeRate" placeholder="请选择" style="width:240px">
                  <el-option v-for="item in rateOptions" :key="item.value" :label="item.lable" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </section>
    <div class="p-wxArchive-action" v-if="detailStatusArr.includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'">
      <el-button size="small" type="primary" plain class="e-wxArchive-action_pd" @click="handleArchive" v-if="[0, 1, 4, 8].includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'"
        >保存</el-button
      >
      <el-button size="small" type="primary" class="e-wxArchive-action_pd" @click="handleVerify" v-if="detailStatusArr.includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'"
        >提交审核</el-button
      >
      <el-button size="small" class="e-wxArchive-action_pd" @click="isReason = true" v-if="[2].includes(form.archiveBaseVO.auditStatus)">拒绝</el-button>
      <el-button size="small" class="e-wxArchive-action_pd" @click="$router.push('wxArchive')" v-if="detailStatusArr.includes(form.archiveBaseVO.auditStatus) || pageAction === 'add'">取消</el-button>
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
    <!-- image-preview -->
    <el-image ref="imageViewer" :src="previewSrc" :preview-src-list="previewList" class="e-preview-con"></el-image>
  </section>
</template>

<script>
import selectPage from '@/components/selectPage/selectPage'
import uploadPic from '../components/uploadPic'
import areaSelect from '@/components/areaSelect'
import { queryShopListByPage, queryBankPage, submit, detail, submitToVerify, refund, queryBranchPage, businessCategory } from '@/api/wxArchive'
import fileServer from '@/mixins/fileServe'
import { detailValidate, formObj, rateOptions, refundForm, refundRules } from './index'
import { filterReview } from './filters/reviewStatus'
import { deepClone } from '@/utils'

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
      isDetailLoad: false,
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
      bankAreaList: [],
      bankOptions: [],
      branchOptions: [],
      businessOptions: [],
      previewList: [],
      previewSrc: ''
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
      vm.getBankPage()
      vm.getBranchPage()
      vm.getBusinessCategory()
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$refs.form.resetFields()
    next()
  },
  methods: {
    handleImgPreview(url) {
      if (this.formDisabled && url) {
        this.previewList = []
        this.previewSrc = ''
        let imgList = document.querySelectorAll('.avatar')
        for (let i = 0; i < imgList.length; i++) {
          this.previewList.push(imgList[i].src)
        }
        this.previewSrc = this.previewList.find(item => item === url)
        this.$nextTick(() => {
          this.$refs.imageViewer.clickHandler()
        })
      }
    },
    handleBusinessCategory(val) {
      let one
      let two
      this.businessOptions.forEach(item => {
        if (val[0] === item.value) {
          one = item
          two = item.children
        }
      })
      two &&
        two.forEach(item => {
          if (val[1] === item.value) {
            two = item
          }
        })
      this.form.archiveBaseVO.businessCategoryRemark = one.label + '/' + two.label
      this.form.archiveBaseVO.businessCategory = this.$refs.cascader.getCheckedNodes()[0].value
    },
    getBusinessCategory: async function() {
      const res = await businessCategory()
      let data = []
      res.forEach(item => {
        if (item.parentId === 0) {
          data.push({
            value: item.id,
            label: item.tradeName,
            children: []
          })
        }
      })
      data.forEach(item => {
        res.forEach(children => {
          if (item.value === children.parentId) {
            item.children.push({
              value: children.tradeCode,
              label: children.tradeName
            })
          }
        })
      })
      this.businessOptions = data
    },
    handleBankRemote(query) {
      if (query !== '') {
        this.getBankPage(query)
      }
    },
    getBankPage: async function(bankName = '') {
      const data = { page: 1, rows: 100, bankName }
      const res = await queryBankPage(data)
      this.bankOptions = res.results
    },
    handleBranchRemote(query) {
      if (query !== '') {
        this.getBranchPage(query)
      }
    },
    getBranchPage: async function(bName = '') {
      const data = {
        page: 1,
        rows: 100,
        bCode: '',
        bName
      }
      const res = await queryBranchPage(data)
      this.branchOptions = res.results
    },
    handleRefund() {
      this.$refs.refundForm.validate(async valid => {
        if (valid) {
          const data = {
            archiveId: this.$route.query.id,
            auditRemark: this.refundForm.remark
          }
          try {
            const res = await refund(data)
            // this.$store.dispatch('delTagView', this.$route).then(() => {
            //   this.$router.push({ name: 'wxArchive' })
            // })
            this.handleDetail()
            this.isReason = false
            this.$message.success('操作成功')
          } catch (error) {}
        }
      })
    },
    handleVerify: async function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            const res = await submitToVerify(this.form)
            // this.$store.dispatch('delTagView', this.$route).then(() => {
            //   this.$router.push({ name: 'wxArchive' })
            // })
            this.$message.success('新增成功')
          } catch (error) {}
        }
      })
    },
    handleDetail: async function() {
      try {
        this.isDetailLoad = true
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
      } catch (error) {
      } finally {
        this.isDetailLoad = false
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
      this.$refs.form.validateField('archiveBaseVO.merchantId', async errorMessage => {
        if (!errorMessage) {
          try {
            const res = await submit(this.form)
            // this.$store.dispatch('delTagView', this.$route).then(() => {
            //   this.$router.push({ name: 'wxArchive' })
            // })
            this.$message.success('新增成功')
          } catch (error) {}
        }
      })
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
  &-preview {
    &-con {
      width: 100px;
      height: 100px;
      /deep/ .el-image-viewer__mask {
        display: none;
      }
      /deep/ .el-image-viewer__wrapper {
        left: 35vw;
        right: 35vw;
        bottom: 20vh;
        top: 10vh;
      }
      /deep/ .el-image-viewer__close {
        background-color: #606266;
        width: 44px;
        height: 44px;
        font-size: 30px;
      }
      /deep/ .el-icon-circle-close:before {
        content: '\e6db';
        color: #fff;
      }
    }
  }
}
</style>
