<script>
export default {
  props: {
    ctx: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      default: 'default'
    },
    slotType: {
      type: String,
      default: 'table'
    }
  },
  render(createElement) {
    const genSlot = this.ctx.$scopedSlots[`${this.slotType}_${this.name}`]
    if (genSlot) {
      return createElement('div', genSlot(this.$attrs))
    } else {
      return null
    }
  }
}
</script>
