<template>
  <section>
    <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" :visible.sync="isChooseStatus" width="660px">
      <div class="pure-dialog_title" slot="title">
        <div>{{ titleName }}查询</div>
        <div>
          <i @click="handleChooseList" class="el-icon-close"></i>
        </div>
      </div>
      <el-form :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-input :placeholder="searchPlaceHolder" style="width: 400px" v-model="searchVal"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tabData" class="pure-dialog_content" v-loading="tabLoad">
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="chooseRadio"></el-radio>
          </template>
        </el-table-column>
        <el-table-column :key="item.name" :label="item.label" :prop="item.name" :width="index === 0 ? 150 : 'auto'" v-for="(item, index) in columnObj"></el-table-column>
      </el-table>
      <Pagination
        :key="chooseDiaTotal"
        :limit.sync="chooseRow"
        :page.sync="choosePage"
        :total="chooseDiaTotal"
        @pagination="handleCurrentPage"
        layout="prev,next"
        v-if="chooseDiaTotal > 0" />
      <div slot="footer">
        <el-button @click="handleChooseList">取消</el-button>
        <el-button @click="handleChooseList" type="primary">确定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  props: {
    titleName: {
      type: String,
      default: '商户号'
    },
    isChooseStatus: {
      type: Boolean,
      default: false
    },
    searchPlaceHolder: {
      type: String,
      default: ''
    },
    columnObj: {
      type: Array,
      default: function () {
        return []
      }
    },
    chooseDiaTotal: {
      type: Number,
      default: 1
    },
    tabData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      tabLoad: false,
      chooseRadio: '',
      searchVal: '',
      searchId: '',
      searchName: '',
      choosePage: 1,
      chooseRow: 6
    }
  },
  components: {
    Pagination
  },
  methods: {
    handleChooseList() {
      if (this.chooseRadio !== '') {
        this.$emit('chooseList', this.tabData[this.chooseRadio])
      }
      this.$emit('update:isChooseStatus', false)
      this.choosePage = 1
      this.chooseRadio = this.searchId = this.searchName = this.searchVal = ''
    },
    handleSearch() {
      const pattern = new RegExp(/^\d{1,}$/)
      this.searchId = this.searchName = ''
      this.choosePage = 1
      pattern.test(this.searchVal) ? (this.searchId = this.searchVal) : (this.searchName = this.searchVal)
      this.$emit('search', { id: this.searchId, name: this.searchName })
    },
    handleCurrentPage() {
      this.$emit('search', { id: this.searchId, name: this.searchName })
    }
  }
}
</script>

<style lang="scss" scoped>
.pure-dialog {
  &_title {
    display: flex;
    justify-content: space-between;
  }
  &_content {
    ::v-deep .el-radio__label {
      display: none;
    }
  }
}
</style>
