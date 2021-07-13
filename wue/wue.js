
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
    new compile(options.el, this)

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
      // 判断attrName是否是指令或动态件等
      if(attrName.startsWith('w-')) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }

    })
  }
  text (node, exp){
    node.textCenter = this.$vm[exp]
  }
  html (node, exp) {
    node.innerHTML = this.$vm[exp]
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textCentent);
  }
  compileText(node) {
    node.textCenter = this.$vm[RegExp.$1]
  }
}

