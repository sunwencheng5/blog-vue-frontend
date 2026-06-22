/**
 * HTTP 请求封装
 * 基于 axios 实例，统一配置和拦截处理
 */
import axios from 'axios'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // 基础路径，带 /api 前缀是主流做法，这样可以清晰地区分 API 和静态资源请求，避免路径混乱。最终请求 URL = 当前域名 + /api + 具体路径。
  timeout: 5000, // 请求超时时间（毫秒），超时后会进入错误处理
  withCredentials: true, // 允许携带 cookie，用于保持登录状态或 session
})

service.interceptors.response.use(
  (response) => response.data, // 返回响应数据
  (error) => {
    console.log(error)
    return Promise.reject(error) // 传递错误信息
  },
)

export default service
