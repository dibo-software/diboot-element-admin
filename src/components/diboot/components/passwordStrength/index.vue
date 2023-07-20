<template>
  <div v-if="password" class="strengthLevel">
    <span class="label">{{ strengthLevel }}</span>
    <div class="graph" :class="{'red':strengthLevel === '弱','orange':strengthLevel === '中','green':strengthLevel === '强'}" />
  </div>
</template>

<script>
import { level } from '@/utils/passwordStrength'
import { mapState } from 'vuex'
export default {
  name: 'Index',
  props: {
    password: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      strengthLevel: ''
    }
  },
  watch: {
    password: {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.strengthLevel = level(newVal)
        } else {
          this.strengthLevel = ''
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      allowWeakPassword: state => state.user.allowWeakPassword
    })
  },
  methods: {
    // 校验密码强度
    checkPasswordStrength() {
      if (!this.allowWeakPassword && this.strengthLevel === '弱') {
        this.$message.error('不允许使用弱密码，请重新修改')
      } else {
        this.$emit('confirm')
      }
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>
.strengthLevel {
  display: flex;
  align-items: center;
}
.graph {
  width: 0;
  height: 6px;
  margin-left: 10px;
  border-radius: 3px;
}

.label {
  font-weight: bold;
}

.red {
  width: 60px;
  background: red;
}

.orange {
  width: 120px;
  background: orange;
}

.green {
  width: 180px;
  background: green;
}

</style>
