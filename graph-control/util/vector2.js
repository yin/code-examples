"use strict";
var Vector2 = (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.add = function (that) {
        return new Vector2(this.x + that.x, this.y + that.y);
    };
    Vector2.prototype.sub = function (that) {
        return new Vector2(this.x - that.x, this.y - that.y);
    };
    Vector2.prototype.mult = function (scale) {
        return new Vector2(this.x * scale, this.y * scale);
    };
    Vector2.prototype.div = function (scale) {
        return new Vector2(this.x / scale, this.y / scale);
    };
    Vector2.prototype.tang = function (scale) {
        return new Vector2(this.x * scale, this.y * scale);
    };
    Vector2.prototype.neg = function () {
        return new Vector2(-this.x, -this.y);
    };
    Object.defineProperty(Vector2.prototype, "lengthSquared", {
        get: function () {
            return Math.pow(this.x, 2) + Math.pow(this.y, 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2.prototype, "length", {
        get: function () {
            return Math.sqrt(this.lengthSquared);
        },
        enumerable: true,
        configurable: true
    });
    Vector2.prototype.rotate = function (angle) {
        var cosa = Math.cos(angle), sina = Math.sin(angle);
        return new Vector2(this.x * cosa - this.y * sina, this.x * sina + this.y * cosa);
    };
    return Vector2;
}());
exports.Vector2 = Vector2;
//# sourceMappingURL=vector2.js.map