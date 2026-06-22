import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/views/Index.vue' //导入首页文件
import Login from '@/views/Login.vue' //导入登录页文件
import BlogDetail from '@/views/BlogDetail.vue' //导入博客详情页文件
import UserDashboard from '@/views/UserDashboard.vue'
//导入个人中心页文件

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      //配置首页的路由
      path: '/', //url路径（访问网站根路径时触发）
      name: 'index', //路由名称（用于编程式导航，如 router.push({ name: 'index' })）
      component: Index, //对应的组件
    },
    {
      //配置登录页的路由
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      //配置博客详情页的路由
      path: '/blogdetail',
      name: 'blogdetail',
      component: BlogDetail,
    },
    {
      //配置个人中心页的路由
      path: '/user',
      name: 'user',
      component: UserDashboard,
      redirect: '/user/info' /**重定向到个人信息页 */,
      meta: {
        title: '个人中心',
        requiresAuth: true, // 登录就能访问
      },
      children: [
        {
          //配置我的文章页的路由
          path: 'blog',
          name: 'blog',
          component: () => import('@/views/BlogManage.vue'),
          meta: {
            title: '我的文章',
            requiresAuth: true, // 登录就能访问
          },
        },
        {
          //配置文章分类页的路由
          path: 'category',
          name: 'category',
          component: () => import('@/views/CategoryManage.vue'),
          meta: {
            title: '文章分类',
            requiresAuth: true, // 登录就能访问
          },
        },
        {
          //配置个人信息页的路由
          path: 'info',
          name: 'info',
          component: () => import('@/views/UserInfo.vue'),
          meta: {
            title: '个人信息',
            requiresAuth: true, // 登录就能访问
          },
        },
        {
          //配置修改密码页的路由
          path: 'password',
          name: 'password',
          component: () => import('@/views/Password.vue'),
          meta: {
            title: '修改密码',
            requiresAuth: true, // 登录就能访问
          },
        },
      ],
    },
  ],
})

// 全局前置守卫，用于登录状态管理和权限控制
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title + ' - 博客天地'
  } else {
    document.title = '博客天地'
  }

  // 检查是否需要登录权限
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 获取登录状态
    const userInfo = localStorage.getItem('user')

    // 如果没有登录，跳转到登录页
    if (!userInfo) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }, // 保存原来的路径，登录成功后可以跳转回来
      })
    } else {
      // 已登录，可以访问
      next()
    }
  } else {
    // 不需要登录的页面直接放行
    next()
  }
})

// 全局后置钩子，可以在这里做一些页面加载后的操作
router.afterEach((to, from) => {
  // 可以添加一些页面访问统计、性能监控等逻辑
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router
