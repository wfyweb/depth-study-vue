# depth-study-vue

## vue-router的原理

#### 核心思想：
SPA应用中，url发生变化时候，页面内容切换，但是页面不会刷新。


#### 问题：

- 插件为什么要先use，vue.use具体做了什么，原理是什么？

- 为什么要把router实例挂载到Vue实例的选项里面？

- router-link和router-view的作用是什么，为什么组件可以直接用？
  router-view的主要作用是占位符，持有内容的容器，如果内容的切换，就在该容器中更新视图。

#### 需求分析
- spa页面不能刷新
	- hash #/about
	- History api /about
- 根据url显示对应的内容
	- router-view
	- 数据响应式: current 变量持有url地址，一旦变化，动态重新执行render

- 解决路由嵌套问题

  - 标记当前view组件的深度depth

  - 路由匹配时获取代表深度层级的matched数组



### code

1. vue插件：fn，object,install  Vue.use会调用install方法

2. 要在VueRouter类上面实现一个install方法

3. 在install 的函数中 介绍参数1是vue的构造方法，如果

4. 一般会把vue 实例保存在局部，不需要在插件里面improt vue可以解构

5. 接下来 install函数里实现 

   1.  注册$router,让所有的组件实例都可以访问this.$router
   2. 注册两个全局的组件：router-link router-view

6. 一般思路注册$router，会在Vue.prototype.$router = router,但是这个时候没有new Router拿不到router实例，早于vue实例创建和router实例创建，这么办思考下？如何延迟执行拿到实例

7. 使用混入方式，什么场景下使用？ 大概率在创建中使用，当要访问vue实例或者组件（router）实例使用

8. 注意vue3没有mixin 了，但是是需要混入，延迟执行。注意这时形参就不是vue的构造函数，而是实例。

9. 在vue.mixin 的beforeCreate中拿到router实例 this.$options.router

  ```js
  Vue.mixin({
      beforeCreate() {
          // 延迟执行：延迟router实例和vue实例都创建完毕
          if(this.$options.router){
              Vue.prototype.$router = this.$options.router
          }
      }
  })
  ```

10. 接下来注册两个全局组件：router-link, router-view

    router-link如果动态的展示文本内容需要用到插槽，this.$slots.default

    attrs属性设置href的值

    尽可能使用render函数去描述组件，这样通用性强。jsx也可以但是要求配置jsx环境

```js
  Vue.component('router-link',{
      props:{
          to: String,
          require: true,
      }
      render(h){
         //return <a href={'#'+this.to}>{this.$slots.default}</a>;
          return h('a',{
              attrs:{
                href: '#'+this.to
              }
          },this.$slots.default)
      }
  })
  Vue.component('router-view',{
      render:h=>h(null)
  })
```

11. 在router 类的构造函数中，保存路由表
12. 在router 类的构造函数中，使用hashchange事件，监听hash的变化，保存current变量中。
13. 在router-view组件中获取当前url的hash部分(current) , 从路由表中获取对应的组件
14. ```重点``` 是在router-view组件中获取 router的实例，这么获取？
    1. this指向谁，router-view组件。
    2. 还记得install函数开始后，vue.mixin混入方式，在vue的原型链上挂载了router实例
    3. 那么在组件中可以 this.$router这样获取router的实例
15. ```重点``` hash改变了，router-view没有更新，那么如何给current成为一个响应式数据
16. Vue.set(this,'current',inital)可以不，不行因为，set的第一个参数必须是一个响应式对象
17. 解决路由多层嵌套，渲染组件问题
18. 首先在view中标记该组件的深度deptch
19. 定义this.$vnode.data.RouterView然后通过while循环parent中是否有RouterView
20. 有RouterView的话说明该组件中有router-view标签，depch++，直到跳出循环记录深度
21. 然后router构造函数中定义matched数组，用于存放深度嵌套的路由
22. 调用match方法递归处理嵌套的路由，判断条件：
    1. curren顶层和path顶层结束递归
    2. curren中包含path 将此路由增加到matched中
    3. 当前路由包含children再次调用match方法
