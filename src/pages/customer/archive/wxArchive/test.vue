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
        <el-form class="p-wxArchive-baseInfo" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户">
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
              <el-form-item label="进件类型" prop="status">
                <el-radio-group v-model="form.merchantType">
                  <el-radio :label="3">微信直连</el-radio>
                  <el-radio :label="6">小微商户</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业场景" prop="status">
                <el-checkbox-group v-model="test">
                  <el-checkbox label="1">公众号</el-checkbox>
                  <el-checkbox label="2">小程序</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公众号APPID" prop="status">
                <el-input placeholder="请输入公众号APPID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="小程序APPID" prop="status">
                <el-input placeholder="请输入小程序APPID"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商户类型" prop="status">
                <el-radio-group v-model="form.merchantType">
                  <el-radio :label="3">个体工商户</el-radio>
                  <el-radio :label="6">企业</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司名称" prop="status">
                <el-input placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户简称" prop="status">
                <el-input placeholder="请输入公司简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="地区" prop="status">
                <area-select @change="areaChange"></area-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址" prop="status">
                <el-input placeholder="请输入公司简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="status">
                <el-input placeholder="请输入联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人电话" prop="status">
                <el-input placeholder="请输入联系人电话"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="邮箱" prop="status">
                <el-input placeholder="请输入邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店门头照" prop="status">
                <upload-pic alt="门店门头照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照1" prop="status">
                <upload-pic alt="经营场所照1" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照2" prop="status">
                <upload-pic alt="经营场所照2" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="经营场所照3" prop="status">
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
      <div class="p-wxArchive-item">
        <div class="p-wxArchive-itemTitle">营业执照</div>
        <el-form class="p-wxArchive-baseInfo" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="证件类型" prop="status">
                <el-radio-group v-model="form.merchantType">
                  <el-radio :label="3">多证合一</el-radio>
                  <el-radio :label="6">旧证</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="营业执照" prop="status">
                <upload-pic alt="营业执照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="类目特殊资质" prop="status">
                <upload-pic alt="类目特殊资质" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业执照注册号" prop="status">
                <el-input placeholder="营业执照注册号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="营业执照有效期" prop="status">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="archive-form-item">
              <el-form-item label="经营范围" prop="status">
                <el-input style="width: 240px" type="textarea" :autosize="{ minRows: 3 }" placeholder="" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="archive-form-item">
              <el-form-item label="经营类目" prop="status">
                <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="archive-form-item">
              <el-form-item label="售卖商品描述" prop="status">
                <el-input style="width: 240px" type="textarea" :autosize="{ minRows: 3 }" placeholder="" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="组织机构代码号" prop="status">
                <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="组织机构代码有效期" prop="status">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="组织机构代码证" prop="status">
                <upload-pic alt="组织机构代码证" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="税务登记证" prop="status">
                <upload-pic alt="税务登记证" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="p-wxArchive-item">
        <div class="p-wxArchive-itemTitle">法人信息</div>
        <el-form class="p-wxArchive-baseInfo" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="法人姓名" prop="status">
                <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件类型" prop="status">
                <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件号码" prop="status">
                <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="证件有效期" prop="status">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="身份证正面照" prop="status">
                <upload-pic alt="身份证正面照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="身份证背面照" prop="status">
                <upload-pic alt="身份证背面照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="手持身份证正面照" prop="status">
                <upload-pic alt="手持身份证正面照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="p-wxArchive-item">
        <div class="p-wxArchive-itemTitle">银行卡资料</div>
        <el-form class="p-wxArchive-baseInfo" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
          <el-row>
            <el-col :span="24" class="archive-form-item">
              <el-form-item label="银行卡正面照" prop="status">
                <upload-pic alt="银行卡正面照" :exampleImg="exampleImg" @click="imgClick"> </upload-pic>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行" prop="status">
                <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="所属支行" prop="status">
                <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="银行账号" prop="status">
                <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="账户名" prop="status">
                <el-input style="width:240px" v-model="form.companyShortName" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行所在地区" prop="status">
                <area-select @change="areaChange"></area-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="p-wxArchive-item">
        <div class="p-wxArchive-itemTitle">费率</div>
        <el-form class="p-wxArchive-baseInfo" :disabled="formDisabled" size="small" label-suffix=":" :inline="true" label-width="252px">
          <el-row>
            <el-col :span="12" class="archive-form-item">
              <el-form-item label="费率" prop="status">
                <el-select style="width: 240px" clearable v-model="form.status" placeholder="全部">
                  <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <div class="p-wxArchive-action">
      <el-button size="small" type="primary" class="e-wxArchive-action_pd">保存</el-button>
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
      test: [1],
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
