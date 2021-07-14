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
  Object.keys(obj).forEach(key=>{
    defineReactive(obj, key, obj[key])
  })
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