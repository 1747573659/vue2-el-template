export default function xftValidator () {
  var contactPhone = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入负责人电话'))
    } else if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback(new Error('请输入正确的电话号码'))
    } else {
      callback()
    }
  }
  var cardholderPhone = (rule, value, callback) => {
    if (!value) {
      callback('请输入预留手机号')
    } else if (!(/^1[3456789]\d{9}$/.test(value))) {
      callback('请输入正确的电话号码')
    } else {
      callback()
    }
  }
  return {
    'archiveBaseVO.merchantId': [{ required: true, message: '请选择商户', trigger: 'change' }],
    'archiveBaseVO.merchantType': [{ required: true, message: '请选择商户类型', trigger: 'change' }],
    'archiveBaseVO.superCode': [{ required: true, message: '请选择是否开通超级码', trigger: 'change' }],
    'archiveBaseVO.companyName': [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
    'archiveBaseVO.merchantShortName': [{ required: true, message: '请输入商户简称', trigger: 'blur' }],
    'archiveBaseVO.province': [{ required: true, message: '请选择地区', trigger: 'change' }],
    'archiveBaseVO.address': [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
    'archiveBaseVO.serviceTel': [{ required: true, message: '请输入客服电话', trigger: 'blur' }],
    'archiveBaseVO.contact': [{ required: true, message: '请输入负责人', trigger: 'blur' }],
    'archiveBaseVO.idNumber': [{ required: true, message: '请输入负责人证件号码', trigger: 'blur' }],
    'archiveBaseVO.contactPhone': [{ required: true, validator: contactPhone, trigger: 'blur' }],
    'archiveBaseVO.email': [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    'archiveBaseVO.mchDealType': [{ required: true, message: '请选择经营类型', trigger: 'change' }],
    'archiveBaseVO.industrId': [{ required: true, message: '请选择经营类目', trigger: 'change' }],
    'archiveExpandVO.certType': [{ required: true, message: '请选择登记证书类型', trigger: 'change' }],
    'archiveOtherVO.signboardUrl': [{ required: true, message: '请上传门店门头照', trigger: 'change' }],
    'archiveOtherVO.cashierDesk': [{ required: true, message: '请上传收银台照片', trigger: 'change' }],
    'archiveOtherVO.enterpriseInfoScreenshot': [{ required: true, message: '请上传企业信息公示网照片', trigger: 'change' }],
    'archiveOtherVO.businessSiteOneUrl': [{ required: true, message: '请上传经营场所照', trigger: 'change' }],
    'archiveOtherVO.contractOfTenancy1': [{ required: true, message: '请上传租赁合同照一', trigger: 'change' }],
    'archiveOtherVO.contractOfTenancy2': [{ required: true, message: '请上传租赁合同照二', trigger: 'change' }],
    'archiveOtherVO.contractOfTenancy3': [{ required: true, message: '请上传租赁合同照三', trigger: 'change' }],
    'archiveExpandVO.businessLicenseUrl': [{ required: true, message: '请上传营业执照', trigger: 'change' }],
    'archiveExpandVO.licId': [{ required: true, message: '请输入营业执照注册号', trigger: 'blur' }],
    'archiveExpandVO.licValidityBigen': [{ required: true, message: '请选择营业执照有效期', trigger: 'change' }],
    'archiveExpandVO.legalPersonName': [{ required: true, message: '请输入法人姓名', trigger: 'blur' }],
    'archiveExpandVO.cardType': [{ required: true, message: '请选择证件类型', trigger: 'change' }],
    'archiveExpandVO.idNumber': [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
    'archiveExpandVO.legalPersonValidityBegin': [{ required: true, message: '请选择证件有效期', trigger: 'change' }],
    'archiveExpandVO.idFrontUrl': [{ required: true, message: '请上传身份证正面照', trigger: 'change' }],
    'archiveExpandVO.idBackUrl': [{ required: true, message: '请上传身份证背面照', trigger: 'change' }],
    'archiveExpandVO.acctType': [{ required: true, message: '请选择账户类型', trigger: 'change' }],
    'archiveExpandVO.cashreceiveType': [{ required: true, message: '请选择收款类型', trigger: 'change' }],
    'archiveExpandVO.cardholderType': [{ required: true, message: '请选择持卡人类型', trigger: 'change' }],
    'archiveExpandVO.bankSub': [{ required: true, message: '请选择开户支行', trigger: 'change' }],
    'archiveExpandVO.bankProvince': [{ required: true, message: '请选择开户支行所在省市', trigger: 'change' }],
    'archiveExpandVO.bankAccountName': [{ required: true, message: '请输入账户名', trigger: 'blur' }],
    'archiveExpandVO.bankCard': [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
    'archiveExpandVO.cardholderPhone': [{ required: true, validator: cardholderPhone, trigger: 'blur' }],
    'archiveExpandVO.cardholderIdType': [{ required: true, message: '请选择持卡人证件类型', trigger: 'change' }],
    'archiveExpandVO.cardholderIdNumber': [{ required: true, message: '持卡人证件号码', trigger: 'blur' }],
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
    'archiveBaseVO.fixFeeRate': [{ required: true, message: '请选择费率', trigger: 'change' }],
    'archiveBaseVO.exchangeFeeRate': [{ required: true, message: '请选择享钱汇银费率', trigger: 'change' }],
  }
}