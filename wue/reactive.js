// 数组响应式 ['push', 'pop', 'shift', 'unshift','spilce','sort','reverse']
const originalProto = Array.prototype
// 备份原型
const arrayProto = Object.create(originalProto);
['push', 'pop', 'shift', 'unshift', 'spilce', 'sort', 'reverse'].forEach(method=>{
  arrayProto[method] = function() {
    // 原始操作
    originalProto[method].apply(this, arguments)
    // 覆盖操作：通知更新
    console.log('set=>' + method + '=>' + JSON.stringify(arguments));
  }
})
// 实现响应式
function defineReactive(obj, key, val) {
  const dep = new Dep()
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log('get:', key,'val:',val)
      Dep.target && dep.addDep(Dep.target)
      return val
    },
    set(v){
      if(val !== v) {
        console.log('set:', key, 'val:', v)
        observe(v)
        val = v
        // update
        // watchers.map(watch=>watch.update())
        // 数据改变，通知watcher更新渲染
        dep.notify()
      }
    }
  })
}
function observe (obj) {
  if (typeof obj !== 'object' || obj == null){
    return obj
  }
  if (Array.isArray(obj)){
    // 覆盖原型，替换7个变更操作
    obj.__proto__ = arrayProto
    // 对数组的内部元素执行响应式
    // const kes = Object.keys(obj)
    // for (let i = 0; i < kes.length;i++) {
    //   observe(obj[i])
    // }
    Object.keys(obj).forEach(item => observe(item))
  }else{
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
  
}
function set(obj, key, val) {
  defineReactive(obj, key, val)
} 

// var obj = {
//   foo:'foo',
//   bar:'bar'
// }

// observe(obj)
// 1.简单实现
// obj.foo
// obj.foo = 2
// // 2.遍历需要响应的对象
// obj.bar
// obj.bar = 3
// 3.解决嵌套对象问题
// obj.bar = {
//   a: 'ddd',
//   // 4.解决赋值是对象的情况
//   b:{text:'text'}
// }
// obj.bar.a
// obj.bar.b
// obj.bar.b.text
// // 5.如果添加 / 删除了新的属性无法检测
// set(obj, 'boss', 'boss')
// obj.boss
// obj.boss = 'bossss'
// var obj = [1]
// observe(obj)

// obj.push(3)
