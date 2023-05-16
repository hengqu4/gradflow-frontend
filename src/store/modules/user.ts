import { defineStore } from 'pinia'
import {login,logout} from '@/api/user'
import {createBScroll} from "@better-scroll/core";
import use = createBScroll.use;

export const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userState',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null,
    // 登录用户信息
    userInfo: {} as any,
    // 角色
    roles: [],
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    // 登录
    async userLogin(userInfo) {
      const { email, password } = userInfo
      let currentUser=await login(userInfo);
      // this.token = currentUser.token
      this.userInfo = currentUser.data
      await this.getRoles()
    },
    // 获取用户授权角色信息，实际应用中 可以通过token通过请求接口在这里获取用户信息
    getRoles() {
      return new Promise((resolve, reject) => {
        // 获取权限列表 默认就是超级管理员，因为没有进行接口请求 写死
        this.roles.push( this.userInfo.role)
        resolve(this.roles)
      })
    },
    // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
    getInfo(roles) {
      return new Promise((resolve, reject) => {
        this.roles = roles
        resolve(roles)
      })
    },
    // 退出
    async logout() {
      let res=false;
      await logout(this.token).then((response)=>{
        if(response.code==0){
          console.log("进入这里")
          res=true
        }
      })
      return new Promise((resolve, reject) => {
        if(res){
          console.log("进入Promise")
          this.token = null
          this.userInfo = {}
          this.roles = []
          resolve(null)
        }
        reject(null)
      })
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'userState',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})
