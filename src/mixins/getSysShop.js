import { queryShopPage } from '@/api/baseApi'

export const getSysShop = {
  data() {
    return {
      shopVO: [],
      isShopVOMaxPage: false
    }
  },
  methods: {
    async getShopPage({ query = '', page = 1, rows = 10, ...params } = {}) {
      try {
        const res = await queryShopPage({ merchantAdminId: query, page, rows, ...params })
        this.shopVO = this.shopVO.concat(res.results || [])
        this.isShopVOMaxPage = !res.results || (res.results && res.results.length < 10)
      } catch (error) {}
    }
  }
}
