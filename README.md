markdown
# Blog Vue Frontend

基于 Vue 3 + Vite 的博客系统前端项目，提供文章展示、分类浏览、用户交互等前端界面。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - 官方路由管理器
- **Pinia** - Vue 状态管理库（如使用）
- **Axios** - HTTP 请求库（如使用）
- **ESLint** - 代码规范检查

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/sunwencheng5/blog-vue-frontend.git
cd blog-vue-frontend
2. 安装依赖
bash
npm install
3. 配置后端接口
在 src 目录下创建或修改环境变量文件（如 .env.development），配置后端 API 地址：

env
VITE_API_BASE_URL=http://localhost:8080/api
具体配置方式请参考项目中的 vite.config.js 或相关配置文件。

4. 启动开发服务器
bash
npm run dev
项目将在本地启动，默认地址为 http://localhost:5173。

5. 构建生产版本
bash
npm run build
构建产物将输出到 dist 目录。

6. 代码检查
bash
npm run lint
脚本说明
命令	说明
npm run dev	启动开发服务器（热重载）
npm run build	构建生产环境代码
npm run preview	预览生产构建结果
npm run lint	运行 ESLint 代码检查
环境要求
Node.js 16.0 及以上

npm 7.0 及以上 或 pnpm / yarn

相关仓库
后端服务：blog-server-Backend

贡献
欢迎提交 Issue 和 Pull Request。

License
暂无

text

---

## 如何使用

1. 将上述内容完整复制
2. 在项目根目录下创建或覆盖 `README.md` 文件
3. 提交并推送：

```bash
git add README.md
git commit -m "docs: 完善 README 文档"
git push origin main
