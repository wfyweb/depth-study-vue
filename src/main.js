import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
// import router from './router'
import router from './w-router/index'
// import store from './store'
import store from './w-store'


Vue.config.productionTip = false
// 事件总线
Vue.prototype.$bus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
