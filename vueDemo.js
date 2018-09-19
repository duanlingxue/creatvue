var obj = {
  name:'张三'
};
var age = 24;
Object.defineProperty(obj,'age',{
  enumerable:true,  //可枚举
  configurable:false,  //不可define
  get(){
    return age; //必须return  否则该属性为undefine
  },
  set(newval){
    console.log('改变了',age,'---->',newval)
    age=newval;
  }
})
console.log(obj.age)
obj.age = 25;
console.log(obj.age)