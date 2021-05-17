<template>
  <section>
    <main class="p-home">
      <img v-if="homeImgUrl" :src="homeImgUrl" alt="首页" />
      <img v-else src="../../assets/images/home/home.png" alt="首页" />
    </main>
    <el-dialog :visible.sync="xftAuditStatus" :before-close="handleAuditStatus" title="提示" width="490px">
      <p>您的享付通进件资料被驳回，请修改或补充资料后重新提交！</p>
      <div slot="footer">
        <el-button @click="handleAuditStatus" size="small">取消</el-button>
        <el-button type="primary" @click="$router.push({ name: 'xftArchive' });handleAuditStatus()" size="small">前往</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { queryBackgroundById } from '@/api/login'
export default {
  data () {
    return {
      homeImgUrl: ''
    }
  },
  computed: {
    ...mapGetters({
      xftAuditStatus: 'xftAuditStatus'
    })
  },
  created () {
    this.queryBackgroundById()
    this.homeImgUrl = localStorage.getItem('homeImgUrl') || ''
  },
  methods: {
    async queryBackgroundById () {
      const res = await queryBackgroundById({
        systemId: 1
      })
      if (res) {
        this.homeImgUrl = res.server + '/' + res.path
        localStorage.setItem('homeImgUrl', this.homeImgUrl)
      }
    },
    ...mapMutations({
      setAuditStatus: 'SET_AUDITSTATUS'
    }),
    handleAuditStatus () {
      this.setAuditStatus(false)
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
