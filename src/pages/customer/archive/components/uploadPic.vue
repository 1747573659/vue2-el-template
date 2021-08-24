<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :disabled="disabled"
      :action="uploadUrl"
      :headers="{ token: token }"
      accept="image/gif,image/jpeg,image/jpg,image/png"
      :show-file-list="false"
      :on-error="uploadErrer"
      :on-success="uploadSuccess"
      :on-change="handleFileUploaderChange"
      :before-upload="beforeUpload"
    >
      <img v-if="imageUrl" @click="imgClick" :src="fileServer + imageUrl" class="avatar" :class="{ card: card }" :alt="alt" />
      <div class="before-upload" :class="{ card: card }" v-else>
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <div class="upload-text">
          上传照片
          <span v-if="card === 'front'">
            (正面)
          </span>
          <span v-if="card === 'back'">
            (背面)
          </span>
        </div>
      </div>
    </el-upload>
    <div class="upload-require">
      要求图片清晰可见，2MB以内
      <el-popover class="upload-example-popover" placement="bottom" :title="title" width="313" trigger="hover">
        <img class="upload-example-img" :src="exampleImg" alt="" />
        <span class="upload-example-text" slot="reference" v-if="showExample">图片示例</span>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { getLocal } from '@/utils/storage'

export default {
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + this.uploadUrlPath,
      token: getLocal('token'),
      title: this.alt + '示例:',
      imgBase64: ''
    }
  },
  props: {
    uploadUrlPath: {
      type: String,
      default: '/uploadPic'
    },
    imagePath: {
      type: String,
      default: ''
    },
    fileServer: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    exampleImg: {
      type: String,
      default: ''
    },
    card: {
      type: String,
      default: null
    },
    showExample: {
      type: Boolean,
      default: true
    },
    hasBase64: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    imageUrl: {
      get: function() {
        return this.imagePath
      },
      set: function() {}
    }
  },
  methods: {
    uploadErrer(err) {
      this.$message({
        message: '上传失败',
        type: 'success'
      })
    },
    uploadSuccess(res, file) {
      if (res.data) {
        if (res.data) this.imageUrl = res.data.path
        if (this.hasBase64) this.$emit('on-success', res, this.imgBase64)
        else this.$emit('on-success', res)
      } else this.$message({ type: 'error', message: res.msg })
    },
    handleFileUploaderChange(file) {
      if (this.hasBase64) {
        let self = this
        let reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = function() {
          self.imgBase64 = reader.result
        }
      }
    },
    beforeUpload(file) {
      let imgTypes = 'image/gif,image/jpeg,image/jpg,image/png'
      const isJPG = imgTypes.indexOf(file.type) >= 0
      const isLt2M = file.size / 1024 / 1024 < 2.2
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M && isJPG
    },
    imgClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader /deep/ .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  border: 1px dashed #d3dbeb;
  background: #f7f8fa;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

.upload-text {
  margin-top: 12px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #8f9bb3;
  line-height: 14px;
}

.before-upload {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.upload-require {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #cad1e0;
  line-height: 20px;

  .upload-example-text {
    padding-left: 12px;
    color: #3377ff;
    cursor: pointer;
  }
}

.upload-example-img {
  width: 289px;
  height: 183px;
}

.card {
  width: 180px;
  height: 120px;
}
</style>
