class GameBoard {
    constructor(size) {
        this.size = size;
        this.food = [];
        this.snake = [];
    }

    update() {
        this.food = [];
        this.snake = [];
    }

    set_food(pos) {
        if (!this.out_of_bounds(pos))
            this.food.push(pos);
    }

    set_snake(pos) {
        if (!this.out_of_bounds(pos))
            this.snake.push(pos);
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

        if (this.food.filter(x => x.equals(pos)).length > 0)
            return "food";

        if (this.snake.filter(x => x.equals(pos)).length > 0)
            return "snake";

        return "empty";
    }

    render(renderer) {
        this.food.forEach(pos => renderer.fill(pos));
        this.snake.forEach(pos => renderer.fill(pos));
    }
}

module.exports = GameBoard
