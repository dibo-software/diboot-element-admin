<template>
  <div class="quill-html-render">
    <!--外边的两层div是必须要加的，使用v-html指令后就可以正常显示-->
    <div class="ql-container ql-snow">
      <div class="ql-editor">
        <span v-if="content" v-html="content" />
      </div>
    </div>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'QuillHtmlRender',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
  .ql-container.ql-snow {
    border: unset;
  }
</style>
