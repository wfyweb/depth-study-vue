
class Wue{
  constructor(options) {
    // 1.保存options选项
    this.$options = options
    this.$data = options.data
    // 2. data数据做响应式处理
    observe(this.$data)
    // 2.5 对vue实例的数据做代理
    this.proxy(this, '$data')
    // 3. compile编译
  }
  proxy(vm, key) {
    const $data = vm[key]
    Object.keys($data).forEach(key=>{
      Object.defineProperty(vm, key, {
        get() {
          return $data[key]
        },
        set(v) {
          if ($data[key] !== v) {
            $data[key] = v
          }
        }
      })
    }) 
  }
}