<template>
  <div class="login-area">
    <div class="login-header">
      <h2 class="login-title">用户登录</h2>
      <p class="login-subtitle">欢迎回来，请登录您的账号</p>
    </div>
    <div class="login-form">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item label="用户名" prop="username" label-position="top">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password" label-position="top">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" class="login-btn">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
//导入模块
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'
import { ElMessage } from 'element-plus'
import http from '@/utils/request'

//定义变量
const router = useRouter() //路由
const store = useStore() //状态
//定义表单组件实例
const ruleFormRef = ref(null)
//定义表单绑定的数据
const ruleForm = reactive({
  username: '',
  password: '',
})
//定义表单验证规则
const rules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}
// 获取重定向路径
const redirectPath = computed(() => route.query.redirect || '/')
//处理登录
const submitForm = async () => {
  //验证表单
  const valid = await ruleFormRef.value.validate()
  //向后台发出请求
  const res = await http.post('/admin/login', ruleForm)
  //如果请求成功
  if (res.code === 200) {
    //弹出提示
    ElMessage({
      type: 'success',
      message: '登录成功',
    })
    //保存当前登录用户信息
    store.login(res.data)
    // 跳转到之前访问的页面
    router.replace(redirectPath.value)

    //跳转到首页
    router.push('/')
  } else {
    //如果请求失败
    //弹出提示
    ElMessage({
      type: 'error',
      message: res.message,
    })
  }
}
</script>
<style scoped>
.login-area {
  max-width: 380px;
  width: 100%;
  padding: 40px;
  margin: 50px auto; /**使div水平居中 */
  border-radius: 16px;
  box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.1);
  background: #fff;
}
.login-header {
  text-align: center;
}
.login-title {
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}
.login-subtitle {
  color: #666;
}
.login-form {
  width: 100%;
}
.login-form el-form-item {
  margin-bottom: 10px;
}
.login-btn {
  width: 100%;
  border-radius: 8px;
}
</style>
