
class Vue{
  constructor(options = {}){
    // console.log(options);
    this.$el = document.querySelector(options.el);
    this.data = options.data;
    Object.keys(this.data).forEach((key)=>{
      this.proxyData(key)
    })
    this.methods = options.methods;
    this.watcherTask = {};  //监听的任务列表
    this.observer(this.data); //劫持监听data  data property是否变化
    this.compile(this.$el);//解析dom
    // console.log(this)
  }
  // 代理data，转化表现形式（this.data.xxx  --->  this.xxx）
  proxyData(key){
    let that = this;
    Object.defineProperty(that,key,{
      configurable:false,
      enumerable:true,
      get(){
        return that.data[key];
      },
      set(newval){
        that.data[key] = newval;
      }
    })
  }

  observer(data){
    let that = this;
    Object.keys(data).forEach((key)=>{
      let value = data[key];
      that.watcherTask[key] = [];
      Object.defineProperty(data,key,{
        configurable:false,
        enumerable:true,
        get(){
          return value;
        },
        set(newval){
          if(newval !== value){
            value = newval;
            this.watcherTask[key].forEach((task)=>{
              task.update()
            })
          }
        }
      })
    })
  }

  compile(el){
    let nodes = el.childNodes;
    for(var i=0;i<nodes.length;i++){
      let node = nodes[i];
      if(node.nodeType === 3 ){ //文本节点
        var text = node.textContent.trim();
        if (!text) continue;
        this.compileText(node,'textContent')
      }else if(node.nodeType === 1){
        if(node.childNodes.length>0){
          this.compile(node)
        }
      }
    }
  }

  compileText(node,type){
    let reg = /\{\{(.*)\}\}/g;
    let txt = node.textContent;
    if(reg.test(txt)){
      node.textContent = txt.replace(reg,(matched,value)=>{
        let tmp = this.watcherTask[value] || [];
        tmp.push(new Watcher(this.$el,this,value,type));
        return 
      })
    }
  }


}

//订阅
class Watcher{
  constructor(el,vm,value,type){
    this.el = el;
    this.vm = vm;
    this.value = value;
    this.type = type;
    this.update()
  }
  update(){
    this.el[this.type] = this.vm.data[this.value];
  }
}