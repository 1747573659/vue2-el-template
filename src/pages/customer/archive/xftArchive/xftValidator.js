// form 对象
export const formObj = {
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
    cardholderIdEnd: '',
    legalPersonProvince: '', // 证件居住地址省
    legalPersonCity: '', // 证件居住地址市
    legalPersonArea: '', // 证件居住地址区
    credentialsAddress: '', // 证件详细地址
    contactSameLegal: 1, // 联系人是否同法人
    contractHeadUrl: '', // 联系人证件照头像面
    contractNationalUrl: '', // 联系人证件照国徽面
    contactCredentialsType: 1, // 证件类型
    credentialsValidDateBegin: '', // 证件有效期开始时间
    credentialsValidDateEnd: '', // 证件有效期结束时间
    businessAuthLetterUrl: '' // 业务办理授权函
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
}

// 赢钱校验字段
export const formYQValids = [
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
// 进件状态
export const auditStatusList = {
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
}

// 账户类型
export const acctTypeList = [
  { id: 2, name: '对公' },
  { id: 1, name: '对私' }
]

// 收款类型
export const cashreceiveTypeList = [
  { id: 1, name: '本企业收款' },
  { id: 2, name: '其他企业收款' }
]

// 持卡人类型
export const cardholderTypeList = [
  { id: 1, name: '个体商户 持卡人为法人' },
  { id: 2, name: '个体商户 持卡人为非法人' }
]

// 持卡人证件类型
export const cardholderIdTypeList = [
  { id: '1', name: '身份证' },
  { id: '2', name: '护照' }
]

// 证件类型
export const cardTypeList = [{ id: 1, name: '身份证' }]

// 经营类型
export const mchDealTypeList = [
  { id: 1, name: '实体' },
  { id: 2, name: '虚拟' }
]

// 费率
export const fixFeeRateList = [
  { id: 25, name: '0.' + '25' + '%' },
  { id: 28, name: '0.' + '28' + '%' },
  { id: 30, name: '0.' + '30' + '%' },
  { id: 35, name: '0.' + '35' + '%' },
  { id: 38, name: '0.' + '38' + '%' },
  { id: 45, name: '0.' + '45' + '%' },
  { id: 55, name: '0.' + '55' + '%' },
  { id: 60, name: '0.' + '60' + '%' }
]

// 享钱汇银费率
export const exchangeFeeRateList = [
  { id: 25, name: '0.' + '25' + '%' },
  { id: 28, name: '0.' + '28' + '%' },
  { id: 30, name: '0.' + '30' + '%' },
  { id: 35, name: '0.' + '35' + '%' },
  { id: 38, name: '0.' + '38' + '%' },
  { id: 45, name: '0.' + '45' + '%' },
  { id: 55, name: '0.' + '55' + '%' },
  { id: 60, name: '0.' + '60' + '%' }
]

// 图片示例
export const exampleImg = {
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
}

// 表单正则校验
export function xftValidator() {
  const validatorRules = {
    serviceTel: /(^(\d{11})$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
    idNumber: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    mobildPhone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1-9]))\d{8}$/,
    licId: /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10,12}$)|(^\d{15,20}$)/,
    bankCard: /^[0-9]\d{5,29}$/
  }
  return {
    'archiveExpandVO.contractHeadUrl': [{ required: true, message: '请上传联系人证件照头像面', trigger: 'change' }],
    'archiveExpandVO.contractNationalUrl': [{ required: true, message: '请上传联系人证件照国徽面', trigger: 'change' }],
    'archiveExpandVO.businessAuthLetterUrl': [{ required: true, message: '请上传业务办理授权函', trigger: 'change' }],
    'archiveExpandVO.credentialsValidDateBegin': [{ required: true, message: '请输入联系人证件有效期', trigger: 'change' }],
    'archiveExpandVO.credentialsAddress': [{ required: true, message: '请输入证件详细地址', trigger: 'change' }],
    'archiveExpandVO.legalPersonArea': [{ required: true, message: '请输入证件居住地址', trigger: 'change' }],
    'archiveBaseVO.merchantId': [{ required: true, message: '请选择商户', trigger: 'change' }],
    'archiveBaseVO.merchantType': [{ required: true, message: '请选择商户类型', trigger: 'change' }],
    'archiveBaseVO.companyName': [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    'archiveBaseVO.merchantShortName': [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
    'archiveBaseVO.province': [{ required: true, message: '请选择地区', trigger: 'change' }],
    'archiveBaseVO.address': [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    'archiveBaseVO.serviceTel': [
      { required: true, message: '请输入客服电话', trigger: 'blur' },
      { pattern: validatorRules.serviceTel, message: '请输入正确的客服电话', trigger: 'change' }
    ],
    'archiveBaseVO.contact': [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
    'archiveBaseVO.idNumber': [
      { required: true, message: '请输入联系人证件号码', trigger: 'blur' },
      { pattern: validatorRules.idNumber, message: '请输入正确的联系人证件号码', trigger: 'change' }
    ],
    'archiveBaseVO.contactPhone': [
      { required: true, message: '请输入联系人电话', trigger: 'blur' },
      { pattern: validatorRules.mobildPhone, message: '请输入正确的联系人电话', trigger: 'change' }
    ],
    'archiveBaseVO.email': [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的联系人邮箱地址', trigger: 'change' }
    ],
    'archiveBaseVO.mchDealType': [{ required: true, message: '请选择经营类型', trigger: 'change' }],
    'archiveBaseVO.industrId': [{ required: true, message: '请选择经营类目', trigger: 'change' }],
    'archiveExpandVO.certType': [{ required: true, message: '请选择登记证书类型', trigger: 'change' }],
    'archiveOtherVO.signboardUrl': [{ required: true, message: '请上传门店门头照', trigger: 'change' }],
    'archiveOtherVO.cashierDesk': [{ required: true, message: '请上传室内场景照', trigger: 'change' }],
    'archiveOtherVO.businessSiteOneUrl': [{ required: true, message: '请上传经营场所照', trigger: 'change' }],
    'archiveOtherVO.contractOfTenancy1': [{ required: true, message: '请上传租赁合同照一', trigger: 'change' }],
    'archiveOtherVO.contractOfTenancy2': [{ required: true, message: '请上传租赁合同照二', trigger: 'change' }],
    'archiveOtherVO.contractOfTenancy3': [{ required: true, message: '请上传租赁合同照三', trigger: 'change' }],
    'archiveExpandVO.businessLicenseUrl': [{ required: true, message: '请上传营业执照', trigger: 'change' }],
    'archiveExpandVO.licId': [
      { required: true, message: '请输入营业执照注册号', trigger: 'blur' },
      { pattern: validatorRules.licId, message: '请输入正确营业执照注册号', trigger: 'change' }
    ],
    'archiveExpandVO.licValidityBigen': [{ required: true, message: '请选择营业执照有效期', trigger: 'change' }],
    'archiveExpandVO.legalPersonName': [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
    'archiveExpandVO.cardType': [{ required: true, message: '请选择证件类型', trigger: 'change' }],
    'archiveExpandVO.idNumber': [
      { required: true, message: '请输入证件号码', trigger: 'blur' },
      { pattern: validatorRules.idNumber, message: '请输入正确的证件号码', trigger: 'change' }
    ],
    'archiveExpandVO.legalPersonValidityBegin': [{ required: true, message: '请选择证件有效期', trigger: 'change' }],
    'archiveExpandVO.idFrontUrl': [{ required: true, message: '请上传法人证件照头像面', trigger: 'change' }],
    'archiveExpandVO.idBackUrl': [{ required: true, message: '请上传法人证件照国徽面', trigger: 'change' }],
    'archiveExpandVO.acctType': [{ required: true, message: '请选择账户类型', trigger: 'change' }],
    'archiveExpandVO.cashreceiveType': [{ required: true, message: '请选择收款类型', trigger: 'change' }],
    'archiveExpandVO.cardholderType': [{ required: true, message: '请选择持卡人类型', trigger: 'change' }],
    'archiveExpandVO.hardIdUrl': [{ required: true, message: '请上传法人手持身份证', trigger: 'change' }],
    'archiveExpandVO.bankSub': [{ required: true, message: '请选择开户支行', trigger: 'change' }],
    'archiveExpandVO.bankProvince': [{ required: true, message: '请选择开户支行所在省市', trigger: 'change' }],
    'archiveExpandVO.bankAccountName': [{ required: true, message: '请输入账户名', trigger: 'blur' }],
    'archiveExpandVO.bankCard': [
      { required: true, message: '请输入银行账号', trigger: 'blur' },
      { pattern: validatorRules.bankCard, message: '请输入正确银行账号', trigger: 'change' }
    ],
    'archiveExpandVO.cardholderPhone': [
      { required: true, message: '请输入预留手机号', trigger: 'blur' },
      { pattern: validatorRules.mobildPhone, message: '请输入正确的预留手机号', trigger: 'change' }
    ],
    'archiveExpandVO.cardholderIdType': [{ required: true, message: '请选择持卡人证件类型', trigger: 'change' }],
    'archiveExpandVO.cardholderIdNumber': [{ required: true, message: '持卡人证件号码', trigger: 'blur' }],
    'archiveExpandVO.cardholderIdBegin': [{ required: true, message: '请输入持卡人证件有效期', trigger: 'blur' }],
    'archiveExpandVO.bankCardFrontUrl': [{ required: true, message: '请上传银行卡正面照', trigger: 'change' }],
    'archiveExpandVO.bankCardBackUrl': [{ required: true, message: '请上传银行卡背面照', trigger: 'change' }],
    'archiveExpandVO.openingPermitUrl': [{ required: true, message: '请上传开户许可证', trigger: 'change' }],
    'archiveOtherVO.cashreceiveIdFrontUrl': [{ required: true, message: '请上传收款企业法人身份证正面照', trigger: 'change' }],
    'archiveOtherVO.cashreceiveIdBackUrl': [{ required: true, message: '请上传收款企业法人身份证反面照', trigger: 'change' }],
    'archiveOtherVO.publicAuthorization': [{ required: true, message: '请上传第三方对公结算授权函', trigger: 'change' }],
    'archiveOtherVO.cardholderIdFrontUrl': [{ required: true, message: '请上传持卡人身份证正面照', trigger: 'change' }],
    'archiveOtherVO.cardholderIdBackUrl': [{ required: true, message: '请上传持卡人身份证反面照', trigger: 'change' }],
    'archiveOtherVO.cardholderPhoto': [{ required: true, message: '请上传持卡人手持身份证照片', trigger: 'change' }],
    'archiveOtherVO.privateAuthorization': [{ required: true, message: '请上传第三方对私结算授权函', trigger: 'change' }],
    'archiveBaseVO.isOpenXingPos': [{ required: true, message: '请上传第三方对私结算授权函', trigger: 'change' }],
    'archiveOtherVO.cardholderIdCardFront': [{ required: true, message: '请上传持卡人身份证正面照', trigger: 'change' }],
    'archiveBaseVO.fixFeeRate': [
      { required: true, message: '请选择费率', trigger: 'blur' },
      {
        validator(rule, value, callback) {
          parseFloat(value) === 0 ? callback(new Error('费率不能为0')) : callback([])
        }
      }
    ],
    'archiveBaseVO.exchangeFeeRate': [
      { required: true, message: '请选择费率', trigger: 'blur' },
      {
        validator(rule, value, callback) {
          parseFloat(value) === 0 ? callback(new Error('费率不能为0')) : callback([])
        }
      }
    ]
  }
}
