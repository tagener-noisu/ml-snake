class Vector2D {
    constructor(x, y) {
        this.pos = {x, y};
    }

    x() {
        return this.pos.x;
    }

    y() {
        return this.pos.y;
    }

    plus(other) {
        return new Vector2D(this.pos.x + other.x(), this.pos.y + other.y());
    }

    equals(other) {
        return this.pos.x == other.x() && this.pos.y == other.y();
    }

    multiply(n) {
        return new Vector2D(this.pos.x * n, this.pos.y * n);
    }

    turn_left() {
        return new Vector2D(this.pos.y, this.pos.x * -1);
    }

    turn_right() {
        return new Vector2D(this.pos.y * -1, this.pos.x);
    }

    distance(other) {
        return Math.sqrt(
            Math.pow(this.pos.x + other.pos.x, 2)
            + Math.pow(this.pos.y + other.pos.y, 2));
    }
}

module.exports = Vector2D
