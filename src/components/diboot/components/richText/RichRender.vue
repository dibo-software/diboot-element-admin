<template>
  <div v-html="content" />
</template>
<script>
export default {
  name: 'RichRender',
  model: {
    prop: 'content',
    event: 'change'
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>
