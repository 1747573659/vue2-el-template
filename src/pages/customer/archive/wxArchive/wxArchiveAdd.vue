<template>
  <section class="p-wxArchive-con" v-loading="isDetailLoad" v-permission.page="'WXARCHIVE_LIST_EDIT,WXARCHIVE_LIST_ADD'">
    <!-- <header v-if="pageAction && pageAction !== 'add' && $route.query.status !== 'copy'">
      <el-row v-if="pageAction === 'detail' && $route.query.status !== 'copy'">
        <el-col :span="12" v-if="form.archiveBaseVO.directAuditStatus !== ''">
          <label>进件状态：</label>
          <span class="e-wxArchive-status_pd e-wxArchive-warning">{{ form.archiveBaseVO.directAuditStatus | filterStatus(direAuditStatusOptions) }}</span>
        </el-col>
        <el-col :span="12" v-if="form.archiveBaseVO.auditRemark !== '' && [1, 4].includes(form.archiveBaseVO.directAuditStatus)">
          <label>审核结果：</label>
          <el-tooltip effect="dark" :content="form.archiveBaseVO.auditRemark" placement="top">
            <span class="e-wxArchive-review">{{ form.archiveBaseVO.auditRemark }}</span>
          </el-tooltip>
        </el-col>
      </el-row>
    </header> -->

    <el-form ref="form" :model="form" :rules="rules" :disabled="checkFormDisabled" size="small" label-suffix=":" :inline="true" label-width="210px">
      <div class="p-wxArchive-item">
        <header>基本信息</header>
        <el-row class="p-wxArchive-baseInfo">
          <el-col :span="12">
            <el-form-item label="商户名称" prop="archiveBaseVO.merchantId">
              <select-page
                style="width:240px"
                v-if="pageAction === 'add'"
                :isMaxPage="isMaxPage"
                :options="selectOptions"
                @remoteMethod="remoteSelect"
                @selectPageMore="selectPageMore('merchant')"
                @resetSelectPage="resetSelectPage"
                @changeSelectPage="changeSelectPage"
                label="companyName"
                value="id"
                :echoValue="form.archiveBaseVO.merchantName"
                placeholder="商户名称"
              ></select-page>
              <span v-else>{{ form.archiveBaseVO.merchantName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商户类型" prop="archiveBaseVO.merchantType">
              <el-radio-group v-model="form.archiveBaseVO.merchantType" @change="handleMerchantType">
                <!-- <el-radio :label="5">
                  <span>小微</span>
                  <el-tooltip effect="dark" content="无营业执照、免办理工商注册登记的实体商户" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-radio> -->
                <el-radio :label="1">
                  <span>个体工商户</span>
                  <el-tooltip effect="dark" content="营业执照上的主体类型一般为个体户、个体工商户、个体经营" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-radio>
                <el-radio :label="2">
                  <span>企业</span>
                  <el-tooltip effect="dark" content="营业执照上的主体类型一般为有限公司、有限责任公司" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经营场景">
              <el-checkbox-group v-model="businessSceneList">
                <el-checkbox :label="1">公众号</el-checkbox>
                <el-checkbox :label="2">小程序</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="businessSceneList.includes(1)">
            <el-form-item label="公众号APPID" prop="archiveBaseVO.publicId">
              <el-input v-model="form.archiveBaseVO.publicId" placeholder="公众号APPID" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="businessSceneList.includes(2)">
            <el-form-item label="小程序APPID" prop="archiveBaseVO.appletId">
              <el-input v-model="form.archiveBaseVO.appletId" placeholder="小程序APPID" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="证件类型" prop="archiveExpandVO.licType">
              <el-radio-group v-model="form.archiveExpandVO.licType">
                <el-radio :label="1">已三证合一</el-radio>
                <el-radio :label="2">非三证合一</el-radio>
              </el-radio-group>
              <el-tooltip effect="dark" placement="top-start">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
                <template #content
                  ><span>若营业执照注册号为18位统一社会信用代码，请选择“已三证合一”，<br />否则请选择“非三证合一”</span></template
                >
              </el-tooltip>
            </el-form-item>
          </el-col>
          <template v-if="form.archiveBaseVO.merchantType !== 5">
            <el-col :span="24">
              <el-form-item label="营业执照" prop="archiveExpandVO.businessLicenseUrl">
                <upload-pic
                  alt="营业执照"
                  :hasBase64="true"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.businessLicenseUrl"
                  :exampleImg="exampleImg.businessLicenseUrl"
                  uploadUrlPath="/uploadFile"
                  @on-success="(value, base64Code) => setBusinessLicenseAndBase64(value, base64Code, 'archiveExpandVO', 'businessLicenseUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.businessLicenseUrl)"
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
                <el-date-picker
                  v-model="form.archiveExpandVO.licValidityBigen"
                  type="date"
                  clearable
                  placeholder="开始日期"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                ></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.licValidityEnd && checkFormDisabled && pageAction === 'detail'">长期有效</span>
                <el-date-picker
                  v-else
                  v-model="form.archiveExpandVO.licValidityEnd"
                  type="date"
                  clearable
                  placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                ></el-date-picker>
                <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </template>
          <!-- <el-col :span="24">
            <el-form-item label="经营范围" prop="archiveExpandVO.businessScope">
              <el-input
                v-model="form.archiveExpandVO.businessScope"
                type="textarea"
                :autosize="{ minRows: 3 }"
                maxlength="140"
                show-word-limit
                placeholder="会写入商户合同条款或用于后续公众号展示，请谨慎填写"
                class="e-wxArchive-textarea"
                style="width: 240px"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="经营类目">
              <el-cascader ref="cascader" v-model="businessCategory" :options="businessOptions" @change="handleBusinessCategory" style="width: 240px"></el-cascader>
              <!-- <el-cascader :options="tagSelOption" v-model="ruleForm.businessCategory" @change="handleChange"></el-cascader> -->
              <!-- <el-tooltip effect="dark" content="选择线下零售/食品生鲜、休闲娱乐/美发/美容/美甲店、线下零售/批发业时，请填写售卖商品描述" placement="top">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip> -->
            </el-form-item>
          </el-col>
          <el-col
            :span="24"
            v-if="
              form.archiveBaseVO.merchantType === 5 && ['线下零售/食品生鲜', '休闲娱乐/美发/美容/美甲店', '线下零售/批发业'].includes(form.archiveBaseVO.businessCategoryRemark)
            "
          >
            <el-form-item label="售卖商品描述" prop="archiveExpandVO.sellShopDescribe">
              <el-input v-model="form.archiveExpandVO.sellShopDescribe" type="textarea" :autosize="{ minRows: 3 }" maxlength="140" show-word-limit style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <template v-if="form.archiveExpandVO.licType === 2">
            <el-col :span="12">
              <el-form-item label="组织机构代码号" prop="archiveExpandVO.orgInstitutionCode">
                <el-input v-model="form.archiveExpandVO.orgInstitutionCode" placeholder="组织机构代码号" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构代码有效期" prop="archiveExpandVO.orgInstitutionBigen">
                <el-date-picker
                  v-model="form.archiveExpandVO.orgInstitutionBigen"
                  type="date"
                  clearable
                  placeholder="开始日期"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                ></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.orgInstitutionEnd && checkFormDisabled && pageAction === 'detail'">长期有效</span>
                <el-date-picker
                  v-else
                  v-model="form.archiveExpandVO.orgInstitutionEnd"
                  type="date"
                  clearable
                  placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  style="width: 140px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构代码证" prop="archiveExpandVO.orgInstitutionUrl">
                <upload-pic
                  alt="组织机构代码证"
                  :showExample="false"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.orgInstitutionUrl"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'orgInstitutionUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.orgInstitutionUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税务登记证" prop="archiveExpandVO.taxRegistrationUrl">
                <upload-pic
                  alt="税务登记证"
                  :showExample="false"
                  :fileServer="fileServer"
                  :imagePath="form.archiveExpandVO.taxRegistrationUrl"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'taxRegistrationUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.taxRegistrationUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="archiveBaseVO.companyName">
              <el-input v-model="form.archiveBaseVO.companyName" placeholder="公司名称" style="width:240px"></el-input>
              <el-tooltip effect="dark" content="公司名称必须与营业执照一致" placement="top">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
              <el-input v-model="form.archiveBaseVO.merchantShortName" placeholder="商户简称" style="width:240px"></el-input>
              <el-tooltip effect="dark" content="商户简称在消费者付款成功页展示，请认真填写" placement="top">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司地址" prop="archiveBaseVO.area">
              <area-select :key="areaKey" @change="value => handleArea('area', value)" :areaList="areaList"></area-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="archiveBaseVO.address">
              <el-input v-model="form.archiveBaseVO.address" placeholder="详细地址" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="archiveBaseVO.contact">
              <el-input v-model="form.archiveBaseVO.contact" placeholder="联系人" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="archiveExpandVO.administratorIdCard">
              <el-input v-model="form.archiveExpandVO.administratorIdCard" placeholder="证件号码" style="width:240px"></el-input>
              <el-tooltip effect="dark" placement="top-start">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
                <template #content>
                  <p>请填写超级管理员的证件号码，可传身份证、来往内地通行证、来往大陆通行证、护照等证件号码，超级管理员签约时，</p>
                  <p>校验微信号绑定的银行卡实名信息，是否与该证件号码一致。</p>
                </template>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人电话" prop="archiveBaseVO.contactPhone">
              <el-input v-model="form.archiveBaseVO.contactPhone" placeholder="联系人电话" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="archiveBaseVO.email">
              <el-input v-model="form.archiveBaseVO.email" placeholder="邮箱" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
              <upload-pic
                alt="门店门头照"
                :fileServer="fileServer"
                :imagePath="form.archiveOtherVO.signboardUrl"
                :exampleImg="exampleImg.signboardUrl"
                uploadUrlPath="/uploadFile"
                @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'signboardUrl')"
                @click="handleImgPreview(fileServe + form.archiveOtherVO.signboardUrl)"
              >
              </upload-pic>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="经营场所照1" prop="archiveOtherVO.businessSiteOneUrl">
              <upload-pic
                alt="经营场所照1"
                :fileServer="fileServer"
                :imagePath="form.archiveOtherVO.businessSiteOneUrl"
                :exampleImg="exampleImg.businessSiteOneUrl"
                uploadUrlPath="/uploadFile"
                @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteOneUrl')"
                @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteOneUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="经营场所照2" prop="archiveOtherVO.businessSiteTwoUrl">
              <upload-pic
                alt="经营场所照2"
                :fileServer="fileServer"
                :imagePath="form.archiveOtherVO.businessSiteTwoUrl"
                :exampleImg="exampleImg.businessSiteTwoUrl"
                uploadUrlPath="/uploadFile"
                @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteTwoUrl')"
                @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteTwoUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="12">
            <el-form-item label="经营场所照3" prop="archiveOtherVO.businessSiteThreeUrl">
              <upload-pic
                alt="经营场所照3"
                :fileServer="fileServer"
                :imagePath="form.archiveOtherVO.businessSiteThreeUrl"
                :exampleImg="exampleImg.businessSiteThreeUrl"
                uploadUrlPath="/uploadFile"
                @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteThreeUrl')"
                @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteThreeUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col> -->
          <template v-if="form.archiveBaseVO.merchantType === 5">
            <el-col :span="12">
              <el-form-item label="经营场地证明">
                <upload-pic
                  alt="经营场地证明"
                  :showExample="false"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.businessSiteUrl"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'businessSiteUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补充资料1">
                <upload-pic
                  alt="补充资料1"
                  :showExample="false"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.additionalOneUrl"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'additionalOneUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.additionalOneUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补充资料2">
                <upload-pic
                  alt="补充资料2"
                  :showExample="false"
                  :fileServer="fileServer"
                  :imagePath="form.archiveOtherVO.additionalTwoUrl"
                  uploadUrlPath="/uploadFile"
                  @on-success="value => setUploadSrc(value, 'archiveOtherVO', 'additionalTwoUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.additionalTwoUrl)"
                ></upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="补充说明" prop="archiveOtherVO.additionalRemark">
                <el-input v-model="form.archiveOtherVO.additionalRemark" type="textarea" :autosize="{ minRows: 3 }" resize="none" style="width: 240px"></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </div>
      <div class="p-wxArchive-item">
        <header>法人信息</header>
        <el-row class="p-wxArchive-baseInfo">
          <el-col :span="12">
            <el-form-item label="身份证正面照" prop="archiveExpandVO.idFrontUrl">
              <upload-pic
                alt="身份证正面照"
                :hasBase64="true"
                :fileServer="fileServer"
                :imagePath="form.archiveExpandVO.idFrontUrl"
                :exampleImg="exampleImg.idFrontUrl"
                uploadUrlPath="/uploadFile"
                @on-success="(value, base64Code) => setIdCardAndBase64(value, base64Code, 'archiveExpandVO', 'idFrontUrl', 'face')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.idFrontUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证背面照" prop="archiveExpandVO.idBackUrl">
              <upload-pic
                alt="身份证背面照"
                :hasBase64="true"
                :fileServer="fileServer"
                :imagePath="form.archiveExpandVO.idBackUrl"
                :exampleImg="exampleImg.idBackUrl"
                uploadUrlPath="/uploadFile"
                @on-success="(value, base64Code) => setIdCardAndBase64(value, base64Code, 'archiveExpandVO', 'idBackUrl', 'back')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.idBackUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="法人姓名" prop="archiveExpandVO.legalPersonName">
              <el-input v-model="form.archiveExpandVO.legalPersonName" placeholder="法人姓名" style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="archiveExpandVO.idType">
              <el-select clearable v-model="form.archiveExpandVO.idType" placeholder="证件类型" style="width: 240px">
                <el-option label="身份证" value="1"></el-option>
                <el-option label="护照" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="archiveExpandVO.idNumber">
              <el-input v-model="form.archiveExpandVO.idNumber" placeholder="证件号码" style="width: 240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件有效期" prop="archiveExpandVO.idBegin">
              <el-date-picker v-model="form.archiveExpandVO.idBegin" type="date" clearable placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
              <span style="margin: 0 10px;">至</span>
              <span v-if="!form.archiveExpandVO.idEnd && checkFormDisabled && pageAction === 'detail'">长期有效</span>
              <el-date-picker
                v-else
                v-model="form.archiveExpandVO.idEnd"
                type="date"
                clearable
                placeholder="结束日期"
                value-format="yyyy-MM-dd"
                style="width: 140px"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="p-wxArchive-item">
        <header>结算账号</header>
        <el-row class="p-wxArchive-baseInfo">
          <el-col :span="24">
            <el-form-item label="账户类型" prop="archiveExpandVO.acctType">
              <el-radio-group v-model="form.archiveExpandVO.acctType">
                <el-radio :label="1" :disabled="form.archiveBaseVO.merchantType === 5">
                  <span>对公银行账号</span>
                  <el-tooltip effect="dark" content="你为经营者对公银行账户，请务必填写开户名为的银行账号" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-radio>
                <el-radio :label="2" :disabled="form.archiveBaseVO.merchantType === 2" v-if="form.archiveBaseVO.merchantType === 1">
                  <span>经营者个人银行卡</span>
                  <el-tooltip effect="dark" content="你为经营者个人银行卡，请务必填写开户名为的银行账号" placement="top">
                    <img :src="questionIcon" alt="提示" class="e-icon-question" />
                  </el-tooltip>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.archiveBaseVO.merchantType === 2 || form.archiveExpandVO.acctType === 1">
            <el-form-item label="开户许可证" prop="archiveExpandVO.openingPermitUrl">
              <upload-pic
                alt="开户许可证"
                :fileServer="fileServer"
                :imagePath="form.archiveExpandVO.openingPermitUrl"
                uploadUrlPath="/uploadFile"
                :exampleImg="exampleImg.openingPermitUrl"
                @on-success="value => setUploadSrc(value, 'archiveExpandVO', 'openingPermitUrl')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.openingPermitUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
              <upload-pic
                alt="银行卡正面照"
                :hasBase64="true"
                :fileServer="fileServer"
                :imagePath="form.archiveExpandVO.bankCardFrontUrl"
                :exampleImg="exampleImg.bankCardFrontUrl"
                uploadUrlPath="/uploadFile"
                @on-success="(value, base64Code) => setBankCardAndBase64(value, base64Code, 'archiveExpandVO', 'bankCardFrontUrl')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardFrontUrl)"
              ></upload-pic>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="银行账号" prop="archiveExpandVO.bankCard">
              <el-input v-model="form.archiveExpandVO.bankCard" placeholder="银行账号" style="width:240px"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="archiveExpandVO.bank">
              <selectCopy
                :remoteMethod="handleBankRemote"
                @focus="handleBankPage"
                style="width: 240px"
                :value.sync="form.archiveExpandVO.bank"
                filterable
                clearable
                remote
                reserveKeyword
                placeholder="开户行"
                :options="bankOptions"
                :optionsItem="{ key: 'bankCode', label: 'bankName', value: 'bankCode' }"
              >
              </selectCopy>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户名称" prop="archiveExpandVO.bankAccountName">
              <el-input v-model="form.archiveExpandVO.bankAccountName" placeholder="账户名" style="width:240px"></el-input>
              <el-tooltip effect="dark" content="营业执照上的主体类型一般为有限公司、有限责任公司" placement="top">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
                <template #content>
                  <p>1、选择“经营者个人银行卡”时，开户名称必须与“法人姓名”一致。</p>
                  <p>2、选择“对公银行账户”时，开户名称必须与营业执照/登记证书的“商户名称”一致。</p>
                </template>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户支行" prop="archiveExpandVO.bankSub">
              <selectCopy
                ref="bankSub"
                isCopy
                style="width: 240px"
                :remoteMethod="handleBranchRemote"
                :value.sync="form.archiveExpandVO.bankSubName"
                @focus="handleBranchPage"
                @change="handleBankChange"
                filterable
                clearable
                reserveKeyword
                remote
                placeholder="开户支行"
                :options="branchOptions"
                :optionsItem="{ key: 'bCode', label: 'bName', value: 'bCode' }"
              >
              </selectCopy>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户支行省市区/县" prop="archiveExpandVO.bankArea">
              <area-select :key="bankAreaKey" @change="value => handleArea('bankArea', value)" :areaList="bankAreaList"></area-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="p-wxArchive-item">
        <header>费率设置</header>
        <el-row class="p-wxArchive-baseInfo">
          <el-col :span="12">
            <el-form-item label="费率" prop="archiveBaseVO.fixFeeRate">
              <el-select v-model="form.archiveBaseVO.fixFeeRate" :disabled="isMicro" placeholder="费率" style="width:240px">
                <el-option v-for="item in rateOptions" :key="item.value" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <div class="p-wxArchive-action">
      <template v-if="pageAction === 'add' || $route.query.status === 'copy' || detailStatusArr.includes(form.archiveBaseVO.directAuditStatus)">
        <template v-if="form.archiveBaseVO.directAuditStatus === 3">
          <el-button size="small" type="primary" class="e-wxArchive-action_pd" @click="handleDirectAuditStatus(form.archiveBaseVO.id)">撤销</el-button>
        </template>
        <template v-else>
          <el-button v-if="form.archiveBaseVO.directAuditStatus !== 6" size="small" type="primary" class="e-wxArchive-action_pd" @click="handleVerify">提交</el-button>
          <template v-if="[1].includes(form.archiveBaseVO.directAuditStatus) && $route.query.status !== 'copy'">
            <el-button size="small" class="e-wxArchive-action_pd" @click="isReason = true">拒绝</el-button>
          </template>
          <el-button size="small" type="primary" plain class="e-wxArchive-action_pd" @click="handleArchive">
            {{ [1, 10].includes(form.archiveBaseVO.directAuditStatus) && checkFormDisabled ? '编辑' : '保存' }}
          </el-button>
        </template>
      </template>
      <el-button size="small" class="e-wxArchive-action_pd" @click="handleCancel">取消</el-button>
    </div>
    <!-- dialog -->
    <el-dialog append-to-body :visible.sync="isReason" title="拒绝原因" width="507px" :close-on-press-escape="false">
      <el-form ref="refundForm" :model="refundForm" :rules="refundRules" label-width="60px">
        <el-form-item label="原因" prop="remark" class="e-dialog-remark">
          <el-input type="textarea" v-model="refundForm.remark" :rows="4" placeholder="请输入审核不能过的原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isReason = false" size="small" class="e-wxArchive-action_pd">取消</el-button>
        <el-button @click="handleRefund" type="primary" size="small" class="e-wxArchive-action_pd">确定</el-button>
      </div>
    </el-dialog>
    <!-- image-preview -->
    <el-image-preview
      ref="imageViewer"
      v-if="showViewer"
      :initial-index="imageIndex"
      :url-list="previewList"
      :on-close="handleClosePreview"
      class="e-preview-con"
    ></el-image-preview>
  </section>
</template>

<script>
import selectPage from '@/components/selectPage/selectPage'
import uploadPic from '../components/uploadPic'
import areaSelect from '@/components/areaSelect'
import fileServer from '@/mixins/fileServe'
import selectCopy from '@/components/selectCopy'
import { detailValidate, formObj, rateOptions, refundForm, refundRules } from './index'
import { filterStatus } from './filters'
import { deepClone } from '@/utils'
import ElImagePreview from 'element-ui/packages/image/src/image-viewer'
import {
  queryShopListByPage,
  queryBankPage,
  submit,
  detail,
  submitToVerify,
  refund,
  queryBranchPage,
  businessCategory,
  imageOCR,
  updateArchiveBaseDirectAuditStatus
} from '@/api/wxArchive'

export default {
  name: 'wxArchiveAdd',
  mixins: [fileServer],
  components: {
    selectPage,
    uploadPic,
    areaSelect,
    ElImagePreview,
    selectCopy
  },
  filters: {
    filterStatus
  },
  data() {
    return {
      questionIcon: require('@/assets/images/icon/questioin.png'),
      rateOptions,
      refundForm,
      refundRules,
      pageAction: this.$route.query.action,
      selectOptions: [],
      searchString: '',
      isMaxPage: false,
      isDetailLoad: false,
      form: {},
      businessCategory: [],
      rules: detailValidate,
      businessSceneList: [],
      statusList: [],
      selectPageNo: 1,
      checkFormDisabled: false,
      exampleImg: {
        signboardUrl: require('@/assets/images/xftArchive/store_front.png'),
        businessSiteOneUrl: require('@/assets/images/xftArchive/shop_cash.png'),
        businessSiteTwoUrl: require('@/assets/images/xftArchive/shop_in.png'),
        businessSiteThreeUrl: require('@/assets/images/xftArchive/goods.png'),
        businessLicenseUrl: require('@/assets/images/xftArchive/business_license.jpg'),
        idFrontUrl: require('@/assets/images/xftArchive/idcard_front.png'),
        idBackUrl: require('@/assets/images/xftArchive/idcard_back.png'),
        hardIdUrl: require('@/assets/images/xftArchive/people_id.png'),
        bankCardFrontUrl: require('@/assets/images/xftArchive/bank_card.png'),
        openingPermitUrl: require('@/assets/images/xftArchive/licence_for_opening_accounts.png')
      },
      isReason: false,
      detailStatusArr: [0, 1, 2, 3, 4, 6, 8, 10],
      areaKey: Symbol('areaKey'),
      bankAreaKey: Symbol('bankAreaKey'),
      areaList: [],
      bankAreaList: [],
      bankOptions: [],
      branchOptions: [],
      businessOptions: [],
      previewList: [],
      showViewer: false,
      imageIndex: 0,
      isMicro: true,
      direAuditStatusOptions: JSON.parse(sessionStorage.direAuditStatusOptions)
    }
  },
  created() {
    this.form = deepClone(formObj)
  },
  mounted() {
    this.$nextTick(() => {
      const tags = { edit: '编辑', detail: '详情', copy: '新增' }
      let pageStatus = this.$route.query.status ? tags[this.$route.query.status] : '新增'
      document.querySelector('.e-tag_active span').innerText = `普通资质进件/${pageStatus}`
    })
    this.remoteSelect()
    this.getBankPage()
    this.getBranchPage()
    this.getBusinessCategory()
    if (this.pageAction === 'detail') this.handleDetail()
  },
  methods: {
    handleDirectAuditStatus: async function(id) {
      try {
        await updateArchiveBaseDirectAuditStatus({ id })
        this.handleCancel()
        this.$message({ type: 'success', message: '资料撤销成功' })
      } catch (error) {}
    },
    handleMerchantType(val) {
      if (val !== 5) {
        this.isMicro = true
        this.form.archiveBaseVO.fixFeeRate = 60
      } else this.isMicro = false
    },
    handleCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ name: 'wxArchive' })
      })
    },
    handleClosePreview() {
      this.showViewer = false
    },
    handleImgPreview(url) {
      if (this.checkFormDisabled && url) {
        this.previewList = []
        let imgList = document.querySelectorAll('.avatar')
        for (let i = 0; i < imgList.length; i++) {
          this.previewList.push(imgList[i].src)
        }
        this.showViewer = true
        this.imageIndex = this.previewList.findIndex(item => item === url)
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
      this.form.archiveBaseVO.businessCategory = val[1]
    },
    setBusinessCategory(val) {
      this.businessOptions.forEach(item => {
        if (item.children.some(ele => ele.value === val)) this.businessCategory = [item.value, val]
      })
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
    handleBankPage() {
      if (!this.bankOptions) this.getBankPage()
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
    handleBranchPage() {
      if (!this.branchOptions) this.getBranchPage()
    },
    handleBankChange() {
      this.$nextTick(() => {
        this.form.archiveExpandVO.bankSubName = this.$refs.bankSub.$el.childNodes[1].childNodes[1].value
      })
    },
    getBranchPage: async function(bName = '') {
      const data = { page: 1, rows: 100, bCode: '', bName }
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
            await refund(data)
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ name: 'wxArchive' })
            })
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
          if (this.$route.query.status === 'copy') {
            this.form.archiveBaseVO.auditTime = ''
            this.form.archiveBaseVO.bossAuditTime = ''
            this.form.archiveBaseVO.createTime = ''
            this.form.archiveBaseVO.directAuditStatus = ''
            this.form.archiveBaseVO.useChannelCode = ''
          }
          try {
            await submitToVerify(this.form)
            this.$store.dispatch('delTagView', this.$route).then(() => {
              this.$router.push({ name: 'wxArchive' })
            })
            this.$message.success('提交成功')
          } catch (error) {}
        }
      })
    },
    handleDetail: async function() {
      try {
        this.isDetailLoad = true
        const res = await detail({ archiveId: Number(this.$route.query.id) })
        this.form.archiveBaseVO = res?.archiveBaseDTO ?? deepClone(formObj.archiveBaseDTO)
        this.form.archiveExpandVO = res?.archiveExpandDTO ?? deepClone(formObj.archiveExpandDTO)
        this.form.archiveOtherVO = res?.archiveOtherDTO ?? deepClone(formObj.archiveOtherDTO)
        this.areaList = [res.archiveBaseDTO.province, res.archiveBaseDTO.city, res.archiveBaseDTO.area]
        this.areaKey = Symbol('areaKey')
        this.bankAreaList = [res.archiveExpandDTO.bankProvince, res.archiveExpandDTO.bankCity, res.archiveExpandDTO.bankArea]
        this.bankAreaKey = Symbol('bankAreaKey')
        this.setBusinessCategory(res.archiveBaseDTO.businessCategory)
        if (![0, 1, 2, 4, 6, 8, 10].includes(res.archiveBaseDTO.directAuditStatus) && this.$route.query.status !== 'copy') this.checkFormDisabled = true
      } catch (error) {
      } finally {
        this.isDetailLoad = false
      }
      // 复制
      if (this.$route.query.status === 'copy') {
        this.form.archiveBaseVO.id = null
        this.form.archiveExpandVO.id = null
        this.form.archiveOtherVO.id = null
        this.form.archiveBaseVO.directAuditStatus = null
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    },
    handleArchive() {
      if (this.form.archiveBaseVO.directAuditStatus === 2 && this.checkFormDisabled) {
        this.checkFormDisabled = false
      } else {
        this.$refs.form.validateField('archiveBaseVO.merchantId', async errorMessage => {
          if (!errorMessage) {
            try {
              if (this.$route.query.status === 'copy') {
                this.form.archiveBaseVO.auditTime = ''
                this.form.archiveBaseVO.bossAuditTime = ''
                this.form.archiveBaseVO.createTime = ''
                this.form.archiveBaseVO.directAuditStatus = ''
                this.form.archiveBaseVO.useChannelCode = ''
              }
              const res = await submit(this.form)
              if (!this.form.archiveBaseVO.id) {
                this.$router.push({ name: 'wxArchiveAdd', query: { action: 'detail', id: res, status: 'edit' } })
                this.handleDetail()
                this.pageAction = this.$route.query.action
                document.querySelector('.e-tag_active span').innerText = `普通资质进件/编辑`
              }
              this.$message.success('保存成功')
            } catch (error) {}
          }
        })
      }
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
            this.form.archiveExpandVO.legalPersonName = res.name
            this.form.archiveExpandVO.idNumber = res.num
            this.form.archiveExpandVO.administratorIdCard = res.num
          } else {
            const startDate = res.start_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
            const endDate = res.end_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
            this.form.archiveExpandVO.idBegin = res.start_date && new Date(startDate) ? startDate : ''
            this.form.archiveExpandVO.idEnd = res.end_date && new Date(endDate) ? endDate : ''
          }
        })
        .catch(err => {})
      this.form[type][url] = res.data.path
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
          this.form.archiveExpandVO.businessScope = res.business
          this.form.archiveBaseVO.companyName = res.name
          this.form.archiveBaseVO.address = res.address.replace(/.*(省|市|自治区|自治州|区)/, '')
          const validPeriod = res.valid_period.replace(/[年月./-]/g, '-').replace(/日/g, '')
          this.form.archiveExpandVO.licValidityBigen = res.valid_period && new Date(validPeriod) ? validPeriod.split('至')[0] : ''
          this.form.archiveExpandVO.licValidityEnd = res.valid_period && new Date(validPeriod) ? validPeriod.split('至')[1].replace(/长期/, '') : ''
        })
        .catch(err => {})
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
        .catch(err => {})
      this.form[type][url] = res.data.path
    },
    setUploadSrc(res, type, url) {
      this.form[type][url] = res.data.path
    }
  }
}
</script>

<style lang="scss" scoped>
.p-wxArchive-con {
  border-top: 16px solid #f7f8fa;
  border-bottom: 72px solid #f7f8fa;
  background-color: #fff;
  .p-wxArchive-item {
    header {
      height: 48px;
      line-height: 48px;
      padding-left: 16px;
      font-size: 16px;
      color: #1f2e4d;
      border-bottom: 1px solid #e6e9f0;
      font-weight: 500;
    }
  }
}

.p {
  &-wxArchive {
    &-con {
      border-top: 16px solid #f7f8fa;
      border-bottom: 72px solid #f7f8fa;
      background-color: #fff;
      // header {
      //   min-height: 72px;
      //   /deep/ .el-col {
      //     height: 72px;
      //     display: flex;
      //     align-items: center;
      //     padding-left: 10%;
      //     color: #3d4966;
      //     font-size: 14px;
      //   }
      // }
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
      width: calc(100% - 200px - 42px);
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
    &-review {
      color: #ff6010;
      width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
    &-textarea {
      /deep/ {
        .el-input__count {
          line-height: 1.3;
        }
        .el-textarea__inner {
          padding-bottom: 20px;
        }
      }
    }
  }
  &-preview {
    &-con {
      left: 35vw;
      right: 35vw;
      bottom: 20vh;
      top: 10vh;
      /deep/ .el-image-viewer__mask {
        display: none;
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
  &-dialog {
    &-remark {
      margin-bottom: 0;
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
</style>
