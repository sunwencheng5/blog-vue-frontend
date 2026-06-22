import { defineStore } from 'pinia'
//创建store
export const useStore = defineStore('index', {
  state: () => ({
    //localStorage 的数据保存在本地浏览器中,只能存字符串，存对象需要 JSON.stringify
    //浏览器上右键检查 → Application 标签页 → 左侧 Storage → clear可以清除localstorage
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
  }),
  actions: {
    //登录
    login(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    //更新用户
    setUser(user) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    //退出
    logout() {
      this.user = {}
      this.routes = []
      localStorage.removeItem('user')
    },
  }
})

