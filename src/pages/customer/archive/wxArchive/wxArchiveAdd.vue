<template>
  <section class="p-wxArchive-con" v-loading="checkFormLoad" v-permission.page="'WXARCHIVE_LIST_EDIT,WXARCHIVE_LIST_ADD'">
    <header v-if="!['add','copy'].includes(pageStatus)">
      <el-row>
        <el-col :span="12" v-if="form.archiveBaseVO.directAuditStatus !== ''">
          <label>进件状态：</label>
          <span class="e-wxArchive-status_pd e-wxArchive-warning">{{ form.archiveBaseVO.directAuditStatus | filterStatus(direAuditStatusOptions) }}</span>
        </el-col>
        <el-col :span="12" v-if="form.archiveBaseVO.auditRemark !== '' && [2, 4].includes(form.archiveBaseVO.directAuditStatus)">
          <label>审核结果：</label>
          <el-tooltip effect="dark" :content="form.archiveBaseVO.auditRemark" placement="top">
            <span class="e-wxArchive-review">{{ form.archiveBaseVO.auditRemark }}</span>
          </el-tooltip>
        </el-col>
      </el-row>
    </header>
    <el-form ref="form" :model="form" :rules="rules" :disabled="checkFormDisabled" size="small" label-suffix=":" :inline="true" label-width="210px">
      <div class="p-wxArchive-item">
        <header>基本信息</header>
        <el-row class="p-wxArchive-fill">
          <el-col :span="24">
            <el-form-item label="商户名称" prop="archiveBaseVO.merchantId">
              <select-page
                style="width:240px"
                v-if="pageStatus === 'add'"
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
          <el-col :span="12">
            <el-form-item label="商户类型" prop="archiveBaseVO.merchantType">
              <el-radio-group v-model="form.archiveBaseVO.merchantType" @change="handleMerchantType">
                <el-radio v-for="(item, index) in merchantTypeOptions.slice(-2)" :key="index" :label="item.value">
                  <span>{{ item.label }}</span>
                  <el-tooltip effect="dark" :content="item.content" placement="top">
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
                <template #content>
                  <span>若营业执照注册号为18位统一社会信用代码，请选择“已三证合一”，<br />否则请选择“非三证合一”</span>
                </template>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <template v-if="form.archiveBaseVO.merchantType !== 5">
            <el-col :span="24">
              <el-form-item label="营业执照" prop="archiveExpandVO.businessLicenseUrl">
                <upload-panel
                  alt="营业执照"
                  action="/uploadFile"
                  :fileServer="fileServer"
                  :example-img="exampleImg.businessLicenseUrl"
                  :image-url="form.archiveExpandVO.businessLicenseUrl"
                  :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.businessLicenseUrl', 'business_license')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.businessLicenseUrl)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照注册号" prop="archiveExpandVO.licId">
                <el-input v-model="form.archiveExpandVO.licId" placeholder="营业执照注册号" style="width:240px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照有效期" prop="archiveExpandVO.licValidityBigen">
                <el-date-picker v-model="form.archiveExpandVO.licValidityBigen" placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.licValidityEnd && checkFormDisabled && pageStatus === 'detail'">长期有效</span>
                <el-date-picker v-else v-model="form.archiveExpandVO.licValidityEnd" placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
                <el-tooltip effect="dark" content="“结束日期”留空代表长期有效" placement="top">
                  <img :src="questionIcon" alt="提示" class="e-icon-question" />
                </el-tooltip>
              </el-form-item>
            </el-col>
          </template>

          <el-col :span="24">
            <el-form-item label="经营类目" prop="archiveBaseVO.businessCategory">
              <el-cascader ref="cascader" v-model="businessCategory" :options="businessOptions" @change="handleBusinessCategory" style="width: 240px"></el-cascader>
              <el-tooltip effect="dark" content="选择线下零售/食品生鲜、休闲娱乐/美发/美容/美甲店、线下零售/批发业时，请填写售卖商品描述" placement="top">
                <img :src="questionIcon" alt="提示" class="e-icon-question" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.archiveBaseVO.merchantType === 5 && sellShopDescribeArr.includes(form.archiveBaseVO.businessCategoryRemark)">
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
                <el-date-picker v-model="form.archiveExpandVO.orgInstitutionBigen" placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
                <span style="margin: 0 10px;">至</span>
                <span v-if="!form.archiveExpandVO.orgInstitutionEnd && checkFormDisabled && pageStatus === 'detail'">长期有效</span>
                <el-date-picker v-else v-model="form.archiveExpandVO.orgInstitutionEnd" placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="组织机构代码证" prop="archiveExpandVO.orgInstitutionUrl">
                <upload-panel
                  alt="组织机构代码证"
                  action="/uploadFile"
                  :fileServer="fileServer"
                  :image-url="form.archiveExpandVO.orgInstitutionUrl"
                  :on-success="res => handleUpload(res, 'archiveExpandVO.orgInstitutionUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.orgInstitutionUrl)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="税务登记证" prop="archiveExpandVO.taxRegistrationUrl">
                <upload-panel
                  alt="税务登记证"
                  action="/uploadFile"
                  :fileServer="fileServer"
                  :image-url="form.archiveExpandVO.taxRegistrationUrl"
                  :on-success="res => handleUpload(res, 'archiveExpandVO.taxRegistrationUrl')"
                  @click="handleImgPreview(fileServe + form.archiveExpandVO.taxRegistrationUrl)"
                />
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

          <template v-if="form.archiveBaseVO.merchantType === 5">
            <el-col :span="12">
              <el-form-item label="经营场地证明">
                <upload-panel
                  alt="经营场地证明"
                  action="/uploadFile"
                  :fileServer="fileServer"
                  :image-url="form.archiveOtherVO.businessSiteUrl"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.businessSiteUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.businessSiteUrl)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补充资料1">
                <upload-panel
                  alt="补充资料1"
                  action="/uploadFile"
                  :fileServer="fileServer"
                  :image-url="form.archiveOtherVO.additionalOneUrl"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.additionalOneUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.additionalOneUrl)"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补充资料2">
                <upload-panel
                  alt="补充资料2"
                  action="/uploadFile"
                  :fileServer="fileServer"
                  :image-url="form.archiveOtherVO.additionalTwoUrl"
                  :on-success="res => handleUpload(res, 'archiveOtherVO.additionalTwoUrl')"
                  @click="handleImgPreview(fileServe + form.archiveOtherVO.additionalTwoUrl)"
                />
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
        <el-row class="p-wxArchive-fill">
          <el-col :span="12">
            <el-form-item label="身份证正面照" prop="archiveExpandVO.idFrontUrl">
              <upload-panel
                alt="身份证正面照"
                action="/uploadFile"
                :fileServer="fileServer"
                :exampleImg="exampleImg.idFrontUrl"
                :image-url="form.archiveExpandVO.idFrontUrl"
                :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.idFrontUrl', 'idcard')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.idFrontUrl)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证背面照" prop="archiveExpandVO.idBackUrl">
              <upload-panel
                alt="身份证背面照"
                action="/uploadFile"
                :fileServer="fileServer"
                :exampleImg="exampleImg.idBackUrl"
                :image-url="form.archiveExpandVO.idBackUrl"
                :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.idBackUrl', 'idcard')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.idBackUrl)"
              />
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
              <el-date-picker v-model="form.archiveExpandVO.idBegin" placeholder="开始日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
              <span style="margin: 0 10px;">至</span>
              <span v-if="!form.archiveExpandVO.idEnd && checkFormDisabled && pageStatus === 'detail'">长期有效</span>
              <el-date-picker v-else v-model="form.archiveExpandVO.idEnd" placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 140px"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="p-wxArchive-item">
        <header>结算账号</header>
        <el-row class="p-wxArchive-fill">
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
              <upload-panel
                alt="开户许可证"
                action="/uploadFile"
                :fileServer="fileServer"
                :exampleImg="exampleImg.openingPermitUrl"
                :image-url="form.archiveExpandVO.openingPermitUrl"
                :on-success="res => handleUpload(res, 'archiveExpandVO.openingPermitUrl')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.openingPermitUrl)"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item label="银行卡正面照" prop="archiveExpandVO.bankCardFrontUrl">
              <upload-panel
                alt="银行卡正面照"
                action="/uploadFile"
                :fileServer="fileServer"
                :exampleImg="exampleImg.bankCardFrontUrl"
                :image-url="form.archiveExpandVO.bankCardFrontUrl"
                :on-success="(res, file) => handleUploadToOCR(file, 'archiveExpandVO.bankCardFrontUrl', 'bank_card')"
                @click="handleImgPreview(fileServe + form.archiveExpandVO.bankCardFrontUrl)"
              />
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
        <el-row class="p-wxArchive-fill">
          <el-col :span="12">
            <el-form-item label="费率" prop="archiveBaseVO.fixFeeRate">
              <el-select v-model="form.archiveBaseVO.fixFeeRate" :disabled="form.archiveBaseVO.merchantType !== 5" placeholder="费率" style="width:240px">
                <el-option v-for="item in rateOptions" :key="item.value" :label="item.lable" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>

    <div class="p-wxArchive-action">
      <template v-if="['add', 'copy'].includes(pageStatus) || detailStatusArr.includes(form.archiveBaseVO.directAuditStatus)">
        <template v-if="form.archiveBaseVO.directAuditStatus === 3">
          <el-button size="small" type="primary" class="e-wxArchive-action_pd" @click="handleDirectAuditStatus(form.archiveBaseVO.id)">撤销</el-button>
        </template>
        <template v-else>
          <el-button size="small" type="primary" class="e-wxArchive-action_pd" @click="handleVerify">提交</el-button>
          <template v-if="[1].includes(form.archiveBaseVO.directAuditStatus) && pageStatus !== 'copy'">
            <el-button size="small" class="e-wxArchive-action_pd" @click="checkReason = true">拒绝</el-button>
          </template>
          <el-button size="small" type="primary" plain class="e-wxArchive-action_pd" @click="handleArchive">
            {{ [1, 10].includes(form.archiveBaseVO.directAuditStatus) && checkFormDisabled ? '编辑' : '保存' }}
          </el-button>
        </template>
      </template>
      <el-button size="small" class="e-wxArchive-action_pd" @click="handleCancel">取消</el-button>
    </div>

    <!-- dialog -->
    <el-dialog append-to-body :visible.sync="checkReason" title="拒绝原因" width="507px" :close-on-press-escape="false">
      <el-form ref="refundForm" :model="refundForm" :rules="refundRules" label-width="60px">
        <el-form-item label="原因" prop="remark" class="e-dialog-remark">
          <el-input type="textarea" v-model="refundForm.remark" :rows="4" placeholder="请输入审核不能过的原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="checkReason = false" size="small" class="e-wxArchive-action_pd">取消</el-button>
        <el-button @click="handleRefund" type="primary" size="small" class="e-wxArchive-action_pd">确定</el-button>
      </div>
    </el-dialog>

    <!-- image-preview -->
    <el-image-preview v-if="checkViewer" :initial-index="imageIndex" :url-list="previewList" :on-close="() => (checkViewer = false)" class="e-preview-con"></el-image-preview>
  </section>
</template>

<script>
import UploadPanel from '../components/uploadPanel'
import ElImagePreview from 'element-ui/packages/image/src/image-viewer'
import selectPage from '@/components/selectPage/selectPage'
import areaSelect from '@/components/areaSelect'
import fileServer from '@/mixins/fileServe'
import selectCopy from '@/components/selectCopy'
import { detailValidate, formObj, rateOptions, refundForm, refundRules, merchantTypeOptions, sellShopDescribeArr, exampleImg } from './index'
import { filterStatus } from './filters'
import { deepClone } from '@/utils'
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
    areaSelect,
    ElImagePreview,
    selectCopy,
    UploadPanel
  },
  filters: {
    filterStatus
  },
  data() {
    return {
      merchantTypeOptions,
      sellShopDescribeArr,
      rateOptions,
      exampleImg,
      detailStatusArr: [0, 1, 2, 3, 4, 6, 8, 10],
      direAuditStatusOptions: JSON.parse(sessionStorage.direAuditStatusOptions),
      questionIcon: require('@/assets/images/icon/questioin.png'),
      pageStatus: this.$route.query.status,

      checkFormLoad: false,
      checkFormDisabled: false,
      form: {},
      rules: detailValidate,
      businessCategory: [],
      businessOptions: [],
      businessSceneList: [],

      selectOptions: [],
      searchString: '',
      isMaxPage: false,
      selectPageNo: 1,

      areaKey: Symbol('areaKey'),
      bankAreaKey: Symbol('bankAreaKey'),
      areaList: [],
      bankAreaList: [],

      bankOptions: [],
      branchOptions: [],

      checkViewer: false,
      imageIndex: 0,
      previewList: [],
      checkReason: false,
      refundForm: { remark: '' },
      refundRules: {
        remark: [{ required: true, message: '请输入审核不能过的原因', trigger: 'change' }]
      }
    }
  },
  created() {
    this.form = deepClone(formObj)
  },
  mounted() {
    this.$nextTick(() => {
      const tags = { edit: '编辑', detail: '详情', add: '新增', copy: '编辑' }
      document.querySelector('.e-tag_active span').innerText = `普通资质进件/${this.pageStatus ? tags[this.pageStatus] : '新增'}`
    })

    this.remoteSelect()
    this.getBankPage()
    this.getBranchPage()

    this.getBusinessCategory()
    if (this.pageStatus !== 'add') this.handleDetail()
  },
  methods: {
    // 图片上传模块
    handleUpload(res, type) {
      const typeList = type.split('.')
      this.form[typeList[0]][typeList[1]] = res.data.path
    },
    handleUploadToOCR(file, type, code) {
      const OCRMap = new Map([
        ['archiveExpandVO.businessLicenseUrl', 'getBusinessLicenseOCR'],
        ['archiveExpandVO.idFrontUrl', 'getFaceIdOCR'],
        ['archiveExpandVO.idBackUrl', 'getBackIdOCR'],
        ['archiveExpandVO.bankCardFrontUrl', 'getBankCardOCR']
      ])
      this.handleUpload(file.response, type)
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        let OCRData = { image: reader.result.split(',')[1], imageCode: code }
        if (code === 'idcard') OCRData = Object.assign(OCRData, { side: type === 'archiveExpandVO.idFrontUrl' ? 'face' : 'back' })
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
      this.form.archiveExpandVO.businessScope = res.business
      this.form.archiveBaseVO.companyName = res.name
      this.form.archiveBaseVO.address = res.address.replace(/.*(省|市|自治区|自治州|区)/, '')
      const validPeriod = res.valid_period.replace(/[年月./-]/g, '-').replace(/日/g, '')
      this.form.archiveExpandVO.licValidityBigen = res.valid_period && new Date(validPeriod) ? validPeriod.split('至')[0] : ''
      this.form.archiveExpandVO.licValidityEnd = res.valid_period && new Date(validPeriod) ? validPeriod.split('至')[1].replace(/长期/, '') : ''
    },
    getFaceIdOCR(res) {
      this.form.archiveExpandVO.legalPersonName = res.name
      this.form.archiveExpandVO.idNumber = res.num
    },
    getBackIdOCR(res) {
      const startDate = res.start_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      const endDate = res.end_date.replace(/[年月./-]/g, '-').replace(/日/g, '')
      this.form.archiveExpandVO.idBegin = res.start_date && new Date(startDate) ? startDate : ''
      this.form.archiveExpandVO.idEnd = res.end_date && new Date(endDate) ? endDate : ''
    },
    getBankCardOCR(res) {
      this.form.archiveExpandVO.bankCard = res.card_num
    },
    handleImgPreview(url) {
      if (this.checkFormDisabled && url) {
        this.previewList = []
        let imgList = document.querySelectorAll('.avatar')
        for (let i = 0; i < imgList.length; i++) {
          this.previewList.push(imgList[i].src)
        }
        this.checkViewer = true
        this.imageIndex = this.previewList.findIndex(item => item === url)
      }
    },
    handleCancel() {
      this.$store.dispatch('delTagView', this.$route).then(() => {
        this.$router.push({ name: 'wxArchive' })
      })
    },
    handleMerchantType(val) {
      if (val !== 5) this.form.archiveBaseVO.fixFeeRate = 60
    },
    handleDirectAuditStatus: async function(id) {
      try {
        await updateArchiveBaseDirectAuditStatus({ id })
        this.handleCancel()
        this.$message({ type: 'success', message: '资料撤销成功' })
      } catch (error) {}
    },
    

    handleBusinessCategory(val) {
      const pathLabels = this.$refs.cascader.getCheckedNodes()[0].pathLabels
      this.form.archiveBaseVO.businessCategoryRemark = `${pathLabels[0] / pathLabels[1]}`
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
        if (item.parentId === 0) data.push({ value: item.id, label: item.tradeName, children: [] })
      })
      data.forEach(item => {
        res.forEach(children => {
          if (item.value === children.parentId) item.children.push({ value: children.tradeCode, label: children.tradeName })
        })
      })
      this.businessOptions = data
    },
    handleRefund() {
      this.$refs.refundForm.validate(async valid => {
        if (valid) {
          const data = { archiveId: this.$route.query.id, auditRemark: this.refundForm.remark }
          try {
            await refund(data)
            this.checkReason = false
            this.$message({ type: 'success', message: '操作成功' })
            this.handleCancel()
          } catch (error) {}
        }
      })
    },
    handleVerify: async function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            await submitToVerify(this.form)
            this.handleCancel()
            this.$message({ type: 'success', message: '提交成功' })
          } catch (error) {}
        }
      })
    },
    handleDetail: async function() {
      try {
        this.checkFormLoad = true
        const res = await detail({ archiveId: Number(this.$route.query.id) })
        const {
          archiveBaseDTO = deepClone(formObj.archiveBaseDTO),
          archiveExpandDTO = deepClone(formObj.archiveExpandDTO),
          archiveOtherDTO = deepClone(formObj.archiveOtherDTO)
        } = res
        this.form.archiveBaseVO = archiveBaseDTO
        this.form.archiveExpandVO = archiveExpandDTO
        this.form.archiveOtherVO = archiveOtherDTO

        // 待处理
        this.areaList = [res.archiveBaseDTO.province, res.archiveBaseDTO.city, res.archiveBaseDTO.area]
        this.areaKey = Symbol('areaKey')
        this.bankAreaList = [res.archiveExpandDTO.bankProvince, res.archiveExpandDTO.bankCity, res.archiveExpandDTO.bankArea]
        this.bankAreaKey = Symbol('bankAreaKey')

        this.setBusinessCategory(res.archiveBaseDTO.businessCategory)
        if (![0, 2, 4, 6, 8].includes(res.archiveBaseDTO.directAuditStatus) && this.pageStatus !== 'copy') this.checkFormDisabled = true
      } catch (error) {
      } finally {
        this.checkFormLoad = false
      }

      if (this.pageStatus === 'copy') {
        this.form.archiveBaseVO.auditTime = ''
        this.form.archiveBaseVO.bossAuditTime = ''
        this.form.archiveBaseVO.createTime = ''
        this.form.archiveBaseVO.directAuditStatus = ''
        this.form.archiveBaseVO.useChannelCode = ''
        this.form.archiveBaseVO.id = ''
        this.form.archiveExpandVO.id = ''
        this.form.archiveOtherVO.id = ''
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
      }
    },
    handleArchive() {
      if ([1, 10].includes(this.form.archiveBaseVO.directAuditStatus) && this.checkFormDisabled) {
        this.checkFormDisabled = false
      } else {
        this.$refs.form.validateField('archiveBaseVO.merchantId', async errorMessage => {
          if (!errorMessage) {
            try {
              const res = await submit(this.form)
              if (!this.form.archiveBaseVO.id) {
                this.$router.replace({ name: 'wxArchiveAdd', query: { id: res, status: 'edit' } })
                document.querySelector('.e-tag_active span').innerText = '普通资质进件/编辑'
              }
              this.handleDetail()
              this.$message({ type: 'success', message: '保存成功' })
            } catch (error) {}
          }
        })
      }
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
    handleBankChange(val) {
      this.$nextTick(() => {
        this.form.archiveExpandVO.bankSub = val[0]
        this.form.archiveExpandVO.bankSubName = this.$refs.bankSub.$el.childNodes[1].childNodes[1].value
      })
    },
    getBranchPage: async function(bName = '') {
      try {
        const data = { page: 1, rows: 100, bCode: '', bName }
        const res = await queryBranchPage(data)
        this.branchOptions = res.results
      } catch (error) {}
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
    > header {
      height: 48px;
      line-height: 48px;
      padding-left: 16px;
      font-size: 16px;
      color: #1f2e4d;
      border-bottom: 1px solid #e6e9f0;
      font-weight: 500;
    }
    .p-wxArchive-fill {
      padding-top: 24px;
    }
  }
  .p-wxArchive-action {
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

.p {
  &-wxArchive {
    &-con {
      border-top: 16px solid #f7f8fa;
      border-bottom: 72px solid #f7f8fa;
      background-color: #fff;
      > header {
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
    &-baseInfo {
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
