const Vector2D = require("./vector2d");

class Player {
    constructor(snake, board) {
        this.snake = snake;
        this.game_board = board;
    }

    update() {
    }

    turns(vel) {
        return {
            left: new Vector2D(vel.y(), vel.x() * -1),
            right: new Vector2D(vel.y() * -1, vel.x())
        };
    }

    render(renderer, log = false) {
        const position = this.snake.position();

        const next_nonempty = (velocity) => {
            return this.game_board.next_nonempty_cell(position, velocity);
        };

        const forward = next_nonempty(this.snake.velocity);
        renderer.line(position, forward);

        const turns = this.turns(this.snake.velocity);

        const left = next_nonempty(turns.left);
        renderer.line(position, left);

        const right = next_nonempty(turns.right);
        renderer.line(position, right);
    }
}

module.exports = Player
