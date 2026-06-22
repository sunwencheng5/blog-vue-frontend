<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-main>
          <!--轮播图-->
          <el-carousel height="280px" motion-blur class="carousel-container">
            <el-carousel-item v-for="item in carouselItems" :key="item" class="carousel-item">
              <img :src="item.image" :alt="item.title" class="carousel-image" />
              <div class="carousel-caption">
                <h3>{{ item.title }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </el-carousel-item>
          </el-carousel>
          <!--最新博客-->
          <div class="latest-blog">
            <div v-for="blog in latestBlogs" :key="blog.id" class="blog-item">
              <div class="blog-img"><img :src="blog.photo" :alt="blog.title" /></div>
              <div class="blog-content">
                <router-link
                  :to="{ path: '/blogdetail', query: { id: blog.id } }"
                  class="blog-title"
                  >{{ blog.title }}</router-link
                >
                <p class="blog-meta">{{ blog.create_time }}.{{ blog.category.category_name }}</p>
                <p class="blog-summary">{{ blog.summary }}</p>
                <router-link :to="{ path: '/blogdetail', query: { id: blog.id } }" class="blog-more"
                  >查看更多>></router-link
                >
              </div>
            </div>
          </div>
          <!--分页-->
          <div>
            <el-pagination
              v-model:current-page="query.pageNum"
              v-model:page-size="query.pageSize"
              :page-sizes="[5, 10, 20, 30]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-main>
        <el-aside width="500px" class="aside">
          <!--作者介绍-->
          <div class="author-area">
            <div class="author-avatar">
              <img :src="avatar" alt="作者头像" />
            </div>
            <h3 class="author-name">{{ author.nickname }}</h3>
            <p class="author-sign">{{ author.sign }}</p>
          </div>
          <!--热门博客-->
          <div class="hot-blogs">
            <h3 class="hot-title">热门文章</h3>
            <ul class="hot-blogs-list">
              <li v-for="(blog, index) in hotBlogs" :key="blog.id" class="hot-item">
                <span class="blog-index">{{ index + 1 }}</span>
                <router-link
                  :to="{ path: '/blogdetail', query: { id: blog.id } }"
                  class="title-link"
                  >{{ blog.title }}</router-link
                >
                <span class="click_num">{{ blog.click_num }}次浏览</span>
              </li>
            </ul>
          </div>
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
//导入模块
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import http from '@/utils/request'
//导入作者头像
import avatar from '@/assets/images/avatar.gif'
//导入轮播图图片
import banner1 from '@/assets/images/banner1.jpg'
import banner2 from '@/assets/images/banner2.jpg'
import banner3 from '@/assets/images/banner3.jpg'
import { getPrevMonthLastDays } from 'element-plus/es/components/calendar/src/date-table.mjs'
//定义轮播图数据
const carouselItems = ref([
  { id: 1, image: banner1, title: '求索之路', description: '路漫漫其修远兮，吾将上下而求索' },
  {
    id: 2,
    image: banner2,
    title: '热爱之证',
    description: '世界上只有一种真正的英雄注意，那就是在认清生活真相之后依然热爱生活',
  },
  {
    id: 3,
    image: banner3,
    title: '视角之间',
    description: '我们听到的一切都是一个观点，不是事实。我们看见的一切都是一个视角，不是真相',
  },
])

const latestBlogs = ref([]) //定义变量存放博客数据
const total = ref(0) //定义变量存放总条数
const query = {
  //定义变量存放查询参数
  pageNum: 1,
  pageSize: 5,
}
//定义函数获取博客数据，async和await是一对组合，确保请求结束再执行后面的代码
const getLatestBlogs = async () => {
  //请求后台获取博客数据
  const res = await http.get('/blog', { params: query })
  //判断请求是否成功
  if (res.code === 200) {
    latestBlogs.value = res.data.records //博客的分页数据
    total.value = res.data.total //总条数
  } else {
    ElMessage.error(res.message) //错误提示
  }
}
//定义变量
const author = ref([]) //作者
const hotBlogs = ref([]) //热门博客
//定义函数获取作者信息
const getAuthor = async () => {
  const res = await http.get('/admin/1')
  if (res.code === 200) {
    author.value = res.data
  }
}
//定义函数获取热门博客
const loadHotBlogs = async () => {
  const res = await http.get('/blog/hot/5')
  if (res.code === 200) {
    hotBlogs.value = res.data
  }
}
//定义生命周期函数，在页面加载时执行
onMounted(() => {
  getAuthor() //获取作者信息
  getLatestBlogs() //获取最新博客
  loadHotBlogs() //获取最热博客
})
//定义分页函数
const handleSizeChange = async (size) => {
  query.pageSize = size
  getLatestBlogs()
}
const handleCurrentChange = async (page) => {
  query.pageNum = page
  getLatestBlogs()
}
</script>
<style scoped>
/**设置轮播图区域的样式 */
.carousel-container {
  margin-top: 10px; /**上边距10px */
  border-radius: 10px; /**圆角边框半径10px */
  overflow: hidden; /**溢出隐藏 */
  /**盒子阴影，向下偏移4px，*/
  /**模糊半径15px，模糊半径越大阴影边缘越柔和，阴影颜色为透明度0.1的黑色 */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}
/**设置每一个轮播图的样式 */
.carousel-item {
  width: 100%; /**宽度占满父亲的宽度 */
  height: 280px; /**高度280px */
}
/**设置图片样式，铺满*/
.carousel-image {
  width: 100%;
  height: 100%;
}
/**设置标题 */
.carousel-caption {
  position: absolute; /**子设置为绝对定位 */
  bottom: 0; /**位置设置在父亲的左下角 */
  left: 0;
  padding: 30px;
  background: linear-gradient(
    transparent,
    rgba(0, 0, 0, 0.1)
  ); /**背景设置为黑色透明的渐变色，为了白色文字能看清楚 */
  color: white; /**文字白色 */
}
/**设置最新博客整体区域 */
.latest-blog {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}
/**设置每一个博客样式 */
.blog-item {
  display: flex;
  margin: 20px;
  border-bottom: 1px solid #eee; /**底边边框 */
  padding-bottom: 20px;
  gap: 30px;
}
/**最后一个博客下面没有边框 */
.blog-item:last-child {
  border-bottom: none;
}
/**设置博客封面 */
.blog-img {
  width: 200px;
  height: 140px;
  overflow: hidden;
  border-radius: 10px;
}
/**设置图片动画效果：放大 */
.blog-img img {
  width: 100%;
  height: 100%;
  transition: transform 0.3s; /**变换在0.3秒內过度 */
}
.blog-img:hover img {
  /**鼠标悬停时样式 */
  transform: scale(1.05); /**图片放大1.05倍 */
}
/**设置博客标题样式 */
.blog-title {
  margin: 10px;
  font-size: 1.5rem; /**放大1.5倍 */
  color: #333;
  transition: color 0.3s; /**颜色在0.3秒內过度 */
}
.blog-title:hover {
  color: #667eea;
}
/**设置博客创建时间分类这一行的样式 */
.blog-meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
}
/**设置博客摘要 */
.blog-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}
/**设置查看更多的样式 */
.blog-more {
  color: #667eea;
  text-decoration: none; /**去掉下划线 */
  font-weight: 500;
  transition: color 0.3s;
}
.blog-more:hover {
  color: #764ba2;
}
/**设置作者区域样式 */
.aside {
  margin: 15px;
}
.author-area {
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  text-align: center; /**文字水平居中 */
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}
/**设置作者头像 */
.author-avatar img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0px 20px;
  border: 4px solid #f0f0f0;
}
/**设置作者名 */
.author-name {
  margin: 0px 5px;
  font-size: 1.5rem;
  color: #333;
}
/**设置作者签名 */
.author-sign {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}
/**设置热门博客样式 */
.hot-blogs {
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}
.hot-blogs-list {
  list-style: none; /**去掉列表本来的样式 */
  padding: 0px;
  margin: 0px;
}
/**设置每一个列表项样式 */
.hot-item {
  display: flex;
  align-items: center; /**垂直居中 */
  margin: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: transform 0.3s;
}
.hot-item:last-child {
  border-bottom: none;
}
.blog-index {
  width: 30px;
  height: 30px;
  background: #667eea;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 30px;
  font-size: 0.8rem;
}
.title-link {
  text-decoration: none;
  color: #000;
  transition: color 0.3s;
}
.title-link:hover {
  color: #667eea;
}
.click_num {
  font-size: 0.8rem;
  color: #999;
}
</style>
