<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" :destroy-on-close="true" title="选择收货地址" class="p-address-con">
    <div class="p-address-tips">注意：订单保存后会自动保存地址，最多支持10个地址信息</div>
    <el-table :data="addressData" class="p-address-tab" v-loading="checkAddressTabLock">
      <el-table-column label="选择" header-align="center" align="center" width="80">
        <template slot-scope="scope">
          <el-radio v-model="checkAddressVal" :label="scope.$index"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="receivePeople" label="收货人" width="120"></el-table-column>
      <el-table-column prop="receivePeoplePhone" label="收货人电话" width="150"></el-table-column>
      <el-table-column label="详细地址">
        <template slot-scope="scope">{{ scope.row.prefixAddress + scope.row.address }}</template>
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

export default {
  props: {
    agentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      checkAddressVal: '',
      addressData: [],
      checkAddressTabLock: false
    }
  },
  methods: {
    handleAddress() {
      this.setInitAddress()
      this.$emit('update:visible', false)
    },
    async handleDelAddress(row) {
      try {
        await deleteAddress({ id: row.id })
        this.getReceiverAddress()
      } catch (error) {}
    },
    async handleAddressDefault(row) {
      try {
        await updateUsage({ id: row.id })
        this.getReceiverAddress()
      } catch (error) {}
    },
    setInitAddress() {
      this.$emit('addressData', this.addressData[this.checkAddressVal])
    },
    async getReceiverAddress() {
      try {
        this.checkAddressTabLock = true
        const res = await queryById({ agentId: this.agentId })
        this.addressData = res || []
        if (this.addressData.length > 0) {
          const adressValIndex = this.addressData.findIndex(item => item.usageStatus)
          this.checkAddressVal = adressValIndex !== -1 ? adressValIndex : 0
        }
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
