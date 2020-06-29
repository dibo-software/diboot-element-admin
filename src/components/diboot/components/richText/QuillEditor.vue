<template>
  <div :class="prefixCls">
    <div class="quill-editor"></div>
    <div v-show="false" class="icons">
      <svg-icon class-name="column-left" icon-class="table-add-col-left"></svg-icon>
      <svg-icon class-name="column-right" icon-class="table-add-col-right"></svg-icon>
      <svg-icon class-name="row-above" icon-class="table-add-row-above"></svg-icon>
      <svg-icon class-name="row-below" icon-class="table-add-row-below"></svg-icon>
      <svg-icon class-name="delete-row" icon-class="table-del-row"></svg-icon>
      <svg-icon class-name="delete-column" icon-class="table-del-col"></svg-icon>
    </div>
  </div>

</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
  [{ font: [] }], // 字体种类
  [{ align: [] }], // 对齐方式
  [
    { 'table': 'TD' },
    { 'table-insert-row-above': 'TIRA' },
    { 'table-insert-row-below': 'TIRB' },
    { 'table-insert-column-left': 'TICL' },
    { 'table-insert-column-right': 'TICR' },
    { 'table-delete-row': 'TDR' },
    { 'table-delete-column': 'TDC' }
  ] // 表格配置
]

export default {
  name: 'QuillEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'el-editor-quill'
    },
    // 表单校验用字段
    // eslint-disable-next-line
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {
      quill: null,
      options: {
        placeholder: this.placeholder,
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              /**
               * 设置table
               * @param val
               */
              'table': function(val) {
                this.quill.getModule('table').insertTable(2, 3)
              },
              // 向上插入行
              'table-insert-row-above': function() {
                this.quill.getModule('table').insertRowAbove()
              },
              // 向下插入行
              'table-insert-row-below': function() {
                this.quill.getModule('table').insertRowBelow()
              },
              // 插入列
              'table-insert-column-left': function() {
                this.quill.getModule('table').insertColumnLeft()
              },
              'table-insert-column-right': function() {
                this.quill.getModule('table').insertColumnRight()
              },
              // 删除
              'table-delete-row': function() {
                this.quill.getModule('table').deleteRow()
              },
              'table-delete-column': function() {
                this.quill.getModule('table').deleteColumn()
              }
            }
          },
          table: true
        }

      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const dom = this.$el.querySelector('.quill-editor')
      this.quill = new Quill(dom, this.options)
      this.quill.root.innerHTML = this.value
      // this.quill.setContents(this.value)
      this.$el.querySelector('.ql-table-insert-row-above').innerHTML = this.$el.querySelector('.row-above').outerHTML
      this.$el.querySelector('.ql-table-insert-row-below').innerHTML = this.$el.querySelector('.row-below').outerHTML
      this.$el.querySelector('.ql-table-insert-column-left').innerHTML = this.$el.querySelector('.column-left').outerHTML
      this.$el.querySelector('.ql-table-insert-column-right').innerHTML = this.$el.querySelector('.column-right').outerHTML
      this.$el.querySelector('.ql-table-delete-row').innerHTML = this.$el.querySelector('.delete-row').outerHTML
      this.$el.querySelector('.ql-table-delete-column').innerHTML = this.$el.querySelector('.delete-column').outerHTML
      this.quill.on('text-change', () => {
        this.$emit('input', this.quill.root.innerHTML)
      })
    }
  }
}
</script>

<style lang="scss" >
  /* 覆盖 quill 默认边框圆角为 ant 默认圆角，用于统一 ant 组件风格 */
  .el-editor-quill {
    .ql-toolbar.ql-snow {
      border-radius: 4px 4px 0 0;
    }

    .ql-container.ql-snow {
      border-radius: 0 0 4px 4px;
    }

    .editor {
      line-height: normal !important;
      height: 800px;
    }

    .ql-snow .ql-tooltip[data-mode=link]::before {
      content: "请输入链接地址:";
    }

    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
      border-right: 0px;
      content: '保存';
      padding-right: 0px;
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: '14px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
      content: '10px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
      content: '18px';
    }

    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
      content: '32px';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: '文本';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: '标题1';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: '标题2';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: '标题3';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: '标题4';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: '标题5';
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: '标题6';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
      content: '标准字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
      content: '衬线字体';
    }

    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
      content: '等宽字体';
    }

    .ql-toolbar.ql-snow {
      line-height: 24px;
    }

    .ql-editor {
      min-height: 120px;
    }
  }
</style>
