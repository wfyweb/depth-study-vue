const View = {

  render (h) {
    let component
    let parent = this.$parent
    // 该组件的vnode设置RouterView标识
    this.$vnode.data.RouterView = true
    // 标记路由深度
    let depth = 0
    while (parent){
      const vnodeData = parent.$vnode && parent.$vnode.data
      if (vnodeData && vnodeData.RouterView){
        depth++
      }

      parent = parent.$parent
    }
    // 通过 router实例获取matched路由表
    const matched = this.$router.matched
    // 根据depth匹配路由表对应的component
    const route = matched[depth]
    if (route){
      component = route.component
    }
    return h(component)
  }
}

export default View