<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="actionUrl"
      :accept="accept"
      :headers="{ token }"
      :before-upload="beforeUpload"
      :on-error="onError"
      :show-file-list="false"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <img v-if="imageUrl" class="avatar" :src="`${fileServer}${imageUrl}`" @click="$listeners.click" :alt="alt" />
      <div class="avatar-uploader-card" v-else>
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <span class="avatar-uploader-text">上传照片</span>
      </div>
    </el-upload>
    <div class="avatar-upload-explain">
      <span>要求图片清晰可见，{{ fileSize }}MB以内</span>
      <el-popover v-if="exampleImg" placement="bottom" :title="`${alt}示例`" trigger="hover">
        <img class="avatar-explain-img" :src="exampleImg" :alt="`${alt}示例`" />
        <span class="el-button el-button--text" slot="reference">图片示例</span>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { getLocal } from '@/utils/storage'

export default {
  inheritAttrs: false,
  props: {
    action: {
      type: String,
      required: true,
      default: '/oss/uploadFile'
    },
    accept: {
      type: String,
      default: 'image/gif,image/jpeg,image/jpg,image/png'
    },
    fileSize: {
      type: Number,
      default: 2
    },
    alt: {
      type: String,
      default: '上传图片'
    },
    fileServer: {
      type: String,
      default: 'https://static-oss.cs.kemai.com.cn'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    exampleImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      actionUrl: `${process.env.VUE_APP_BASE_API}${this.action}`,
      token: getLocal('token')
    }
  },
  methods: {
    beforeUpload(file) {
      const fileSize = file.size / 1024 / 1024 < this.fileSize
      if (!this.accept.includes(file.type)) this.$message({ type: 'error', message: '请上传支持的图片格式' })
      if (!fileSize) this.$message({ type: 'error', message: '上传图片大小不能超过 2MB!' })
      return fileSize && this.accept.includes(file.type)
    },
    onError() {
      this.$message({ type: 'error', message: '上传失败' })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  max-height: 82px;
  /deep/ {
    .el-upload {
      border: 1px dashed #d3dbeb;
      background-color: #f7f8fa;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      display: inline-flex;
    }

    .el-upload:hover {
      border-color: #409eff;
    }
  }

  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }

  .avatar-uploader-card {
    width: 80px;
    height: 80px;
    color: #8f9bb3;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .avatar-uploader-icon {
      font-size: 18px;
    }

    .avatar-uploader-text {
      font-size: 14px;
      line-height: 14px;
      margin-top: 12px;
    }
  }
}

.avatar-upload-explain {
  color: #cad1e0;
  font-size: 14px;
  margin-top: 5px;
  line-height: 1.5;

  /deep/ {
    .el-button {
      margin-left: 12px;
    }
  }
}

.avatar-explain-img {
  width: 200px;
  height: 200px;
}
</style>
