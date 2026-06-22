<script setup></script>

<template>
  <!-- 顶部导航 -->
  <AppHeader />
  <!-- 主要内容区域 -->
  <main class="main-content">
    <router-view />
  </main>
  <!-- 底部信息 -->
  <AppFooter />
</template>

<style scoped></style>
<script setup>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
