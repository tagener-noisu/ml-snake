const Vector2D = require("./vector2d");
const Player = require("./player");

class HumanPlayer extends Player {
    constructor(window, snake, game_board) {
        super(snake, game_board);

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
