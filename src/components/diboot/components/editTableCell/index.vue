<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <template v-if="formType === 'INPUT'">
        <el-input
          v-model="tempValue"
          :placeholder="placeholder"
          @input="changeValue"
        />
      </template>
      <template v-if="formType === 'INPUT_NUMBER'">
        <el-input-number
          v-model="tempValue"
          :placeholder="placeholder"
          controls-position="right"
          @change="changeValue"
        />
      </template>
      <template v-else-if="formType === 'TEXTAREA'">
        <el-input
          v-model="tempValue"
          :placeholder="placeholder"
          type="textarea"
          @input="changeValue"
        />
      </template>
      <template v-else-if="formType === 'S_SELECT'">
        <el-select
          v-model="tempValue"
          :placeholder="placeholder"
          filterable
          @change="changeValue"
        >
          <el-option
            v-for="(item, index) in options || []"
            :key="index"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </template>
      <template v-else-if="formType === 'SWITCH'">
        <el-switch v-model="tempValue" @change="changeValue" />
      </template>
      <template v-else-if="formType === 'DATEPICKER'">
        <el-date-picker
          v-model="tempValue"
          :placeholder="placeholder"
          value-format="yyyy-MM-dd"
          type="date"
          @change="changeValue"
        />
      </template>
      <template v-else-if="formType === 'DATETIMEPICKER'">
        <el-date-picker
          v-model="tempValue"
          :placeholder="placeholder"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          @change="changeValue"
        />
      </template>
    </div>
    <div v-else :class="{'text-ellipsis': ellipsis, 'editable-cell-text-wrapper': true}">
      <template v-if="label">
        {{ label }}
      </template>
      <template v-else>
        {{ (isBoolean ? (tempValue ? '是' : '否') : tempValue) || '-' }}
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditTableCell',
  // 文本值， 表单类型， 选择类型的数据集
  // props: ['text', 'formType', 'kvList'],
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Boolean | Number,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    // 表单类型: 支持INPUT、INPUT_NUMBER、TEXTAREA、S_SELECT、SWITCH、DATEPICKER、DATETIMEPICKER
    formType: {
      type: String,
      required: true
    },
    // 是否是布尔
    isBoolean: {
      type: Boolean,
      default: false
    },
    // 选择类型的数据集
    options: {
      type: Array,
      default: () => []
    },
    // 选择类型的数据集
    ellipsis: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempValue: this.value
    }
  },
  methods: {
    changeValue(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper {
 display: flex;
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
</style>
