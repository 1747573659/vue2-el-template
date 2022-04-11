import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters(['ossFileServe'])
  },
  methods: {
    ...mapActions(['setOSSFileServe'])
  },
  created() {
    this.setOSSFileServe()
  }
}
