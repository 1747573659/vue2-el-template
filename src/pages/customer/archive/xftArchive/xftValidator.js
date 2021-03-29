export default function xftValidator() {
  const validatorRules = {
    serviceTel: /(^(\d{11})$|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
    idNumber: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    mobildPhone: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
    licId: /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10,12}$)|(^\d{15,20}$)/,
    bankCard: /^[0-9]\d{5,29}$/
  }
  return {
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
    'archiveBaseVO.contact': [{ required: true, message: '请输入负责人', trigger: 'blur' }],
    'archiveBaseVO.idNumber': [
      { required: true, message: '请输入负责人证件号码', trigger: 'blur' },
      { pattern: validatorRules.idNumber, message: '请输入正确的负责人证件号码', trigger: 'change' }
    ],
    'archiveBaseVO.contactPhone': [
      { required: true, message: '请输入负责人电话', trigger: 'blur' },
      { pattern: validatorRules.mobildPhone, message: '请输入正确的负责人电话', trigger: 'change' }
    ],
    'archiveBaseVO.email': [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
    ],
    'archiveBaseVO.mchDealType': [{ required: true, message: '请选择经营类型', trigger: 'change' }],
    'archiveBaseVO.industrId': [{ required: true, message: '请选择经营类目', trigger: 'change' }],
    'archiveExpandVO.certType': [{ required: true, message: '请选择登记证书类型', trigger: 'change' }],
    'archiveOtherVO.signboardUrl': [{ required: true, message: '请上传门店门头照', trigger: 'change' }],
    'archiveOtherVO.cashierDesk': [{ required: true, message: '请上传收银台照片', trigger: 'change' }],
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
    'archiveExpandVO.idFrontUrl': [{ required: true, message: '请上传身份证正面照', trigger: 'change' }],
    'archiveExpandVO.idBackUrl': [{ required: true, message: '请上传身份证背面照', trigger: 'change' }],
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
    'archiveExpandVO.bankCardBackUrl': [{ required: true, message: '请上传身份证背面照', trigger: 'change' }],
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
      { validator(rule, value, callback, source, options){
        parseFloat(value) === 0 ? callback(new Error('费率不能为0')) : callback([])
      }}
    ],
    'archiveBaseVO.exchangeFeeRate': [
      { required: true, message: '请选择费率', trigger: 'blur' },
      { validator(rule, value, callback, source, options){
        parseFloat(value) === 0 ? callback(new Error('费率不能为0')) : callback([])
      }}
    ]
  }
}
