<template>
  <div class="container">
    <!--导航-->
    <AdminNav></AdminNav>
    <!--菜单对应的页面-->
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import AdminNav from '@/components/AdminNav.vue' /**导入导航组件 */
</script>

<style scoped>
.container {
  display: flex;
  gap: 15px;
  padding: 30px;
}
.main {
  flex: 1; /**占满父容器的剩余空间 */
  background-color: #fff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
}
</style>
