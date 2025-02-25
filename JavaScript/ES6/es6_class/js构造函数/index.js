function Circle(radius) { // 构造函数
    this.radius = radius; // 半径
    Circle.circlesMade++; // 记录创建的圆的数量
}
// 静态方法
Circle.draw = function draw(radius, canvas) {
    console.log('Drawing circle on canvas', canvas, circle);
    /* Canvas 绘制代码 */
};
Object.defineProperty(Circle, "circlesMade", { //定义的静态属性（实例无法访问,之能通过构造函数访问，用于追踪创建的圆的数量
    get: function() {
        return !this._count ? 0 : this._count;
    },
    set: function(val) {
        this._count = val;
    },
});


// 原型方法
Circle.prototype.area = function() { // 计算圆的面积
    return Math.pow(this.radius, 2) * Math.PI;
}

Object.defineProperty(Circle.prototype, "radius", { //(原型属性，实例共享) 半径属性(监听器)
    get: function() {
        return this._radius;
    },
    set: function(radius) {
        if (!Number.isInteger(radius)) throw new Error("圆的半径必须为整数。");
        this._radius = radius;
    },
});