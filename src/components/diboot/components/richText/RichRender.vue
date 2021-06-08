<template>
  <div v-html="content"></div>
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
