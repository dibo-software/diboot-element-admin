<template>
  <div>
    <tinymce :value="value" :rel-obj-type="relObjType" :rel-obj-id="relObjId" @input="val => $emit('change', val)" />
  </div>
</template>
<script>
import tinymce from '@/components/Editor/Tinymce/index'

export default {
  name: 'RichEditor',
  components: {
    tinymce
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    relObjType: {
      type: String,
      required: true
    },
    relObjId: {
      type: [Number, String],
      required: false,
      default: ''
    }
  }
}
</script>
