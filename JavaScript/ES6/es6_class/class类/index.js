class Circle {
  constructor(radius) {
    this.radius = radius;
    Circle.circlesMade++;  // Class
    Circle.sort = true;  // Class
    Circle.init()
  }
  static init() {
    console.log('Circle init', Circle.sort);
  }
  static set sort(val) {
   this._sort = val;
  }
  static get sort() {
    return this._sort;
  }
  static draw(circle, canvas) {
    console.log('Drawing circle====', circle);
    // Canvas 绘制代码
  }
  static get circlesMade() {
    return !this._count ? 0 : this._count;
  }
  static set circlesMade(val) {
    this._count = val;
  }
  area() {
    return Math.pow(this.radius, 2) * Math.PI;
  }
  get radius() {
    return this._radius;
  }
  set radius(radius) {
    if (!Number.isInteger(radius)) throw new Error("圆的半径必须为整数。");
    this._radius = radius;
  }
}
