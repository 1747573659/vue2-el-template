<template>
  <div class="guide-con data-box" v-permission.page="'WXARCHIVE_LIST_WIKI'">
    <template v-if="type === 1">
      <section class="guide-item">
        <p>1、核对联系信息获取指导</p>
        <span>在【进件管理-普通资质进件】，找到申请状态为“审核中”，点击“申请进度”按钮，进入【申请进度页面】</span>
      </section>
      <section class="guide-item">
        <p>2、将核对联系信息二维码，截图发给申请单-超级管理员（简称超管）</p>
        <img src="../../../../assets/images/guide/u2209.png" alt="" />
      </section>
      <section class="guide-item">
        <p>3、申请单的超级管理员，使用已绑定银行卡实名的微信号，扫描上述二维码，进入【核对联系信息页】，短信验证后，完成核对联系信息。</p>
        <p>附注：若手机号错误，超管可点击“手机号输入框”，修改手机号。</p>
        <img src="../../../../assets/images/guide/u2205.png" alt="" />
      </section>
      <section class="guide-item">
        <p>4、接收申请单通知</p>
        <span>超级管理员完成核对联系信息后，“微信支付商家助手”公众号后续将下发申请单进展通知，引导超级管理员完成账户验证及签约。</span>
      </section>
    </template>
    <template v-else-if="type === 2">
      <section class="guide-item">
        <p>1、账号验证获取指导</p>
        <p>在【进件管理-普通资质进件】，找到申请状态为“待验证”，点击“申请进度”按钮，进入【申请进度页面】</p>
      </section>
      <section class="guide-item">
        <p>2、将账号验证二维码，截图发给申请单-超级管理员（简称超管）</p>
        <img src="../../../../assets/images/guide/u2401.png" alt="" />
      </section>
      <section class="guide-item">
        <p>3、超级管理员查看账户验证信息</p>
        <p>申请单的超级管理员，使用已绑定银行卡实名的微信号，扫描上述二维码，完成核对联系信息后，进入【账户验证页】（页面根据申请单，显示对应的验证方式内容</p>
        <div>
          <p>（1）法人验证：超级管理员打开如下页面后，需将二维码p给商户法人，由商户法人使用已实名的微信号，扫码打开页面完成验证。</p>
          <p>法人完成验证后，等待几分钟即可进行签约。</p>
          <img src="../../../../assets/images/guide/u2393.png" alt="" />
        </div>
        <div>
          <p>（2）汇款验证：超级管理员打开如下页面后，需根据指引，汇款至指定的收款卡号。</p>
          <p>注意：需使用指定户名、指定汇款金额进行汇款。</p>
          <p>汇款后，需等待银行处理完成，预计1-2天。</p>
          <img src="../../../../assets/images/guide/u2397.png" alt="" />
        </div>
      </section>
      <section class="guide-item">
        <p>4、 完成账户验证后，即可签约</p>
        <p>完成账户验证后，超级管理员即可签约，完成全部入驻流程。</p>
      </section>
    </template>
    <template v-else>
      <section class="guide-item">
        <p>1、签约协议获取指导</p>
        <p>在【进件管理-普通资质进件】，找到申请状态为“待签约”，点击“申请进度”按钮，进入【申请进度页面】</p>
      </section>
      <section class="guide-item">
        <p>2、将签约协议二维码，截图发给申请单-超级管理员（简称超管）</p>
        <img src="../../../../assets/images/guide/u2583.png" alt="" />
      </section>
      <section class="guide-item">
        <p>3、超级管理员扫码打开，完成签约</p>
        <p>申请单的超级管理员，使用已绑定银行卡实名的微信号，扫描上述二维码，进入【签约页】，点击“确认开户并签署协议”，即完成入驻。</p>
        <p>注意：该签约环节，无需超级管理员回填验证金额，可直接完成签约。</p>
        <img src="../../../../assets/images/guide/u2587.png" alt="" />
      </section>
      <section class="guide-item">
        <p>4、完成签约后，等待系统开通权限</p>
        <p>超级管理员完成签约后，需等待系统开通权限，预计在30mins内完成。</p>
      </section>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 1
    }
  },
  created() {
    const routeMetas = [
      { type: 1, title: '核对联系信息指引' },
      { type: 2, title: '账号验证指引' },
      { type: 3, title: '签约指引' }
    ]
    this.$route.meta.title = routeMetas.filter(item => item.type === parseFloat(this.$route.query.type))[0].title
  },
  mounted() {
    this.type = Number(this.$route.query.type)
  }
}
</script>

<style lang="scss" scoped>
.guide-con {
  padding: 20px 50px 50px 40px;
  border-top: 16px solid #f7f8fa;
  .guide-item {
    padding-bottom: 15px;
    color: #666;
    line-height: 24px;
    p {
      margin-bottom: 5px;
    }
    img {
      vertical-align: top;
      margin: 15px 0 25px 0;
    }
  }
}
</style>
