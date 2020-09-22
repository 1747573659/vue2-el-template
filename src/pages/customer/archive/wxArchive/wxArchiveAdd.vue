<template>
  <section class="p-wxArchive-con">
    <header>
      <el-row>
        <el-col :span="12">
          <label>进件状态：</label>
          <span class="e-wxArchive-status_pd e-wxArchive-warning">编辑中</span>
        </el-col>
        <el-col :span="12">
          <label>进件状态：</label>
          <span>你的资料不全，</span>
          <span class="e-wxArchive-warning">审核不通过</span>
        </el-col>
      </el-row>
    </header>
    <section>
      <div class="p-wxArchive-item">
        <div class="p-wxArchive-itemTitle">基本信息</div>
        <el-form ref="form" class="p-wxArchive-baseInfo" :model="form" :rules="rules" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户" prop="archiveBaseVO.merchantId">
                <select-page
                  id="id"
                  name="name"
                  :options="shopList"
                  :isMaxPage="isMaxPage"
                  @loadMore="loadMore"
                  @remoteMethod="remoteMethod"
                  @focus="shopFocus"
                  @change="shopChange"
                  @clear="shopClear"
                >
                </select-page>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="进件类型">
                <el-radio-group v-model="form.merchantType">
                  <el-radio :label="3">微信直连</el-radio>
                  <el-radio :label="6">小微商户</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业场景">
                <el-checkbox-group v-model="test">
                  <el-checkbox label="1">公众号</el-checkbox>
                  <el-checkbox label="2">小程序</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公众号APPID" prop="archiveBaseVO.appid">
                <el-input placeholder="请输入公众号APPID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小程序APPID" prop="archiveBaseVO.appletId">
                <el-input placeholder="请输入小程序APPID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商户类型">
                <el-radio-group v-model="form.merchantType">
                  <el-radio :label="3">个体工商户</el-radio>
                  <el-radio :label="6">企业</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="archiveBaseVO.companyName">
                <el-input placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户简称" prop="archiveBaseVO.merchantShortName">
                <el-input placeholder="请输入公司简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区" prop="archiveBaseVO.area">
                <area-select @change="areaChange"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址" prop="archiveBaseVO.address">
                <el-input placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="archiveBaseVO.contact">
                <el-input placeholder="请输入联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="archiveBaseVO.contactPhone">
                <el-input placeholder="请输入联系人电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮箱" prop="archiveBaseVO.email">
                <el-input placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店门头照" prop="archiveOtherVO.signboardUrl">
                <upload-pic alt="门店门头照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照1" prop="archiveOtherVO.businessSiteOneUrl">
                <upload-pic alt="经营场所照1" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照2" prop="archiveOtherVO.businessSiteTwoUrl">
                <upload-pic alt="经营场所照2" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照3" prop="archiveOtherVO.businessSiteThreeUrl">
                <upload-pic alt="经营场所照3" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场地证明" prop="status">
                <upload-pic alt="经营场地证明" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补充资料1" prop="status">
                <upload-pic alt="补充资料1" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="补充资料2" prop="status">
                <upload-pic alt="补充资料2" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <div class="p-wxArchive-action">
      <el-button size="small" type="primary" class="e-wxArchive-action_pd" @click="handleArchive">保存</el-button>
      <el-button size="small" type="primary" plain class="e-wxArchive-action_pd">新增</el-button>
      <el-button size="small" class="e-wxArchive-action_pd">拒绝</el-button>
      <el-button size="small" class="e-wxArchive-action_pd">取消</el-button>
    </div>
  </section>
</template>

<script>
import selectPage from '@/components/selectPage'
import uploadPic from '../components/uploadPic'
import areaSelect from '@/components/areaSelect'

export default {
  components: {
    selectPage,
    uploadPic,
    areaSelect
  },
  data() {
    return {
      form: {
        archiveBaseVO: {
          merchantId: '', // 商户
          merchantName: '', // 商户名称
          archiveType: '', // 进件类型
          appid: '', // 公众号APPID
          appletId: '', // 小程序APPID
          merchantType: '', // 商户类型
          companyName: '', // 公司名称
          merchantShortName: '', // 商户简称
          province: '', // 省
          provinceName: '',
          city: '', // 市
          cityName: '',
          area: '', // 区
          areaName: '',
          address: '', // 详细地址
          contact: '', // 联系人/负责人
          contactPhone: '', // 联系人手机号/负责人联系方式
          email: '' // 联系人邮箱
        },
        archiveOtherVO: {
          signboardUrl: '', // 门店门头照
          businessSiteOneUrl: '', // 经营场所照片1
          businessSiteTwoUrl: '', // 经营场所照片2
          businessSiteThreeUrl: '', // 经营场所照片3
          businessSiteUrl: '', // 经营场地证明
          additionalOneUrl: '', // 补充材料1
          additionalTwoUrl: '' // 补充材料2
        }
      },
      rules: {
        'archiveBaseVO.merchantId': [{ required: true, message: '请选择商户类型', trigger: 'change' }],
        'archiveBaseVO.appid': [{ required: true, message: '请输入公众号APPID', trigger: 'change' }],
        'archiveBaseVO.appletId': [{ required: true, message: '请输入小程序APPID', trigger: 'change' }],
        'archiveBaseVO.companyName': [{ required: true, message: '请输入公司名称', trigger: 'change' }],
        'archiveBaseVO.merchantShortName': [{ required: true, message: '请输入公司简称', trigger: 'change' }],
        'archiveBaseVO.area': [{ required: true, message: '请输入地区', trigger: 'change' }],
        'archiveBaseVO.address': [{ required: true, message: '请输入详细地址', trigger: 'change' }],
        'archiveBaseVO.contact': [{ required: true, message: '请输入联系人', trigger: 'change' }],
        'archiveBaseVO.contactPhone': [{ required: true, message: '请输入联系人电话', trigger: 'change' }],
        'archiveBaseVO.email': [{ required: true, message: '请输入邮箱', trigger: 'change' }],
        'archiveOtherVO.signboardUrl': [{ required: true, message: '请输入门店门头照', trigger: 'change' }],
        'archiveOtherVO.businessSiteOneUrl': [{ required: true, message: '请输入经营场所照1', trigger: 'change' }],
        'archiveOtherVO.businessSiteTwoUrl': [{ required: true, message: '请输入经营场所照2', trigger: 'change' }],
        'archiveOtherVO.businessSiteThreeUrl': [{ required: true, message: '请输入经营场所照3', trigger: 'change' }]
      },
      test: [1],
      statusList: [],
      shopList: [],
      selectPageNo: 1,
      formDisabled: false,
      isMaxPage: false,
      searchString: '',
      exampleImg: require('@/assets/images/home/home.png')
    }
  },
  methods: {
    handleArchive(){
      this.$refs.form.validate(valid => {
        
      })
    },
    remoteMethod(value) {
      // 当没有输入任何值或者输入新的值的时候，就把相关数据进行情况
      if (!value || (this.searchString !== '' && value !== this.searchString)) {
        this.selectPageNo = 1
        this.searchString = ''
        this.isMaxPage = false
        this.shopList = []
      }
      // 只有value有值的时候才去请求接口
      if (value) {
        let data = {
          name: value,
          page: this.selectPageNo,
          rows: 10
        }
        import('@/api/setting/account').then(async module => {
          const res = await module.queryPage(data)
          // 如果分页返回有数据，就将数据加入list，如果接口返回数据长度不为10，则说明为最后一页
          if (res.results && res.results.length !== 0) {
            this.shopList = this.shopList.concat(res.results)
            this.searchString = value
            if (res.results?.length !== 10) {
              this.isMaxPage = true
            }
          }
        })
      }
    },
    loadMore() {
      // 如果不是最后一页就加载下一页
      if (!this.isMaxPage) {
        this.selectPageNo++
        this.remoteMethod(this.searchString)
      }
    },
    // 如果点击了清除按钮则将相关数据清空
    shopClear() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    // 每次focus都将相关数据清空
    shopFocus() {
      this.isMaxPage = false
      this.shopList = []
      this.searchString = ''
      this.selectPageNo = 1
    },
    shopChange(value) {},
    imgClick() {
      if (this.formDisabled) alert('hahahah')
    },
    areaChange(value) {
      console.log(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.p {
  &-wxArchive {
    &-con {
      margin: 16px 16px 72px;
      background-color: #fff;
      header {
        /deep/ .el-col {
          height: 72px;
          display: flex;
          align-items: center;
          padding-left: 10%;
          color: #3d4966;
          font-size: 14px;
        }
      }
    }
    &-itemTitle {
      height: 48px;
      line-height: 48px;
      padding-left: 16px;
      font-size: 16px;
      color: #1f2e4d;
      border-bottom: 1px solid #e6e9f0;
      font-weight: 500;
    }
    &-baseInfo {
      padding-top: 24px;
    }
    &-action {
      width: 100%;
      height: 56px;
      position: fixed;
      bottom: 0;
      background-color: #fff;
      line-height: 56px;
      text-align: center;
      box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.03);
    }
  }
}
.e {
  &-wxArchive {
    &-warning {
      color: #ff6010;
    }
    &-status {
      &_pd {
        padding: 5px 12px;
        background: #ffefe8;
      }
    }
    &-action {
      &_pd {
        padding: 8px 22px;
      }
    }
  }
}
</style>
