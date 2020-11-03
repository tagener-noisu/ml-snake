const Vector2D = require("./vector2d");
const Player = require("./player");

class HumanPlayer extends Player {
    constructor(window, snake, game_board) {
        super(snake, game_board);

        this.direction = snake.velocity();
        this.keydown = this.keydown.bind(this);
        window.addEventListener("keydown", this.keydown);
    }

    update() {
        this.snake.change_direction(this.direction);
    }

    keydown(e) {
        switch (e.key) {
        case "ArrowDown":
                this.direction = new Vector2D(0, 1);
                break;
        case "ArrowUp":
                this.direction = new Vector2D(0, -1);
                break;
        case "ArrowRight":
                this.direction = new Vector2D(1, 0);
                break;
        case "ArrowLeft":
                this.direction = new Vector2D(-1, 0);
                break;
        }
    }
}

module.exports = HumanPlayer
