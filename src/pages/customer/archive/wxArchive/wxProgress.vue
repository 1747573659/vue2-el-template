<template>
  <div class="p-progress-con data-box" v-loading="progressLoad">
    <header class="p-progress-header">
      <p>商户名称：{{ merchantDetail.merchantAdminName }}</p>
      <p>申请单号：{{ merchantDetail.applymentId }}</p>
    </header>
    <el-timeline>
      <el-timeline-item v-for="(item, index) in timelineData" :key="index" :timestamp="item.time" :icon="item.time ? 'el-icon-success' : ''" :color="item.color">
        <header>{{ item.title }}</header>
        <section>
          <template v-if="item.directAuditStatus === 7">
            <p>当前申请单正在审核中，预计1-2个工作日内完成审核，请耐心等待</p>
            <p>
              请指引超级管理员
              <span class="e-progress-concat">{{ item.contact }}</span> 使用微信扫以下二维码（30天有效，过期后将生成新二维码），完成核对联系信息后，可接收申请单进展通知
              <router-link :to="{ name: 'archiveWiki', query: { type: 1 } }">核对联系信息指引</router-link>
            </p>
          </template>
          <template v-if="item.directAuditStatus === 10">
            <p>
              请指引申请单超级管理员 <span class="e-progress-concat">{{ item.contact }}</span> ，使用微信扫以下二维码（30天有效，过期后将生成新二维码），完成账户验证及签约
              <router-link :to="{ name: 'archiveWiki', query: { type: 2 } }">账号验证引导</router-link>
            </p>
          </template>
          <template v-if="item.directAuditStatus === 11">
            <p>
              请指引申请单超级管理员 <span class="e-progress-concat">{{ item.contact }}</span> ，使用微信扫以下二维码（30天有效，过期后将生成新二维码），完成签约
              <router-link :to="{ name: 'archiveWiki', query: { type: 3 } }">签约引导</router-link>
            </p>
          </template>
          <img :src="item.signUrl" alt="" v-if="item.signUrl" />
        </section>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { queryDirectArchiveApplySchedule } from '@/api/wxArchive'

export default {
  data() {
    return {
      progressLoad: false,
      merchantDetail: {},
      timelineData: [
        {
          title: '提交申请',
          timeAttr: 'applyTime',
          status: ''
        },
        {
          title: '平台审核',
          timeAttr: 'auditTime',
          status: 7
        },
        {
          title: '账号验证',
          timeAttr: 'verifyTime',
          status: 10
        },
        {
          title: '签署协议',
          status: 11
        }
      ]
    }
  },
  mounted() {
    this.handleApplySchedule()
  },
  methods: {
    handleApplySchedule: async function() {
      try {
        this.progressLoad = true
        const res = await queryDirectArchiveApplySchedule({ id: this.$route?.query?.id ?? '' })
        this.timelineData = this.timelineData.map(item => {
          let auditStatus = res.directAuditStatus === item.status
          item.time = auditStatus || (res.directAuditStatus === 7 && item.status === 10) ? '' : res[item.timeAttr]
          item.contact = auditStatus ? res.contact : ''
          item.signUrl = auditStatus ? res.signUrl : ''
          item.directAuditStatus = auditStatus ? res.directAuditStatus : ''
          item.color = auditStatus ? '#00c250' : ''
          return item
        })
        const { merchantAdminName, applymentId } = res
        this.merchantDetail = { merchantAdminName, applymentId }
      } catch (error) {
      } finally {
        this.progressLoad = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-progress-con {
  padding: 20px 50px 50px 40px;
  border-top: 16px solid #f7f8fa;
  .p-progress-header {
    display: flex;
    background-color: #f9f9f9;
    padding: 10px 35px;
    margin-bottom: 40px;
    font-size: 14px;
    line-height: 40px;
    p {
      & + p {
        margin-left: 30px;
      }
    }
  }
  /deep/ {
    .el-timeline-item__icon {
      font-size: 24px;
      color: #00c250;
    }
    .el-timeline-item__content section {
      color: #999;
      line-height: 1.5;
      a {
        color: #4466ad;
        &:hover {
          text-decoration: underline;
        }
      }
      img {
        width: 140px;
        height: 140px;
        margin-top: 10px;
        vertical-align: top;
      }
    }
    .el-timeline-item__tail {
      border-width: 1px;
    }
  }
}
.e-progress-concat {
  color: #00c250;
}
</style>
