<template>
  <a-form-item
    :label="label"
    :label-width="labelWidth"
    :prop="prop"
    :required="(edit || !id) && required"
    :rules="edit || !id ? rules : {}"
    :error="error"
    :validate-status="validateStatus"
    :inline-message="inlineMessage"
    :show-message="showMessage"
    :size="size"
  >
    <a-input
      v-model="editValue"
      :placeholder="placeholder"
      :disabled="!edit && !!id || disabled"
      :prefix="prefix"
      :suffix="suffix"
      :allowClear="allowClear"
      @change="inputChange"
      @pressEnter="pressEnter"
    >
      <slot slot="prefix" name="prefix" />
      <slot slot="suffix" name="suffix" />
      <slot slot="prepend" name="prepend" />
      <a-button v-if="!disabled && id" slot="append" @click="edit = !edit">{{ edit ? '取消' : '编辑' }}</a-button>
      <slot v-else slot="append" name="append" />
    </a-input>
  </a-form-item>
</template>

<script>
const stringNull = { type: String, default: undefined }
const booleanFalse = { type: Boolean, default: false }
const functionUndefined = { type: Function, default: () => {} }

export default {
  name: 'ProtectField',
  props: {
    value: stringNull,
    id: {
      type: [String, Number],
      required: true,
      default: 0
    },
    disabled: booleanFalse,
    placeholder: stringNull,
    prefix: stringNull,
    suffix: stringNull,
    allowClear: booleanFalse,
    change: functionUndefined,
    pressEnter: functionUndefined,
    label: stringNull,
    labelWidth: stringNull,
    prop: stringNull,
    required: booleanFalse,
    rules: {
      type: [Object, Array],
      default: null
    },
    error: stringNull,
    validateStatus: stringNull,
    inlineMessage: {
      type: [String, Boolean],
      default: undefined
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: stringNull
  },
  data () {
    return {
      edit: false,
      protectValue: null,
      editValue: null
    }
  },
  watch: {
    id () {
      this.edit = false
      this.reset()
    },
    edit (v) {
      this.editValue = v ? null : this.protectValue
      this.inputChange()
    }
  },
  created () {
    this.reset()
  },
  methods: {
    inputChange (value) {
      if (this.protectValue !== value) {
        this.change(value)
        this.$emit('input', value)
      }
    },
    reset () {
      this.editValue = this.protectValue = this.value
      this.inputChange()
    }
  }
}
</script>
