<template>
  <div class="password-container">
    <div class="password-card">
      <h2 class="password-title">密码修改</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px" label-position="left">
        <el-form-item label="原始密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="form.oldPassword"
            placeholder="请输入原始密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新的密码" prop="newPassword">
          <el-input
            type="password"
            v-model="form.newPassword"
            placeholder="请输入新的密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="form.confirmPassword"
            placeholder="请输入确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave" :loading="saveLoading"> 保存 </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import http from '@/utils/request'

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const formRef = ref(null)
const saveLoading = ref(false)

// 获取当前登录用户信息（从 localStorage 或 store 中获取）
const currentUser = ref(null)

// 验证确认密码是否与新密码一致
const validateConfirm = (rule, value, callback) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  oldPassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新的密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' },
  ],
}

// 获取当前用户ID（与个人信息面板保持一致）
const getUserId = () => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    try {
      const { id } = JSON.parse(userInfo)
      return id
    } catch (e) {
      return 1
    }
  }
  return 1
}

// 加载当前用户信息（用于获取原始密码进行前端验证，不推荐，但如果没有后端验证原密码接口则只能这样）
// 注意：实际生产中应由后端验证原密码。这里提供前端模拟验证，但极不安全。
// 强烈建议后端增加一个专门修改密码的接口（如 POST /admin/changePassword），并在后端验证原密码。
const loadCurrentUser = async () => {
  try {
    const id = getUserId()
    const res = await http.get(`/admin/${id}`)
    if (res.code === 200) {
      currentUser.value = res.data
    } else {
      ElMessage.error('获取用户信息失败')
    }
  } catch (error) {
    console.error(error)
  }
}

// 保存修改密码
const handleSave = async () => {
  await formRef.value.validate()

  // 前端验证原密码（不安全，仅作为示例）
  if (currentUser.value && form.oldPassword !== currentUser.value.password) {
    ElMessage.error('原始密码错误')
    return
  }

  saveLoading.value = true
  try {
    const payload = {
      id: currentUser.value.id,
      username: currentUser.value.username,
      nickname: currentUser.value.nickname,
      sign: currentUser.value.sign,
      password: form.newPassword, // 将新密码传给后端
    }
    const res = await http.put('/admin', payload)
    if (res.code === 200) {
      ElMessage.success('密码修改成功')
      // 可选：清除本地存储的登录信息，跳转到登录页
      localStorage.removeItem('userInfo')
      // 跳转登录页（根据实际路由配置）
      // router.push('/login')
    } else {
      ElMessage.error(res.message || '修改失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('修改失败，请检查网络')
  } finally {
    saveLoading.value = false
  }
}

onMounted(() => {
  loadCurrentUser()
})
</script>

<style scoped>
.password-container {
  background-color: #f5f7fa;
  height: 611px; /* 固定高度 611px */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* 移除 padding，紧贴左上角 */
}

.password-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px; /* 卡片内部保留内边距 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  flex: 1; /* 撑满剩余高度 */
  display: flex;
  flex-direction: column;
  overflow: auto; /* 内容过多时滚动 */
}

.password-title {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 12px;
  flex-shrink: 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
