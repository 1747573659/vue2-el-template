<template>
  <div class="app-container">
    <div class="search-box">
      <query-group
        className="all-fr"
        :queryFormList.sync="queryFormList"
        :queryParams="queryParams"
        @search="handleFilter"
      >
        <template v-slot:formheader>
          <el-form-item label="商户">
            <select-page
              :request="queryMerchantAdminPage"
              :bvalue.sync="tableParam.userId"
              :name="'companyName'"
              searchName="id"
              id="id"
              :placeholder="'商户名称'"
            >
            </select-page>
          </el-form-item>
        </template>

        <template v-slot:formfoot>
          <el-button @click="wmdownloadExcel">导出</el-button>
        </template>
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
import { queryMerchantAdminPage } from "@/api/transtionManagement";
import { wmdownloadExcel, queryWmTermPage } from "@/api/orderCenter";
import selectPage from "@/components/selectPage2/index.vue";
import {downloadBufferFile} from "@/utils"
const DOWNLOAD_URL= process.env.VUE_APP_BASE_API
export default {
  name: "validityPeriod",
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
          type: "select",
          name: "appStatus",
          label: "状态",
          value: "",
          options: [
            {
              label: "全部",
              value: "",
            },
            {
              label: "有效",
              value: "1",
            },
            {
              label: "快到期",
              value: "2",
            },
            {
              label: "已过期",
              value: "-1",
            },
          ],
        },
      ],
      list: [],
      loading: false,
      tableParam: {
        page: 1,
        rows: 10,
        userId: "",
      },
      total:0,
      headers: [
        {
          key: "shopName",
          title: "商户",
        },
        {
          key: "storeName",
          title: "门店",
        },
        {
          key: "appStatus",
          title: "状态",
          escape: (row) => {
            let str = "";
            switch (row.appStatus) {
              case 1:
                str = "有效";
                break;
              case 2:
                str = "快到期";
                break;
              case -1:
                str = "已过期";
                break;
              default:
                str = "--";
                break;
            }
            return str
          },
        },
        {
          key: "quotaType",
          title: "收费类型",
          escape: (row) => {
            let str = "";
            switch (row.quotaType) {
              case 1:
                str = "试用";
                break;
              case 2:
                str = "按年收费";
                break;
              case 3:
                str = "按单收费";
                break;
              default:
                str = "--";
                break;
            }
            return str
          }
        },
        {
          key: "buyTime",
          title: "开通日期",
        },
        {
          key: "expireTime",
          title: "到期日期",
        },
      ],
    };
  },

  methods: {
    handleFilter(e) {
      this.loading = true;
      let data = Object.assign(this.tableParam, e);
      queryWmTermPage(data)
        .then((res) => {
          this.list = res.results || [];
          this.total=res.totalCount || 0
        })
        .finally(() => {
          this.loading = false;
        });
    },
    wmdownloadExcel() {
      let data = Object.assign(this.tableParam, this.queryParams);
      downloadBufferFile(DOWNLOAD_URL+"/wm/downloadExcel",data,"POST","json")
    },
    queryMerchantAdminPage(e) {
      return queryMerchantAdminPage(e);
    },
  },
  mounted() {
    this.handleFilter();
  },
};
</script>

<style lang="scss" scoped>
</style>
