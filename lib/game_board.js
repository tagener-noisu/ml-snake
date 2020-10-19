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
            this.board[this.vector_to_index(pos)] = GameBoard.CellType.Food;
    }

    set_snake(pos) {
        if (!this.out_of_bounds(pos))
            this.board[this.vector_to_index(pos)] = GameBoard.CellType.Snake;
    }

    out_of_bounds(pos) {
        return pos.x() < 0 || pos.x() > this.size.x() - 1
            || pos.y() < 0 || pos.y() > this.size.y() - 1;
    }

    next_nonempty_cell(position, velocity) {
        let x = position.plus(velocity);
        while (this.cell(x) == GameBoard.CellType.Empty) {
            x = x.plus(velocity);
        }

        return x;
    }

    cell(pos) {
        if (this.out_of_bounds(pos))
            return GameBoard.CellType.OutOfBounds;

        const result = this.board[this.vector_to_index(pos)];
        if (result == undefined)
            return GameBoard.CellType.Empty;
        else
            return result;
    }

    render(renderer) {
        this.board.forEach((x, i) => {
            renderer.fill(this.index_to_vector(i));
        });
    }
}

GameBoard["CellType"] = {
    OutOfBounds: 0,
    Empty: 1,
    Snake: 2,
    Food: 3,
}

module.exports = GameBoard
