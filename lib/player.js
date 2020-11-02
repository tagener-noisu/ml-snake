const Vector2D = require("./vector2d");

class Player {
    constructor(snake, board) {
        this.snake = snake;
        this.game_board = board;
    }

    update() {
    }

    render(renderer) {
        const position = this.snake.position();
        const velocity = this.snake.velocity();

        const next_nonempty = (velocity) => {
            return this.game_board.next_nonempty_cell(position, velocity);
        };

        const forward = next_nonempty(velocity);
        renderer.line(position, forward);

        const left = next_nonempty(velocity.turn_left());
        renderer.line(position, left);

        const right = next_nonempty(velocity.turn_right());
        renderer.line(position, right);
    }
}

module.exports = Player
