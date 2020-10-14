const Vector2D = require("./vector2d");

class HumanPlayer {
    constructor(window, snake, board) {
        this.snake = snake;
        this.game_board = board;
        this.keydown = this.keydown.bind(this);
        window.addEventListener("keydown", this.keydown);
    }

    keydown(e) {
        switch (e.key) {
        case "ArrowDown":
            this.snake.change_direction(new Vector2D(0, 1));
            break;
        case "ArrowUp":
            this.snake.change_direction(new Vector2D(0, -1));
            break;
        case "ArrowRight":
            this.snake.change_direction(new Vector2D(1, 0));
            break;
        case "ArrowLeft":
            this.snake.change_direction(new Vector2D(-1, 0));
            break;
        }
    }

    update() {
    }

    render(renderer) {
        let pos = this.snake.position().plus(this.snake.velocity);
        while (this.game_board.cell(pos) == "empty") {
            pos = pos.plus(this.snake.velocity);
        }
        renderer.line(this.snake.position(), pos);
    }
}

module.exports = HumanPlayer
