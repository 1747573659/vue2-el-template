export  const  merchantTypeOptions = [
  { value: '', label: '全部' },
  { value: 5, label: '小微' },
  { value: 1, label: '个体商户' },
  { value: 2, label: '企业' }
]

export const auditStatusOptions = [
  { value: '', label: '全部' },
  { value: 0, label: '草稿' },
  { value: 1, label: '渠道审核未通过' },
  { value: 2, label: '待渠道审核' },
  { value: 3, label: '待平台审核' },
  { value: 4, label: '平台审核未通过' },
  { value: 5, label: '申请中' },
  { value: 6, label: '编辑中' },
  { value: 7, label: '审核中' },
  { value: 8, label: '已驳回' },
  { value: 9, label: '资料校验中' },
  { value: 10, label: '待验证' },
  { value: 11, label: '待签约' },
  { value: 12, label: '开通权限中' },
  { value: 13, label: '已完成' },
  { value: 14, label: '已作废' },
  { value: 15, label: '已冻结' },
]

export const deactivateOptions = [
  { value: '', label: '全部' },
  { value: 1, label: '是' },
  { value: 0, label: '否' }
]

export const countOptions = [
  { value: 0, label: '草稿', total: 0 },
  { value: 2, label: '待渠道审核', total: 0 },
  { value: 3, label: '待平台审核', total: 0 },
  { value: 1, label: '渠道审核未通过', total: 0 },
  { value: 4, label: '平台审核未通过', total: 0 }
]

export const detailOptions = [
  { value: -1, label: '已驳回' },
  { value: 1, label: '待审核' },
  { value: 2, label: '审核中' },
  { value: 3, label: '待签约' },
  { value: 4, label: '已签约' }
]
export const updateStatusOptions = [
  { value: -2, label: '已冻结' },
  { value: -1, label: '已驳回' },
  { value: 1, label: '资料校验中' },
  { value: 2, label: '待账户验证' },
  { value: 3, label: '审核中' },
  { value: 4, label: '待签约' }
]

export const rateOptions = [
  {
    value: 38,
    lable: '0.38%'
  },
  {
    value: 39,
    lable: '0.39%'
  },
  {
    value: 40,
    lable: '0.4%'
  },
  {
    value: 45,
    lable: '0.45%'
  },
  {
    value: 48,
    lable: '0.48%'
  },
  {
    value: 49,
    lable: '0.49%'
  },
  {
    value: 50,
    lable: '0.5%'
  },
  {
    value: 55,
    lable: '0.55%'
  },
  {
    value: 58,
    lable: '0.58%'
  },
  {
    value: 59,
    lable: '0.59%'
  },
  {
    value: 60,
    lable: '0.6%'
  }
]

export const formObj = {
  archiveBaseVO: {
    userId: '',
    merchantId: '', // 商户
    publicId: '', // 公众号APPID
    appletId: '', // 小程序APPID
    merchantType: 5, // 商户类型
    companyName: '', // 公司名称
    merchantShortName: '', // 商户简称
    province: '', // 省
    city: '', // 市
    area: '', // 区
    address: '', // 详细地址
    contact: '', // 联系人/负责人
    contactPhone: '', // 联系人手机号/负责人联系方式
    email: '', // 联系人邮箱
    businessCategory: '', // 经营类目
    businessCategoryRemark: '', // 经营类目（名称，用于页面显示）
    auditStatus: '', // 审核状态
    auditRemark: '', // 审核结果
    fixFeeRate: 60 // 小微进件费率
  },
  archiveExpandVO: {
    licType: 1, // 证件类型
    businessLicenseUrl: '', // 营业执照
    licId: '', // 营业执照注册号
    licValidityBigen: '', // 营业执照开始有效期
    licValidityEnd: '', // 营业执照结束有效期
    businessScope: '', // 经营范围
    sellShopDescribe: '', // 售卖商品描述
    orgInstitutionCode: '', // 组织机构代码号
    orgInstitutionBigen: '', //组织机构代码开始有效期
    orgInstitutionEnd: '', //组织机构代码结束有效期
    orgInstitutionUrl: '', //组织机构代码证
    taxRegistrationUrl: '', //税务登记证
    legalPersonName: '', // 法人姓名
    idType: '1', // 证件类型
    idNumber: '', // 证件号码
    idBegin: '', // 证件开始有效期
    idEnd: '', // 证件结束有效期
    idFrontUrl: '', //身份证正面照
    idBackUrl: '', // 身份证背面照,
    hardIdUrl: '', // 手持身份证正面照
    openingPermitUrl: '', // 开户许可证号
    bankCardFrontUrl: '', //银行卡正面照
    bank: '', //银行
    bankName: '',
    bankSub: '', //所属支行
    bankCard: '', //银行账号
    bankAccountName: '', //账户名
    bankProvince: '', //银行所在省
    bankCity: '', //银行所在市
    bankArea: '', //银行所在地区
    acctType: 1, // 账户类型
    administratorIdCard: '' // 超管证件号码
  },
  archiveOtherVO: {
    signboardUrl: '', // 门店门头照
    businessSiteOneUrl: '', // 经营场所照片1
    businessSiteTwoUrl: '', // 经营场所照片2
    businessSiteThreeUrl: '', // 经营场所照片3
    businessSiteUrl: '', // 经营场地证明
    additionalOneUrl: '', // 补充材料1
    additionalTwoUrl: '', // 补充材料2
    additionalRemark: '', //补充说明
    typeAptitudeUrl: '' // 类目特殊资质
  }
}

const validatorRules = {
  serviceTel: /(^(\d{11})$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
  idNumber: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  mobildPhone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
  licId: /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10,12}$)|(^\d{15,20}$)/,
  bankCard: /^[0-9]\d{5,29}$/
}

export const detailValidate = {
  'archiveBaseVO.merchantId': [{ required: true, message: '请选择商户', trigger: 'change' }],
  'archiveBaseVO.publicId': [{ required: true, message: '请输入公众号APPID', trigger: 'change' }],
  'archiveBaseVO.appletId': [{ required: true, message: '请输入小程序APPID', trigger: 'change' }],
  'archiveBaseVO.companyName': [{ required: true, message: '请输入公司名称', trigger: 'change' }],
  'archiveBaseVO.merchantShortName': [{ required: true, message: '请输入商户简称', trigger: 'change' }],
  'archiveBaseVO.area': [{ required: true, message: '请输入地区', trigger: 'change' }],
  'archiveBaseVO.address': [{ required: true, message: '请输入详细地址', trigger: 'change' }],
  'archiveBaseVO.contact': [{ required: true, message: '请输入联系人', trigger: 'change' }],
  'archiveBaseVO.contactPhone': [
    { required: true, message: '请输入联系人电话', trigger: 'blur' },
    { pattern: validatorRules.mobildPhone, message: '请输入正确的电话号码', trigger: 'change' }
  ],
  'archiveBaseVO.email': [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
  ],
  'archiveOtherVO.signboardUrl': [{ required: true, message: '请输入门店门头照', trigger: 'change' }],
  'archiveOtherVO.businessSiteOneUrl': [{ required: true, message: '请输入经营场所照1', trigger: 'change' }],
  'archiveOtherVO.businessSiteTwoUrl': [{ required: true, message: '请输入经营场所照2', trigger: 'change' }],
  'archiveOtherVO.businessSiteThreeUrl': [{ required: true, message: '请输入经营场所照3', trigger: 'change' }],
  'archiveExpandVO.licType': [{ required: true, message: '请输入证件类型', trigger: 'change' }],
  'archiveExpandVO.businessLicenseUrl': [{ required: true, message: '请输入营业执照', trigger: 'change' }],
  'archiveExpandVO.licId': [
    { required: true, message: '请输入营业执照注册号', trigger: 'blur' },
    { pattern: validatorRules.licId, message: '请输入正确营业执照注册号', trigger: 'change' }
  ],
  'archiveExpandVO.licValidityBigen': [{ required: true, message: '请输入营业执照有效期', trigger: 'change' }],
  'archiveExpandVO.businessScope': [{ required: true, message: '请输入经营范围', trigger: 'change' }],
  'archiveExpandVO.businessCategoryRemark': [{ required: true, message: '请输入经营类目', trigger: 'change' }],
  'archiveExpandVO.sellShopDescribe': [{ required: true, message: '请输入售卖商品描述', trigger: 'change' }],
  'archiveExpandVO.orgInstitutionCode': [{ required: true, message: '请输入组织机构代码号', trigger: 'change' }],
  'archiveExpandVO.orgInstitutionBigen': [{ required: true, message: '请输入组织机构代码有效期', trigger: 'change' }],
  'archiveExpandVO.orgInstitutionUrl': [{ required: true, message: '请输入组织机构代码证', trigger: 'change' }],
  'archiveExpandVO.taxRegistrationUrl': [{ required: true, message: '请输入税务登记证', trigger: 'change' }],
  'archiveExpandVO.legalPersonName': [{ required: true, message: '请输入法人姓名', trigger: 'change' }],
  'archiveExpandVO.idType': [{ required: true, message: '请输入证件类型', trigger: 'change' }],
  'archiveExpandVO.idNumber': [
    { required: true, message: '请输入证件号码', trigger: 'blur' },
    { pattern: validatorRules.idNumber, message: '请输入正确证件号码', trigger: 'change' }
  ],
  'archiveExpandVO.idBegin': [{ required: true, message: '请输入证件有效期', trigger: 'change' }],
  'archiveExpandVO.idFrontUrl': [{ required: true, message: '请输入身份证正面照', trigger: 'change' }],
  'archiveExpandVO.idBackUrl': [{ required: true, message: '请输入身份证背面照', trigger: 'change' }],
  'archiveExpandVO.hardIdUrl': [{ required: true, message: '请输入手持身份证正面照', trigger: 'change' }],
  'archiveExpandVO.openingPermitUrl': [{ required: true, message: '请输入开户许可证', trigger: 'change' }],
  'archiveExpandVO.bankCardFrontUrl': [{ required: true, message: '请输入银行卡正面照', trigger: 'change' }],
  'archiveExpandVO.bank': [{ required: true, message: '请输入银行', trigger: 'change' }],
  'archiveExpandVO.bankName': [{ required: true, message: '请输入银行', trigger: 'change' }],
  'archiveExpandVO.bankSub': [{ required: true, message: '请输入所属支行', trigger: 'change' }],
  'archiveExpandVO.bankCard': [
    { required: true, message: '请输入银行账号', trigger: 'blur' },
    { pattern: validatorRules.bankCard, message: '请输入正确银行账号', trigger: 'change'}
  ],
  'archiveExpandVO.bankAccountName': [{ required: true, message: '请输入账户名', trigger: 'change' }],
  'archiveExpandVO.bankArea': [{ required: true, message: '请输入银行所在地区', trigger: 'change' }],
  'archiveBaseVO.fixFeeRate': [{ required: true, message: '请选择小微交易费率', trigger: 'change' }]
}

export const refundForm = {
  remark: ''
}

export const refundRules = {
  remark: [{ required: true, message: '请输入审核不能过的原因', trigger: 'change' }]
}
