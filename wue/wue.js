
class Wue{
  constructor(options) {
    // 1.保存options选项
    this.$options = options
    this.$data = options.data
    this.$methods = options.methods
    // 2. data数据做响应式处理
    observe(this.$data)
    // 2.5 对vue实例的数据做代理
    this.proxy(this, '$data')
    // 3. compile编译
    new Compile(options.el, this)

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
class Compile{
  constructor(el, vm) {
    this.$vm = vm
    
    this.compile(document.querySelector(el))
  }
  // 遍历解析dom
  compile(el) {
    Array.from(el.childNodes).forEach(node=>{
      if(node.nodeType === 1){
        // 元素
        this.compileElement(node)
        if(node.childNodes.length) {
          this.compile(node)
        }
      }
      if(this.isInter(node)){
        // 插值文本
        this.compileText(node);
      }
    })
  }
  // 编译Element
  compileElement(node) {
    // 1.获取当前元素的所有属性，并判断他们是不是动态的
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr=>{
      const attrName = attr.name
      const exp = attr.value
      // 2.判断attrName是否是指令或动态件等
      if(attrName.startsWith('w-')) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
      // 3.判断事件
      if (attrName.startsWith('@')) {
        const event = attrName.substring(1)
        this[event] && this[event](event,exp)
      }

    })
  }
  text (node, exp){
    node.textContent = this.$vm[exp]
  }
  html (node, exp) {
    node.innerHTML = this.$vm[exp]
  }
  // 增加事件
  click (event,exp){
    const methods = this.$vm.$methods
    Object.keys(methods).forEach(key=>{
      if(key === exp){
        document.addEventListener(`${event}`,()=>{
          methods[exp].call(this.$vm)
        })
      }
    })
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    node.textContent = this.$vm[RegExp.$1]
  }
}

