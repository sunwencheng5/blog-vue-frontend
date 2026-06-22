<template>
  <div class="container">
    <!--博客详情区域-->
    <div class="main">
      <!--标题区-->
      <div class="blog-header">
        <h3 class="blog-title">{{ blog.title }}</h3>
        <div class="blog-meta">
          <span class="author-info">
            <img :src="avatar" alt="作者头像" />
            <span>{{ author.nickname }}</span>
          </span>
          <span>{{ blog.create_time }}</span>
          <span>{{ blog?.category?.category_name }}</span>
          <span>阅读{{ blog.click_num }}</span>
        </div>
      </div>
      <!--封面-->
      <div class="blog-cover">
        <img :src="blog.photo" :alt="blog.title" />
      </div>
      <!--内容-->
      <div class="blog-content">
        <article v-html="blog.content"></article>
      </div>
    </div>
  </div>
</template>
<script setup>
//导入模块
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import http from '@/utils/request'
//导入作者头像
import avatar from '@/assets/images/avatar.gif'

//定义变量
const route = useRoute() //创建包含路由信息的对象，可从中获取参数等。
const author = ref({})
const blog = ref({})
//定义函数获取作者信息
const getAuthor = async () => {
  const res = await http.get('/admin/1')
  if (res.code === 200) {
    author.value = res.data
  } else {
    ElMessage.error('作者信息获取失败')
  }
}
//定义函数获取博客详情
const getBlogDetail = async () => {
  const res = await http.get(`/blog/${route.query.id}`)
  if (res.code === 200) {
    blog.value = res.data
  } else {
    ElMessage.error('博客信息获取失败')
  }
}
//页面加载时获取作者信息和博客信息
onMounted(() => {
  getAuthor()
  getBlogDetail()
})
</script>
<style scoped>
/**设置页面整体样式 */
.container {
  background-color: #f7f7f7;
  padding: 30px;
}
.main {
  max-width: 900px;
  margin: 0px auto; /**水平居中 */
  background-color: #fff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 30px;
}
/**设置标题样式 */
.blog-header {
  border-bottom: 1px solid #f0f0f0;
}
.blog-title {
  color: #2c3e50;
}
.blog-meta {
  gap: 20px; /**元素间的间距*/
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #7f8c8d;
}
.author-info {
  display: flex;
  align-items: center;
}
.author-info img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
/**设置封面样式 */
.blog-cover {
  width: 100%;
  margin: 20px auto;
}
.blog-cover img {
  width: 100%;
  transition: transform 0.3s;
}
.blog-cover:hover img {
  transform: scale(1.05);
}
/**设置内容样式 */
.blog-content {
  padding: 40px;
  line-height: 1.6;
  color: #333;
}
</style>
