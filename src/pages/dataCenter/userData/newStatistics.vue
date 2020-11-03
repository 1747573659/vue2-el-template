<template>
  <div class="app-container">
    <div class="search-box">
      <div class="xdd_tip"><i class="el-icon-info"></i>
单次查询月份的最长跨度为6个月</div>
      <query-group
        className="xdd-btn-block__w240"
        :queryFormList.sync="queryFormList"
        :queryParams="queryParams"
        @search="handleFilter"
      >
        <template v-slot:formheader>
          <el-form-item label="代理商">
            <select-page
              :request="queryAgentPage"
              :bvalue.sync="tableParam.userId"
              :name="'name'"
              searchName="id"
              :width="'240px'"
              id="userId"
              :placeholder="'代理商名称'"
            >
            </select-page>
          </el-form-item>
        </template>
        <!-- <template v-slot:formfoot>
            <el-button v-permission.page="'ACCOUNT_ROLE_ADD,ORDERCENTER_VALIDITYQUERY_TAKEAWAYPERIOD_EXPORT'"  size="small" @click="wmdownloadExcel">导出</el-button>
        </template> -->
      </query-group>
    </div>
    <div class="data-box">
      <base-table
        :columns="headers"
        :list="list"
        :loading="loading"
        :total="total"
        @getList="handleFilter(queryParams)"
        :page.sync="tableParam.page"
        :rows.sync="tableParam.rows"
      ></base-table>
    </div>
  </div>
</template>
<script>
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryGroup from "@/components/queryGroup";
import { queryAgentPage } from "@/api/customer/agent";
import { userdataCount } from "@/api/dataCenter/userData.js";
import selectPage from "@/components/selectPage2/index.vue";
import { downloadBufferFile } from "@/utils";
const DOWNLOAD_URL = process.env.VUE_APP_BASE_API;
export default {
  name: "newStatistics",
  mixins: [listMixins],
  components: {
    selectPage,
    baseTable,
    queryGroup,
  },
  data() {
    return {
      queryFormList: [
        {
          type: 'daterange',
          name: 'time',
          label: '日期：',
          placeholder: '请选择日期',
          value: []
        }
      ],
      list: [],
      loading: false,
      tableParam: {
        page: 1,
        rows: 10,
        userId: "",
        startTime: "",
        endTime: ""
      },
      total: 0,
      headers: [
        {
          key: "agentName",
          title: "代理商名称",
          // escape: (row) => {
          //   return "[" + row.agentName + "]" + row.agentName;
          // },
        },
        {
          key: "shopNew",
          title: "新增商户数",
          // escape: (row) => {
          //   return "[" + row.shopId + "]" + row.shopName;
          // },
        },
        {
          key: "shopTotal",
          title: "商户总数",
          // escape: (row) => {
          //   return "[" + row.shopId + "]" + row.shopName;
          // },
        },
        {
          key: "storeNew",
          title: "新增门店数",
          // escape: (row) => {
          //   return "[" + row.shopId + "]" + row.shopName;
          // },
        },
        {
          key: "storeTotal",
          title: "门店总数",
          // escape: (row) => {
          //   return "[" + row.shopId + "]" + row.shopName;
          // },
        },
      ],
    };
  },
  methods: {
    handleFilter(e) {
      this.loading = true;
      let data = Object.assign(this.tableParam, e);
      userdataCount(data)
        .then((res) => {
          this.list = res.results || [];
          this.total = res.totalCount || 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // wmdownloadExcel() {
    //   let data = Object.assign(this.tableParam, this.queryParams);
    //   downloadBufferFile(
    //     DOWNLOAD_URL + "/wm/downloadExcel",
    //     data,
    //     "POST",
    //     "json"
    //   );
    // },
    queryAgentPage(e) {
      return queryAgentPage(e);
    },
  },
  mounted() {
    this.handleFilter();
  },
};
</script>
<style lang="scss" scoped>
.xdd_tip{
    background: #E5EDFD;
    border: 1px solid #A6C4FE;
    padding: 8px 30px;
    margin-bottom: 20px;
    color: #3D4966;
    font-size: 14px;
}
.xdd_tip i{
    color: #3377FF;
}
</style>
