<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :headers="{'token': token}"
      accept="image/gif,image/jpeg,image/jpg,image/png"
      :show-file-list="false"
      :on-error="uploadErrer"
      :on-success="uploadSuccess"
      :before-upload="beforeUpload">
      <img v-if="imageUrl" @click="imgClick" :src="fileServer + imageUrl" class="avatar" :class="{card: card}" :alt="alt">
      <div class="before-upload" :class="{card: card}" v-else>
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
      要求图片清晰可见，2.2MB以内
      <el-popover
        class="upload-example-popover"
        placement="bottom"
        :title="title"
        width="313"
        trigger="hover">
        <img class="upload-example-img" :src="exampleImg" alt="">
        <span class="upload-example-text" slot="reference">图片示例</span>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { getLocal } from '@/utils/storage'
export default {
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/uploadPic',
      token: getLocal('token'),
      imageUrl: '',
      title: this.alt + '示例:'
    }
  },
  props: {
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
      this.imageUrl = res.data.path
    },
    beforeUpload(file) {
      let imgTypes = 'image/gif,image/jpeg,image/jpg,image/png'
      const isJPG = imgTypes.indexOf(file.type) >= 0
      const isLt2M = file.size / 1024 / 1024 < 2.2
      if (!isJPG) {
        return this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        return this.$message.error('上传头像图片大小不能超过 2MB!')
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
.avatar-uploader /deep/.el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  border: 1px dashed #D3DBEB;
  background: #F7F8FA;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
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
  color: #8F9BB3;
  line-height: 14px;
}
.before-upload {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column
}
.upload-require {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #CAD1E0;
  line-height: 20px;
  .upload-example-text {
    padding-left: 12px;
    color: #3377FF;
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