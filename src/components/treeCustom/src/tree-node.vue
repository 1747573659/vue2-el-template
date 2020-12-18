<template>
  <div
    class="el-tree-node"
    @click.stop="handleClick"
    @contextmenu="$event => this.handleContextMenu($event)"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': tree.store.currentNode === node,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    ref="node"
  >
    <!-- :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }" -->
    <div :class="['tree-custom-header' + node.level, 'tree-custom-header']">
      <!-- <div v-if="">
      </div> -->
      <!-- :style="{ 'left': (node.level - 2) * tree.indent*6 + 'px'}"
        style="position: absolute; top:50px; padding-left: 15px; width: 110px; box-sizing:border-box;" -->
      <div class="el-tree-node__content">
        <el-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate" :disabled="!!node.data.disabled" @click.native.stop @change="handleCheckChange">
        </el-checkbox>
        <span v-if="node.loading" class="el-tree-node__loading-icon el-icon-loading"> </span>
        <node-content :node="node"></node-content>
      </div>
    </div>
    <div :class="['tree-custom-header-clone']" v-if="node.level === 4">
      <div class="el-tree-node__content">
        <el-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate" :disabled="!!node.disabled" @click.native.stop @change="handleCheckChange">
        </el-checkbox>
        <span v-if="node.loading" class="el-tree-node__loading-icon el-icon-loading"> </span>
      </div>
    </div>
    <el-collapse-transition>
      <div
        class="el-tree-node__children custom-el-tree-node__children"
        :class="['tree-custom-children' + node.level]"
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        role="group"
        :aria-expanded="expanded"
      >
        <!-- style="position: absolute; top:0px;"
        :style="{ 'left': (node.level - 2) * tree.indent*6 + 'px'}" -->
        <el-tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :render-after-expand="renderAfterExpand"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand"
        >
          <!-- :style="{'top': index * 28 + 'px'}" style="position: absolute;" -->
        </el-tree-node>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script type="text/jsx">
import ElCollapseTransition from 'element-ui/src/transitions/collapse-transition'
import ElCheckbox from 'element-ui/packages/checkbox'
import emitter from 'element-ui/src/mixins/emitter'
import { getNodeKey } from './model/util'

export default {
  name: 'ElTreeNode',

  componentName: 'ElTreeNode',

  mixins: [emitter],

  props: {
    powerChecked: {
      type: Boolean,
      default: false
    },
    node: {
      default () {
        return {}
      }
    },
    props: {},
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true
    }
  },

  components: {
    ElCollapseTransition,
    ElCheckbox,
    NodeContent: {
      props: {
        node: {
          required: true
        }
      },
      render (h) {
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node
        return (
          parent.renderContent
            ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
            : tree.$scopedSlots.default
              ? tree.$scopedSlots.default({ node, data })
              : <span class="el-tree-node__label" title={node.label}>{node.label}</span>
        )
      }
    }

  },
  computed: {
    ndsabled: {
      get: function () {
        return !!this.node.disabled
      },
      // setter
      set: function (newValue) {

      }
    }
  },

  data () {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      showCheckbox: false,
      oldChecked: null,
      oldIndeterminate: null
    }
  },

  watch: {
    'node.indeterminate' (val) {
      this.handleSelectChange(this.node.checked, val)
    },

    'node.checked' (val) {
      this.handleSelectChange(val, this.node.indeterminate)
    },
    'node.expanded' (val) {
      this.$nextTick(() => {
        this.expanded = val
      })
      if (val) {
        this.childNodeRendered = true
      }
    }
  },

  methods: {
    getNodeKey (node) {
      this.$emit('update:powerChecked', false)
      return getNodeKey(this.tree.nodeKey, node.data)
    },

    handleSelectChange (checked, indeterminate) {
      if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate)
      }
      this.oldChecked = checked
      this.indeterminate = indeterminate
    },

    handleClick () {
      const store = this.tree.store
      store.setCurrentNode(this.node)
      this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode)
      this.tree.currentNode = this
      if (this.tree.expandOnClickNode && this.node.level !== 1) {
        this.handleExpandIconClick()
      }
      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange(null, {
          target: { checked: !this.node.checked }
        })
      }
      this.tree.$emit('node-click', this.node.data, this.node, this)
      // console.log(this.$el.children[1], 'ffffffffffffffffffff')
      // 把第四级的checkbox的clone移到上面去做最后一级的全选按钮
      if (this.node.level === 4) {
        document.querySelectorAll('.tree-custom-header-clone').forEach(item => {
          item.style.position = ''
          item.style.display = 'none'
        })
        this.$el.children[1].style.position = 'absolute'
        this.$el.children[1].style.display = 'block'
      }
      // console.log(curremtEl)
    },

    handleContextMenu (event) {
      if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
        event.stopPropagation()
        event.preventDefault()
      }
      this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this)
    },

    handleExpandIconClick () {
      // 2019-1-4
      if (this.node.isLeaf) {
        let parent = this.node.parent
        if (!parent) return
        for (let i = 0; i < parent.childNodes.length; i++) {
          this.tree.$emit('node-collapse', parent.childNodes[i].data, parent.childNodes[i], this)
          parent.childNodes[i].collapse()
        }
        return false
      }
      if (!this.expanded) {
        this.node.expand()
        this.$emit('node-expand', this.node.data, this.node, this)
      }
      // if (this.node.isLeaf) return
      // if (this.expanded) {
      //   this.tree.$emit('node-collapse', this.node.data, this.node, this)
      //   this.node.collapse()
      // } else {
      //   this.node.expand()
      //   this.$emit('node-expand', this.node.data, this.node, this)
      // }
    },

    handleCheckChange (value, ev) {
      if (this.node.level === 5) {
        this.node.setChecked(ev.target.checked, !this.tree.checkStrictly, undefined, undefined, 1)
      } else {
        this.node.setChecked(ev.target.checked, !this.tree.checkStrictly)
      }
      this.$nextTick(() => {
        const store = this.tree.store
        this.tree.$emit('check', this.node.data, {
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys()
        })
      })
    },

    handleChildNodeExpand (nodeData, node, instance) {
      this.broadcast('ElTreeNode', 'tree-node-expand', node)
      this.tree.$emit('node-expand', nodeData, node, instance)
    },

    handleDragStart (event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-start', event, this)
    },

    handleDragOver (event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-over', event, this)
      event.preventDefault()
    },

    handleDrop (event) {
      event.preventDefault()
    },

    handleDragEnd (event) {
      if (!this.tree.draggable) return
      this.tree.$emit('tree-node-drag-end', event, this)
    }
  },

  created () {
    const parent = this.$parent
    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }

    const tree = this.tree
    if (!tree) {
      // console.warn('Can not find node\'s tree.')
    }

    const props = tree.props || {}
    const childrenKey = props['children'] || 'children'

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren()
    })

    this.showCheckbox = tree.showCheckbox

    if (this.node.expanded) {
      this.expanded = true
      this.childNodeRendered = true
    }

    if (this.tree.accordion) {
      this.$on('tree-node-expand', node => {
        if (this.node !== node) {
          this.node.collapse()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-custom-header1 {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #d5d5d5;
  .el-tree-node__content {
    // padding-left: 15px;
    padding-left: 10px;
    box-sizing: border-box;
    line-height: 49px;
    height: 49px;
    &:hover {
      background-color: #fff;
    }
  }
}
.tree-custom-header2,
.tree-custom-header3,
.tree-custom-header4 {
  width: 110px;
  .el-tree-node__content {
    // padding-left: 15px;
    padding-left: 10px;
    box-sizing: border-box;
    height: 36px;
    line-height: 36px;
    &:hover {
      width: 128px;
    }
  }
}
.tree-custom-header5 {
  .el-tree-node__content {
    // padding-left: 15px;
    padding-left: 10px;
    box-sizing: border-box;
    height: 36px;
    line-height: 36px;
    &:hover {
      width: 118px;
    }
  }
}
.tree-custom-children1,
.tree-custom-children2 {
  // height: 299px;
  min-height: 398px;
  height: 398px;
  width: 130px;
  border-right: 1px solid #d5d5d5;
}
.tree-custom-children2,
.tree-custom-children3 {
  position: absolute;
  top: 0;
  left: 130px;
}
.tree-custom-children4 {
  position: absolute;
  top: 0;
  left: 148px;
  width: 130px;
  max-height: 400px;
  z-index: 2;
}
.tree-custom-children3 {
  left: 130px;
  width: 110px;
}
.tree-custom-header1 + .el-tree-node__children {
  position: relative;
  // height: 299px;
  min-height: 268px;
}
.custom-el-tree-node__children .is-expanded {
  width: 128px;
  background-color: #f5f7fa;
}
.el-tree-node:focus > .tree-custom-header > .el-tree-node__content {
  width: 128px;
  background-color: #f5f7fa;
}
.el-tree-node:focus > .tree-custom-header1 > .el-tree-node__content {
  background-color: inherit;
}
.el-tree-node:focus > .tree-custom-header5 > .el-tree-node__content {
  width: 118px;
  background-color: #f5f7fa;
}
.tree-custom-header-clone {
  // position: absolute;
  right: -72px;
  top: -38px;
  z-index: 2;
  display: none;
  .el-tree-node__content {
    &:hover {
      background-color: inherit;
    }
  }
}
.el-tree-node__label {
  overflow: hidden; // 超出部分隐藏
  white-space: nowrap; // 不换行
  text-overflow: ellipsis; // 超出部分文字以...显示
}
</style>
