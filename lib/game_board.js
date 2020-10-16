const Vector2D = require("../lib/vector2d");

class GameBoard {
    constructor(size) {
        this.size = size;
        this.board = new Array(size.x() * size.y());
    }

    update() {
        this.board = new Array(this.size.x() * this.size.y());
    }

    vector_to_index(vec) {
        return vec.x() * this.size.y() + vec.y();
    }

    index_to_vector(i) {
        const y = i % this.size.y();
        const x = (i - y) / this.size.y();

        return new Vector2D(x, y);
    }

    set_food(pos) {
        if (!this.out_of_bounds(pos))
            this.board[this.vector_to_index(pos)] = "food";
    }

    set_snake(pos) {
        if (!this.out_of_bounds(pos))
            this.board[this.vector_to_index(pos)] = "snake";
    }

    out_of_bounds(pos) {
        return pos.x() < 0 || pos.x() > this.size.x() - 1
            || pos.y() < 0 || pos.y() > this.size.y() - 1;
    }

    next_nonempty_cell(position, velocity) {
        let x = position.plus(velocity);
        while (this.cell(x) == "empty") {
            x = x.plus(velocity);
        }

        return x;
    }

    cell(pos) {
        if (this.out_of_bounds(pos))
            return "out of bound";

        const result = this.board[this.vector_to_index(pos)];
        if (result == undefined)
            return "empty";
        else
            return result;
    }

    render(renderer) {
        this.board.forEach((x, i) => {
            if (x !== undefined)
                renderer.fill(this.index_to_vector(i));
        });
    }
}

module.exports = GameBoard
