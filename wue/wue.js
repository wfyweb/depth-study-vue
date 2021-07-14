
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
        this[event] && this[event](node,event,exp)
      }
    })
  }
  compileText (node) {
    // node.textContent = this.$vm[RegExp.$1]
    this.updateCompile(node, RegExp.$1, 'text')
  }
  text (node, exp){
    // node.textContent = this.$vm[exp]
    this.updateCompile(node, exp, 'text')
  }
  html (node, exp) {
    // node.innerHTML = this.$vm[exp]
    this.updateCompile(node, exp, 'html')

  }
  // 节点，表达式， 指令
  updateCompile (node, exp, dir) {
    // 创建
    const fn = this[`${dir}Update`]
    fn && fn(node, this.$vm[exp])
    // 更新
    new Watcher(this.$vm, exp, (val)=>{
      fn && fn(node, val)
    })
  }
  textUpdate (node, value) {
    node.textContent = value
  }
  htmlUpdate (node, value) {
    node.innerHTML = value
  }
  // 增加事件
  click (node,event,exp){
    const methods = this.$vm.$methods
    Object.keys(methods).forEach(key=>{
      if(key === exp){
        node.addEventListener(`${event}`,()=>{
          methods[exp].call(this.$vm)
        })
      }
    })
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  
}
// watcher 更新在哪里调用？
// set?  最好在compile里面，当数据变化时候调用watcher
// 监听数据变化 更新update
const watchers = []
class Watcher {
  constructor(vm, key, updateFn) {
    // 保存options
    this.$vm = vm
    this.$key = key
    this.updateFn = updateFn
    watchers.push(this)
    // 调用更新函数
    this.update()
  }
  update() {
    this.updateFn.call(this.$vm, this.$vm[this.$key] )
  }
}

