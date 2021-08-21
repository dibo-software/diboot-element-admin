<template>
  <el-form-item
    ref="formItem"
    :prop="prop"
    :label="label"
    :label-width="labelWidth"
    :error="error"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :rules="(edit || !id ) && !(disabled || readonly) ? rules : {}"
    :required="(edit || !id) && !(disabled || readonly) && required"
  >
    <slot slot="label" name="label" />
    <el-input
      ref="input"
      v-model="editValue"
      :placeholder="placeholder"
      :type="type"
      :size="size"
      :rows="rows"
      :resize="resize"
      :autosize="autosize"
      :clearable="clearable"
      :autofocus="autofocus"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :maxlength="maxlength"
      :minlength="minlength"
      :show-word-limit="showWordLimit"
      :validate-event="validateEvent"
      :readonly="!edit && !!id || readonly"
      :disabled="!edit && !!id && !readonly || disabled"
      @blur="event => $emit('blur', event)"
      @focus="event => $emit('focus', event)"
      @clear="$emit('clear')"
      @change="inputChange"
    >
      <slot slot="prefix" name="prefix" />
      <slot slot="suffix" name="suffix" />
      <slot slot="prepend" name="prepend" />
      <el-button v-if="!disabled && !readonly && id" slot="append" @click="edit = !edit">{{ edit ? '取消' : '编辑' }}</el-button>
      <slot v-else slot="append" name="append" />
    </el-input>
    <template v-if="$slots.error" slot="error" slot-scope="{ error }">
      <slot name="error" :error="error" />
    </template>
  </el-form-item>
</template>

<script>
const stringNull = { type: String, default: undefined }

export default {
  name: 'ProtectField',
  props: {
    id: { type: [String, Number], required: true, default: 0 },

    prop: stringNull,
    label: stringNull,
    labelWidth: stringNull,
    required: Boolean,
    rules: { type: [Object, Array], default: null },
    error: stringNull,
    showMessage: { type: Boolean, default: true },
    inlineMessage: { type: [String, Boolean], default: undefined },

    value: stringNull,
    placeholder: stringNull,
    type: stringNull,
    size: stringNull,
    rows: { type: Number, default: 2 },
    resize: stringNull,
    autosize: { type: [Boolean, Object], default: false },
    validateEvent: { type: Boolean, default: true },
    maxlength: { type: Number, default: undefined },
    minlength: { type: Number, default: undefined },
    showWordLimit: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    autofocus: Boolean,
    prefixIcon: stringNull,
    suffixIcon: stringNull
  },
  data() {
    return {
      edit: false,
      protectValue: null,
      editValue: null
    }
  },
  watch: {
    id() {
      this.edit = false
      this.reset()
    },
    edit(v) {
      this.editValue = v ? null : this.protectValue
      this.inputChange()
    }
  },
  created() {
    this.reset()
  },
  methods: {
    resetField() {
      (this.edit || !this.id) && this.inputChange(this.editValue = null)
      this.clearValidate()
    },
    clearValidate() {
      this.$refs.formItem.clearValidate()
    },

    inputChange(value) {
      this.protectValue !== value && this.$emit('input', value)
    },
    reset() {
      this.editValue = this.protectValue = this.value
      this.inputChange()
    },
    select() {
      this.$refs.input.select()
    },
    focus() {
      this.$refs.input.focus()
    },
    blur() {
      this.$refs.input.blur()
    }
  }
}
</script>
