import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['fileServe']),
    fileServer() {
      return this.fileServe
    }
  },
  methods: {
    ...mapActions(['setFileServe'])
  },
  created() {
    this.setFileServe()
  }
}
