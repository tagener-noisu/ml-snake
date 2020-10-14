const Vector2D = require("./vector2d");

class HumanPlayer {
    constructor(window, snake) {
        this.snake = snake;
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
}

module.exports = HumanPlayer
