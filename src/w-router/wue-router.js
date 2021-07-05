let Vue

class Router {
  constructor(options) {
    // 保存用户的路由表
    this.$options = options
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
  Vue.component('router-link', {
    render(h){
      return h(
        'a',
        {
          attrs:{
            href: '#' + this.$attrs.to
          }
        },
        this.$slots.default
      )
    }
  })
  Vue.component('router-view', {
    render (h) {
      return h(
        'div',
        'view'
      )
    }
  })
}


export default Router