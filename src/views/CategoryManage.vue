<template>
  <div class="blogcontainer">
    <!--搜索区-->
    <div class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="query.categoryName" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button type="primary" @click="handleAddBlog">添加</el-button>
      </div>
    </div>
    <!--表格区-->
    <div class="table-box">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        stripe
        :row-style="{ height: '100px' }"
      >
        <el-table-column prop="id" label="id" v-if="false" />
        <el-table-column prop="category_name" label="分类名称" width="300" height="150" />
        <el-table-column prop="remark" label="分类备注" width="300" height="150" />
        <el-table-column prop="create_time" label="添加时间" width="300" height="150" />
        <el-table-column label="操作" width="180" height="150">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页区：样式已调整为左侧对齐-->
    <div class="page-box">
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
    <!--分类添加/编辑对话框-->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="70%">
      <el-form
        :model="form"
        :rules="formRules"
        ref="formRef"
        label-position="left"
        label-width="80px"
      >
        <el-row>
          <el-col>
            <el-form-item label="分类名称" label-width="80px" prop="category_name">
              <el-input
                v-model="form.category_name"
                autocomplete="off"
                placeholder="请输入分类名称"
              />
            </el-form-item>
            <el-form-item label="分类备注" prop="remark">
              <el-input
                type="textarea"
                :autoSize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入分类备注"
                v-model="form.remark"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/utils/request'

// ---------- 查询参数 ----------
const query = reactive({
  categoryName: '', // 后端 Mapper 期望的参数名
  pageNum: 1,
  pageSize: 5,
})

// ---------- 表格数据 ----------
const tableData = ref([])
const total = ref(0)

// ---------- 表单相关 ----------
const formRef = ref(null)
const form = reactive({
  id: null,
  category_name: '',
  remark: '',
})
const dialogFormVisible = ref(false)
const dialogTitle = ref('')

// ---------- 表单验证规则 ----------
const formRules = reactive({
  category_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入分类备注', trigger: 'blur' }],
})

// ---------- 获取分类分页数据（支持 categoryName 模糊查询）----------
const getCategories = async () => {
  try {
    const params = {
      pageNum: query.pageNum,
      pageSize: query.pageSize,
    }
    if (query.categoryName && query.categoryName.trim() !== '') {
      params.categoryName = query.categoryName.trim()
    }
    const res = await http.get('/category', { params })
    if (res.code === 200) {
      tableData.value = res.data.records
      total.value = res.data.total
    } else {
      ElMessage.error('获取分类数据失败')
    }
  } catch (error) {
    ElMessage.error('网络错误，请稍后重试')
  }
}

// ---------- 分页事件 ----------
const handleSizeChange = (size) => {
  query.pageSize = size
  getCategories()
}
const handleCurrentChange = (page) => {
  query.pageNum = page
  getCategories()
}

// ---------- 搜索事件 ----------
const handleSearch = () => {
  query.pageNum = 1
  getCategories()
}

// ---------- 删除 ----------
const handleDelete = async (index, row) => {
  ElMessageBox.confirm('确定删除该分类吗？', '提示', { type: 'warning' })
    .then(async () => {
      const res = await http.delete(`/category/${row.id}`)
      if (res.code === 200) {
        // 如果当前页只有一条数据且不是第一页，则跳转到上一页
        if (tableData.value.length === 1 && query.pageNum > 1) {
          query.pageNum--
        }
        getCategories()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    })
    .catch(() => {})
}

// ---------- 打开添加对话框 ----------
const handleAddBlog = () => {
  form.id = null
  form.category_name = ''
  form.remark = ''
  dialogTitle.value = '分类添加'
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// ---------- 打开编辑对话框 ----------
const handleEdit = (index, row) => {
  form.id = row.id
  form.category_name = row.category_name
  form.remark = row.remark
  dialogTitle.value = '分类编辑'
  dialogFormVisible.value = true
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// ---------- 保存（新增/编辑）----------
const handleSave = async () => {
  await formRef.value.validate()

  const category = {
    id: form.id,
    category_name: form.category_name,
    remark: form.remark,
  }

  let res = null
  if (form.id) {
    res = await http.put('/category', category)
  } else {
    res = await http.post('/category', category)
  }

  if (res.code === 200) {
    ElMessage.success('操作成功')
    dialogFormVisible.value = false
    getCategories()
  } else {
    ElMessage.error(res.message || '操作失败')
  }
}

// 初始化加载
onMounted(() => {
  getCategories()
})
</script>

<style scoped>
.blogcontainer {
  height: 811px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.search-box {
  display: flex;
  justify-content: space-between;
  padding-right: 500px;
  flex-shrink: 0;
}
.table-box {
  flex: 1;
  overflow: auto;
  margin: 30px 0;
}
.table-box .el-table {
  height: 100%;
}
/* 分页样式调整：容器左对齐，实现“分页样式在左边” */
.page-box {
  margin-top: 20px;
  display: flex;
  justify-content: flex-start; /* 原为 flex-end，改为 flex-start 使分页组件靠左 */
  flex-shrink: 0;
}
</style>
