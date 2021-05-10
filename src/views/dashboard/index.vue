<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您: {{ name }}</div>
    <h3>上线注意事项列表</h3>
    <ul class="attention-list">
      <li v-for="(item, index) in attentionItems" :key="index" class="attention-list__item">
        <div class="title">
          <a :href="item.titleUrl" target="_blank" style="color: #1585ff">{{ index + 1 + '.' + item.title }}</a>
        </div>
        <div class="description" v-if="item.description">
          <p>{{item.description}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      attentionItems: [
        {
          title: '权限配置上线注意事项',
          titleUrl: 'https://www.diboot.com/guide/diboot-element-admin/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6.html#%E8%8F%9C%E5%8D%95%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86',
          description: '描述内容'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.attention-list {
  list-style-type:none;
  margim:0;
  padding:0;
  &__item {
    padding: 5px 10px;
    border-top: 1px solid #d3d3d3;
    border-right: 1px solid #d3d3d3;
    border-left: 1px solid #d3d3d3;
  }
  &__item:last-child {
    border-bottom: 1px solid #d3d3d3;
  }
}
</style>
