<template>
  <el-dialog v-bind="$attrs" title="查看协议" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body>
    <embed src="https://static-oss.cs.kemai.com.cn/boss/uploadFiles/1/a4a1876918a94fb1a4ac8a5646e18716.pdf" type="" width="100%" height="600" />
    <div class="e-protocol-center e-protocol-pd-checkbox">
      <el-checkbox v-model="isReadAndAgree">我已阅读并同意以上协议内容</el-checkbox>
    </div>
    <div slot="footer" class="e-protocol-center">
      <el-button :disabled="!isReadAndAgree" :loading="checkProtocolLoad" @click="handleProtocolstatus" type="primary" size="small">我已确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapMutations } from 'vuex'
import { getLocal } from '@/utils/storage'

import { insertRebateRecord } from '@/api/login'

export default {
  data() {
    return {
      isReadAndAgree: false,
      checkProtocolLoad: false
    }
  },
  methods: {
    ...mapMutations({
      setProtocolstatus: 'SET_PROTOCOLSTATUS'
    }),
    handleProtocolstatus() {
      const userInfo = JSON.parse(getLocal('userInfo'))
      this.checkProtocolLoad = true
      insertRebateRecord({ agentId: userInfo.agentId, userId: userInfo.id })
        .then(() => {
          this.setProtocolstatus(false)
        })
        .catch(() => {})
        .finally(() => {
          this.checkProtocolLoad = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.e-protocol-center {
  text-align: center;
}
.e-protocol-pd-checkbox {
  padding-top: 20px;
}
</style>
