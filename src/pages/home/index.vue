<template>
  <section>
    <main class="p-home">
      <img src="../../assets/images/home/home.png" alt="首页" />
    </main>
    <el-dialog :visible.sync="showXftAuditStatus" :before-close="handleAuditStatus" title="提示" width="490px">
      <p>您的享付通进件资料被驳回，请修改或补充资料后重新提交！</p>
      <div slot="footer">
        <el-button @click="handleAuditStatus" size="small">取消</el-button>
        <el-button type="primary" @click="handleGoToXft" size="small">前往</el-button>
      </div>
    </el-dialog>
    <nonactivated-xq-dialog :visible.sync="showNoNactivatedXq"></nonactivated-xq-dialog>
    <check-pass-view :visible.sync="checkPwdVisible" v-if="environment" />
    <protocol-dialog :visible.sync="showProtocolStatus" />
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

import nonactivatedXqDialog from './components/nonactivatedXqDialog.vue'
import checkPassView from './components/checkPass.vue'
import protocolDialog from './components/protocolDialog'

export default {
  data() {
    return {
      environment: process.env.VUE_APP_FLAG === 'pro'
    }
  },
  components: {
    nonactivatedXqDialog,
    checkPassView,
    protocolDialog
  },
  computed: {
    ...mapGetters({
      xftAuditStatus: 'xftAuditStatus',
      nonactivatedXq: 'nonactivatedXq',
      checkPwdVisible: 'checkPwdVisible',
      checkProtocolStatus: 'checkProtocolStatus'
    }),
    // 当提示享钱的弹窗关闭之后再去提示进件相关的弹窗
    showXftAuditStatus() {
      return !this.checkPwdVisible && !this.checkProtocolStatus && !this.nonactivatedXq && this.xftAuditStatus
    },
    showNoNactivatedXq() {
      return !this.checkPwdVisible && !this.checkProtocolStatus && this.nonactivatedXq
    },
    showProtocolStatus() {
      if (process.env.VUE_APP_FLAG === 'pro') return !this.checkPwdVisible && this.checkProtocolStatus
      else return this.checkProtocolStatus
    }
  },
  methods: {
    ...mapMutations({
      setAuditStatus: 'SET_AUDITSTATUS'
    }),
    handleAuditStatus() {
      this.setAuditStatus(false)
    },
    handleGoToXft() {
      this.$router.push({ name: 'xftArchive' })
      this.handleAuditStatus()
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-home {
    width: 100%;
    height: calc(100vh - 56px - 48px);
    min-height: calc(100vh - 56px - 48px);
    text-align: center;
    background-color: #fff;
    img {
      width: 100%;
      max-width: 1440px;
      height: 100%;
      padding: 0 20px;
      @media screen and (max-width: 1440px) {
        max-width: 1366px;
      }
      @media screen and (max-width: 1366px) {
        max-width: 1200px;
      }
    }
  }
}
</style>
