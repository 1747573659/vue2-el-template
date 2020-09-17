<template>
  <div class="xft-add">
    <div class="header">
      <el-row>
        <el-col :span="12" class="title-text">
          <span class="archive-title">进件状态：</span>
          <span class="archive-status">编辑中</span>
        </el-col>
        <el-col :span="12" class="title-text">
          <span class="archive-title">审核结果：</span>
          <span>你的资料不全，</span>
          <span class="archive-result">审核不通过</span>
        </el-col>
      </el-row>
    </div>
    <div class="title">基本信息</div>
    <div class="base-info">
      <el-form :disabled="formDisabled" ref="form" size="small" label-suffix=":" :inline="true" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="商户" prop="status">
              <select-page
                @remoteMethod="remoteMethod"
                @loadMore="loadMore"
                id="id"
                name="name"
                :options="shopList"
                :isMaxPage="isMaxPage"
                @focus="shopFocus"
                @change="shopChange"
                @clear="shopClear"
              >
              </select-page>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="商户类型" prop="status">
              <el-radio-group v-model="form.merchantType">
                <el-radio :label="3">持证商户</el-radio>
                <el-radio :label="6">非持证商户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="开通超级码" prop="status">
              <el-radio-group v-model="form.merchantType">
                <el-radio :label="3">是</el-radio>
                <el-radio :label="6">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="公司名称" prop="status">
              <el-input style="width:240px" v-model="form.companyName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="商户简称" prop="status">
              <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="地区" prop="status">
              <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="详细地址" prop="status">
              <el-input style="width:240px" v-model="form.companyName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="客服电话" prop="status">
              <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="负责人" prop="status">
              <el-input style="width:240px" v-model="form.companyName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="负责人证件号码" prop="status">
              <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="负责人电话" prop="status">
              <el-input style="width:240px" v-model="form.companyName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="邮箱" prop="status">
              <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="经营类型" prop="status">
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="经营类目" prop="status">
              <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="门店门头照" prop="status">
              <upload-pic
                alt="门店门头照"
                :exampleImg="exampleImg"
                @click="imgClick">
              </upload-pic>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="archive-form-item">
            <el-form-item label="企业信息公示图" prop="status">
              <upload-pic
                alt="企业信息公示图"
                :exampleImg="exampleImg"
                @click="imgClick">
              </upload-pic>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import selectPage from '@/components/selectPage'
import uploadPic from '../components/uploadPic'
export default {
  components: {
    selectPage,
    uploadPic
  },
  data() {
    return {
      form: {},
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
          'name': value,
          "page": this.selectPageNo,
          "rows": 10
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
    shopChange(value) {
    },
    imgClick() {
      alert('hahahah')
    }
  }
}
</script>

<style lang="scss" scoped>
.xft-add {
  background-color: #fff;
  margin: 16px;
  .header {
    height: 72px;
    div {
      height: 100%;
    }
    .title-text {
      padding-left: 10%;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #3D4966;
      .archive-status {
        padding: 5px 12px;
        background: #FFEFE8;
        border-radius: 3px;
        color: #FF6010;
        line-height: 14px;
      }
      .archive-result {
        color: #FF6010;
      }
    }
  }
  .title {
    height: 48px;
    padding-left: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #1F2E4D;
    line-height: 48px;
    border-bottom: 1px solid #E6E9F0;
  }
  .base-info {
    padding-top: 24px;
    .archive-form-item {
      padding-left: 10%;
    }
    /deep/.el-form-item {
      margin-bottom: 24px;
    }
  }
}
</style>
