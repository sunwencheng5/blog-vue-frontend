<template>
  <div class="blogcontainer">
    <!--搜索区-->
    <div class="search-box">
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="query.title" placeholder="请输入文章标题" clearable />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="query.categoryId"
            placeholder="请选择文章分类"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in categoryList"
              :label="item.category_name"
              :value="item.id"
              :key="item.id"
            />
          </el-select>
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
      <el-table :data="tableData" border style="width: 100%" stripe>
        <el-table-column prop="id" label="id" v-if="false" />
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="category.category_name" label="分类" width="180" />
        <el-table-column label="封面" width="180">
          <template #default="scope">
            <el-image
              :src="scope.row.photo"
              :preview-src-list="[scope.row.photo]"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="click_num" label="点击量" width="180" />
        <el-table-column prop="create_time" label="添加时间" width="180" />
        <el-table-column label="操作" width="180">
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
    <!--分页区-->
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
    <!--文章添加/编辑对话框-->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle" width="70%">
      <el-form
        :model="form"
        :rules="formRules"
        ref="formRef"
        label-position="left"
        label-width="80px"
      >
        <el-row :gutter="15">
          <!--主题、板块和摘要-->
          <el-col :span="16">
            <el-form-item label="主题" label-width="80px" prop="title">
              <el-input v-model="form.title" autocomplete="off" placeholder="请输入博客主题" />
            </el-form-item>
            <el-form-item label="分类" label-width="80px" prop="category.id">
              <el-select v-model="form.category.id" placeholder="请选择分类">
                <el-option
                  v-for="item in categoryList"
                  :label="item.category_name"
                  :value="item.id"
                  :key="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <el-input
                type="textarea"
                :autoSize="{ minRows: 4, maxRows: 8 }"
                placeholde="请输入文章摘要"
                v-model="form.summary"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <!--封面-->
          <el-col :span="8">
            <el-form-item label="封面" prop="photo">
              <!--上传组件-->
              <el-upload
                class="photo-uploader"
                action="/api/blog/upload"
                :on-success="handleUploadSuccess"
              >
                <img v-if="form.photo" :src="form.photo" class="photo" />
                <el-icon v-else class="upload-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </el-form-item>
          </el-col>
          <!--内容-->
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <div class="quill-editor">
                <QuillEditor
                  v-model:content="form.content"
                  contentType="html"
                  :toolbar="fullToolbar"
                  theme="snow"
                ></QuillEditor>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
//导入模块
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import http from '@/utils/request'
//导入富文本编辑器
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
//定义quilleditor的工具栏
// 完整工具栏配置
const fullToolbar = [
  ['bold', 'italic', 'underline', 'strike'], // 加粗、斜体、下划线、删除线
  ['blockquote', 'code-block'], // 引用、代码块
  [{ header: 1 }, { header: 2 }], // 标题1、标题2
  [{ list: 'ordered' }, { list: 'bullet' }], // 有序列表、无序列表
  [{ script: 'sub' }, { script: 'super' }], // 下标、上标
  [{ indent: '-1' }, { indent: '+1' }], // 减少缩进、增加缩进
  [{ direction: 'rtl' }], // 从右向左文本方向
  [{ size: ['small', false, 'large', 'huge'] }], // 字体大小（下拉）
  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题1-6（下拉）
  [{ color: [] }, { background: [] }], // 字体颜色、背景颜色（下拉）
  [{ font: [] }], // 字体类型（下拉）
  [{ align: [] }], // 对齐方式（下拉）
  ['clean'], // 清除格式
  ['link', 'image', 'video'], // 链接、图片、视频
]
//定义变量
const query = reactive({
  //查询参数
  title: '',
  categoryId: '',
  pageNum: 1,
  pageSize: 5,
})
const categoryList = ref([]) //所有分类
const tableData = ref([]) //文章分页数据
const total = ref(0) //文章总条数
//定义表单相关
const formRef = ref(null) //form实例
const form = reactive({ category: { id: null } }) //form数据对象
const dialogFormVisible = ref(false) //是否显示对话框
const dialogTitle = ref('') //对话框标题

//定义表单验证规则
const formRules = reactive({
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  'category.id': [{ required: true, message: '请输入文章分类', trigger: 'blur' }],
  summary: [{ required: true, message: '请输入文章摘要', trigger: 'blur' }],
  photo: [{ required: true, message: '请上传文章封面', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
})

//定义函数取出所有分类
const getCategory = async () => {
  const res = await http.get('/category/all')
  if (res.code === 200) {
    categoryList.value = res.data
  } else {
    ElMessage('获取分类数据失败')
  }
}
//定义函数取出文章分页数据
const getBlogs = async () => {
  const res = await http.get('/blog', { params: query })
  if (res.code === 200) {
    tableData.value = res.data.records
    total.value = res.data.total
  } else {
    ElMessage('获取博客数据失败')
  }
}
//页面加载时调用两个函数
onMounted(() => {
  getCategory()
  getBlogs()
})
//定义分页函数
const handleSizeChange = async (size) => {
  query.pageSize = size
  getBlogs()
}
const handleCurrentChange = async (page) => {
  query.pageNum = page
  getBlogs()
}
//定义搜索函数
const handleSearch = async () => {
  query.pageNum = 1
  getBlogs()
}
//定义删除函数
const handleDelete = async (index, row) => {
  ElMessageBox.confirm('确定删除记录吗', '提示', { type: 'warning' })
    .then(async () => {
      //请求后台接口删掉数据
      const res = await http.delete(`/blog/${row.id}`)
      if (res.code === 200) {
        //刷新页面
        getBlogs()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      //用户点击了取消
    })
}
//定义添加函数
const handleAddBlog = async () => {
  //拷贝一个空对象作为form数据对象
  Object.assign(form, { title: '', category: { id: '' }, photo: '', summary: '', content: '' })
  dialogTitle.value = '文章添加'
  dialogFormVisible.value = true
}
//定义编辑函数
const handleEdit = async (index, row) => {
  //对象拷贝，防止数据编辑时表格数据也跟着变。
  Object.assign(form, row)
  dialogTitle.value = '文章编辑'
  dialogFormVisible.value = true
}
//图片上传成功回调函数
const handleUploadSuccess = (res) => {
  form.photo = res.data.url
  ElMessage.success('图片上传成功')
}
//定义添加/编辑确定函数
const handleSave = async () => {
  //验证表单
  await formRef.value.validate()
  var res = null
  if (form.id) {
    //编辑
    res = await http.put('/blog', form)
  } else {
    //添加
    res = await http.post('/blog', form)
  }
  if (res.code === 200) {
    //成功则刷新页面
    getCategory()
    getBlogs()
    //弹出成功提示
    ElMessage.success('success')
    //关闭对话框
    dialogFormVisible.value = false
  } else {
    //弹出失败提示
    ElMessage.success(res.message)
  }
}
</script>
<style scoped>
.blogcontainer {
  padding: 30px;
}
.search-box {
  display: flex;
  justify-content: space-between;
  padding-right: 500px;
}
.table-box {
  margin: 30px auto;
}
.photo-uploader .photo {
  width: 178px;
  height: 178px;
  display: block;
}
.photo-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.photo-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.el-icon.upload-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
/* 设置编辑器整体高度 */
.quill-editor :deep(.ql-container) {
  min-height: 400px;
}

/* 让编辑区域填满容器 */
.quill-editor :deep(.ql-editor) {
  min-height: 400px;
}
</style>
