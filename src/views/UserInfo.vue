<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2 class="profile-title">个人信息</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" label-position="left">
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="签名" prop="sign">
          <el-input type="textarea" :rows="4" v-model="form.sign" placeholder="请输入个性签名" />
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

// 表单数据（与后端 Admin 实体字段保持一致）
const form = reactive({
  id: null,
  username: '',
  nickname: '', // 对应后端的 nickname
  sign: '', // 对应后端的 sign
})

const formRef = ref(null)
const saveLoading = ref(false)

// 表单验证规则（昵称和签名不能为空）
const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  sign: [{ required: true, message: '请输入签名', trigger: 'blur' }],
}

// 获取当前登录用户的ID（实际从登录状态获取）
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
  return 1 // 默认管理员id
}

// 加载个人信息
const loadProfile = async () => {
  try {
    const id = getUserId()
    const res = await http.get(`/admin/${id}`)
    if (res.code === 200) {
      const data = res.data
      form.id = data.id
      form.username = data.username
      form.nickname = data.nickname || ''
      form.sign = data.sign || ''
    } else {
      ElMessage.error(res.message || '加载个人信息失败')
    }
  } catch (error) {
    console.error('加载个人信息失败', error)
    ElMessage.error('网络错误，请稍后重试')
  }
}

// 保存修改
const handleSave = async () => {
  await formRef.value.validate()
  saveLoading.value = true
  try {
    const payload = {
      id: form.id,
      username: form.username,
      nickname: form.nickname,
      sign: form.sign,
    }
    const res = await http.put('/admin', payload)
    if (res.code === 200) {
      ElMessage.success('保存成功')
      await loadProfile() // 重新加载最新数据
    } else {
      ElMessage.error(res.message || '保存失败')
    }
  } catch (error) {
    console.error('保存失败', error)
    ElMessage.error('保存失败，请检查网络')
  } finally {
    saveLoading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-container {
  background-color: #f5f7fa;
  height: 611px; /* 固定高度 611px */
  display: flex;
  flex-direction: column;
  /* 移除 padding，使内容紧贴左上角 */
  box-sizing: border-box;
}

.profile-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px; /* 卡片内部保留内边距，保证内容呼吸空间 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  flex: 1; /* 撑满剩余高度 */
  display: flex;
  flex-direction: column;
  overflow: auto; /* 内容过多时滚动 */
}

.profile-title {
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

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa;
}
</style>
