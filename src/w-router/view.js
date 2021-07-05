const View = {

  render (h) {
    let component
    // router 实例获取current
    const current = this.$router.current
    // router 实例获取路由表
    const routes = this.$router.$options.routes
    // 根据current匹配路由表对应的component
    const route = routes.find(route => route.path === current)
    if (route){
      component = route.component
    }
    return h(component)
  }
}

export default View