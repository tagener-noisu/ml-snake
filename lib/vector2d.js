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
}

module.exports = Vector2D
