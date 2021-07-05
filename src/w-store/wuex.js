let Vue

class Store {
  constructor(options) {
    // options.state 包装为响应式对象
    // $$state 属性vue不会代理
    this._vm = new Vue({
      data:{
        $$state: options.state
      },
    })
    this._mutations = options.mutations
    this._actions = options.actions
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }
  get state() {
    return this._vm._data.$$state
  }
  set state(v) {
    console.error('请勿直接操作state')
  }
  commit(type,payload) {
    const fn = this._mutations[type]
    fn && fn(this._vm._data.$$state, payload)
  }
  dispatch(type, payload) {
    const fn = this._actions[type]
    fn && fn(this, payload)
  }

}
function install(_vue) {
  Vue = _vue

  // vue示例上注册$store
  Vue.mixin({
    beforeCreate() {
      if(this.$options.store){
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
export default { Store, install }