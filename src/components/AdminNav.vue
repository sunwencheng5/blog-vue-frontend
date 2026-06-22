<template>
  <div class="menu">
    <h3>个人中心</h3>
    <el-menu default-active="3" class="el-menu-vertical-demo">
      <el-menu-item index="1">
        <router-link to="/user/category"><span>文章分类</span></router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/user/blog"><span>我的文章</span></router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/user/info"><span>个人信息</span></router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/user/password"><span>修改密码</span></router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<style scoped>
/**清除超链接样式 */
a {
  text-decoration: none;
  color: inherit;
}
.menu {
  width: 260px;
  padding: 30px;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
