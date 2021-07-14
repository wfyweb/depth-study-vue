
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
  // 节点，表达式， 指令
  updateCompile (node, exp, dir) {
    // 创建
    const fn = this[`${dir}Update`]
    fn && fn(node, this.$vm[exp])
    // 更新
    new Watcher(this.$vm, exp, (val) => {
      fn && fn(node, val)
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
  model(node, exp) {
    this.updateCompile(node, exp, 'model')
    // 赋值给data
    node.addEventListener('input',(e)=>{
      this.$vm[exp] = e.target.value
    })
  }

  textUpdate (node, value) {
    node.textContent = value
  }
  htmlUpdate (node, value) {
    node.innerHTML = value
  }
  modelUpdate (node, value) {
    // 表单元素
    node.value = value
  }
  // 增加事件
  click (node,event,exp){
    const fn = this.$vm.$methods && this.$vm.$methods[exp]
    if (fn) {
      node.addEventListener(`${event}`, () => {
        fn.call(this.$vm)
      })
    }else{
      console.error('Detecting events in methods')
    }
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  
}
// watcher 更新在哪里调用？
// set?  最好在compile里面，当数据变化时候调用watcher
// 监听数据变化 更新update
class Watcher {
  constructor(vm, key, updateFn) {
    // 保存options
    this.$vm = vm
    this.$key = key
    this.updateFn = updateFn
    // 创建watcher 就添加到dep
    Dep.target = this
    this.$vm[this.$key]
    Dep.target = null
    // 调用更新函数
    this.update()
  }
  update() {
    this.updateFn.call(this.$vm, this.$vm[this.$key] )
  }
}

// 依赖收集
class Dep {
  constructor() {
    this.deps = []
  }
  // dep代表这watcher实例，一个dep可以管理多个watcher
  addDep(dep) {
    this.deps.push(dep)
  }
  notify() {
    this.deps.forEach(dep=> dep.update())
  }
}

