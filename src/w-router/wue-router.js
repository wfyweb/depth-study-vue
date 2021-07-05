import Link from "./link"
import View from "./view"

let Vue

class Router {
  constructor(options) {
    // 保存用户的路由表
    this.$options = options 
    const inital = window.location.hash.slice(1) || '/'
    // current记录地址的hash
    // this.current = inital
    Vue.util.defineReactive(this,'current',inital)
    window.addEventListener('hashchange',()=>{
      this.current = window.location.hash.slice(1)
    })
  }
}
Router.install = function(_Vue){
  // 全局保存Vue的构造函数
  Vue = _Vue
  // 1. 注册this.$router，所有组件都可以访问
  Vue.mixin({
    beforeCreate(){
      if (this.$options.router){
        Vue.prototype.$router = this.$options.router
      }
    }
  })
  // 2. 注册 router-link router-view两个组件
  Vue.component('router-link', Link)
  Vue.component('router-view', View)
}


export default Router