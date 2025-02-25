function Circle(radius) {
    this.radius = radius;
    Circle.circlesMade++;
}
Circle.draw = function draw(circle, canvas) {
    /* Canvas 绘制代码 */
}
Object.defineProperty(Circle, "circlesMade", {
    get: function() {
        return !this._count ? 0 : this._count;
    },
    set: function(val) {
        this._count = val;
    }
});
Circle.prototype = {
    area() {
        return Math.pow(this.radius, 2) * Math.PI;
    },
    get radius() {
        return this._radius;
    },
    set radius(radius) {
        if (!Number.isInteger(radius)) throw new Error("圆的半径必须为整数。");
        this._radius = radius;
    }
}