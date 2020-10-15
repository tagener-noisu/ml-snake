class Player {
    constructor(snake, board) {
        this.snake = snake;
        this.game_board = board;
    }

    update() {
    }

    render(renderer, log = false) {
        let pos = this.snake.position().plus(this.snake.velocity);
        while (this.game_board.cell(pos) == "empty") {
            pos = pos.plus(this.snake.velocity);
        }
        renderer.line(this.snake.position(), pos);
    }
}

module.exports = Player
