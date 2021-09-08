<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" title="选择收货地址" class="p-address-con">
    <div class="p-address-tips">注意：订单保存后会自动保存地址，最多支持10个地址信息</div>
    <el-table :data="addressData" class="p-address-tab" v-loading="checkAddressTabLock">
      <el-table-column label="选择" header-align="center" align="center" width="80">
        <template slot-scope="scope">
          <el-radio v-model="scope.row.check"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="receiveUser" label="收货人" width="120"></el-table-column>
      <el-table-column prop="receiveUserPhone" label="收货人电话" width="150"></el-table-column>
      <el-table-column label="详细地址">
        <template slot-scope="scope">{{scope.row.address}}</template>
      </el-table-column>
      <el-table-column label="操作" align="right" width="130">
        <template slot-scope="scope">
          <el-button type="text" v-if="!scope.row.usageStatus" @click="handleAddressDefault(scope.row)">设为默认</el-button>
          <el-popconfirm class="el-button el-button--text" @confirm="handleDelAddress(scope.row)" placement="top-start" title="确定删除所选数据吗？">
            <el-button type="text" size="small" slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="$emit('update:visible', false)" size="small">取消</el-button>
      <el-button type="primary" @click="handleAddress" size="small">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { queryById, updateUsage, deleteAddress } from '@/api/orderCenter/orderManagement'
import { getLocal } from '@/utils/storage'

export default {
  data() {
    return {
      addressData: [],
      checkAddressTabLock: false
    }
  },
  mounted() {
    this.getReceiverAddress()
  },
  methods: {
    handleAddress(row) {
      this.$emit('update:visible', false)
    },
    handleDelAddress: async function(row) {
      try {
        await deleteAddress({ id: row.id })
        this.getReceiverAddress()
      } catch (error) {}
    },
    handleAddressDefault: async function(row) {
      try {
        await updateUsage({ id: row.id })
        this.getReceiverAddress()
      } catch (e) {
      } finally {
      }
    },
    getReceiverAddress: async function() {
      try {
        this.checkAddressTabLock = true
        const res = await queryById({ agentId: JSON.parse(getLocal('userBaseInfo')).agentId })
        this.addressData = res.map(item => item.check = false)
      } catch (error) {
      } finally {
        this.checkAddressTabLock = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.p-address {
  &-con {
    /deep/ {
      .el-dialog__body {
        padding: 16px 20px;
      }
      .el-dialog__footer .el-button {
        padding: 8px 22px;
      }
    }
  }
  &-tips {
    border-radius: 2px;
    min-height: 40px;
    max-height: 40px;
    background: rgba(51, 119, 255, 0.08);
    border: 1px solid rgba(51, 119, 255, 0.4);
    display: flex;
    align-items: center;
    padding: 7px 16px;
    margin: 0 8px 16px 8px;
  }
  &-tab {
    /deep/ {
      .el-radio__label {
        display: none;
      }
      .el-radio__inner {
        width: 16px;
        height: 16px;
      }
      .el-radio__inner::after {
        width: 8px;
        height: 8px;
      }
    }
  }
}
</style>
