<template>
  <div class="header">
    <div class="logo">博客天地</div>
    <div class="nav">
      <router-link to="/" class="nav-text">首页</router-link>
    </div>
    <div class="actions">
      <!--登录状态时显示-->
      <template v-if="user.id">
        <el-dropdown>
          <el-avatar
            :size="40"
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          />
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user"><el-dropdown-item>个人中心</el-dropdown-item></router-link>
              <router-link to="/user/password">
                <el-dropdown-item>修改密码</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <!--未登录状态时显示-->
      <template v-else>
        <router-link to="/login">
          <el-button>登录</el-button>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()
const user = computed(() => store.user) //实时获取用户数据

const logout = () => {
  store.logout()
  ElMessage.success('已退出登录')
  router.push('/login').catch(err => {
    // 避免重复跳转报错
    if (err.name !== 'NavigationDuplicated') console.error(err)
  })
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
}
.header {
  display: flex;
  align-items: center; /*元素垂直居中*/
  height: 60px;
  background-color: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1); /*盒子阴影 */
  position: sticky; /*实现元素固定在某个位置的效果 */
  top: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
}
.logo {
  font-size: 1.5rem; /**文字放大1.5倍 */
  font-weight: bold;
  padding: 0px 50px;
}
.nav {
  padding: 0px 50px;
}
.nav-text {
  color: #333;
  text-decoration: none; /**去下划线 */
}
.nav-text:hover {
  /**鼠标悬停样式 */
  color: #667eea;
  text-decoration: underline; /**下划线 */
}
.actions {
  margin-left: auto; /**将元素推到最右边*/
  margin-right: 50px;
}
</style>
