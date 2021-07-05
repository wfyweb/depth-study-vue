import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from './wue-router'
import Home from '../views/Home.vue'
// vue 插件
// 1. fn
// 2. obj,install
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children:[
      {
        path:'/about/info',
        component:{
          render(h){
            return h(
              'div', 
              {}, 
              [
              'render info',
                h('router-view')
              ]
            )
          }
        },
        // children:[
        //   {
        //     path: '/about/info/1',
        //     component: {
        //       render (h) {
        //         return h('div', {},'render info page1')
        //       }
        //     },
        //   }
        // ]
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
