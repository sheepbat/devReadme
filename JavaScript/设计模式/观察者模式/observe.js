// 目标类
class Subject {
  constructor() {
    this.observers = [];
  }
  
   // 添加观察者
  add(observer) {
    this.observers.push(observer);
  }

  // 移除观察者
  remove(observer) {
    const index = this.observers.indexOf(observer);
    if (index!== -1) {
      this.observers.splice(index, 1);
    }
  }

  // 通知所有观察者
  notify(message) {
    this.observers.forEach(observer => observer.update(message));
  }
}

// 观察者类
class Observer {
  constructor(config) {
    this.name = config.name || config  || 'ObserverA';
  }
  update(message) {
    console.log(`ObserverA received message: ${message}: ${this.name}`);
  }
}
// 被观察者类2
class Car {
  constructor(config={}) {
    this.type = config.type || 'BMW';
    this.color = config.color || 'red';
    this.speed = config.speed || 0;
  }
  addSpeed(speed) {
    this.speed += speed;
  }
  update(message) {
    console.log(`Car received message:${message},你的${this.type}车你当前的速度是 ${this.speed}====msg: `);
  }
}

const observer = new Subject();
observer.add(new Observer('张三'));
observer.add(new Observer('李四'));
observer.add(new Car({
    type: 'Audi',
    color: 'blue',
    speed: 10
}));


observer.notify('你好====>'); // Output: ObserverA received message: Hello World, ObserverB received message: Hello World