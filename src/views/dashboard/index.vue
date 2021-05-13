<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎您: {{ name }}</div>
    <h3>帮助向导</h3>
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
          title: '新手指南',
          titleUrl: 'https://www.diboot.com/guide/newer/beginner.html',
          description: 'diboot新用户，先通读官网文档'
        },
        {
          title: '配置角色&资源权限',
          titleUrl: 'https://www.diboot.com/guide/diboot-antd-admin/%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6.html#%E8%8F%9C%E5%8D%95%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86',
          description: '参考链接官网文档，配置资源权限'
        },
        {
          title: '后端打包时剔除devtools',
          titleUrl: 'https://www.diboot.com/guide/diboot-devtools/开始使用.html',
          description: 'diboot-devtools 是用于开发过程的助手工具，打包发布前须剔除devtools jar，具体请参考链接官网文档。'
        },
        {
          title: '常用问题FAQ',
          titleUrl: 'https://www.diboot.com/guide/notes/faq/main.html',
          description:
            '使用中有疑问可参考FAQ 或 通过github/gitee查找技术交流群沟通'
        },
        {
          title: 'diboot企业版支持',
          titleUrl: 'https://www.diboot.com/ent/service.html',
          description:
            'devtools高级功能、diboot-cloud微服务版本、diboot-workflow工作流、diboot-mobile移动端等可查看授权服务相关内容'
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
