const Vector2D = require("../lib/vector2d");
const AIPlayer = require("../lib/ai_player");
const GameBoard = require("../lib/game_board");
const Mock = require("./mock");

describe("AIPlayer", () => {
    const position = new Vector2D(0, 0);
    const velocity = new Vector2D(1, 0);
    const turn_threshold = 0.8;

    it("calls run() on it's neural net", () => {
        const snake = new Mock();
        snake.expect_call("position", [], position);
        snake.expect_call("velocity", [], velocity);

        const game_board = new Mock();
        const expect_next_nonempty = (velocity, pos, type) => {
            game_board.expect_call(
                "next_nonempty_cell", [position, velocity], pos);
            game_board.expect_call(
                "cell", [pos], type);
        }

        expect_next_nonempty(
            velocity,
            new Vector2D(4, 0),
            GameBoard.CellType.OutOfBounds);

        expect_next_nonempty(
            velocity.turn_left(),
            new Vector2D(0, -1),
            GameBoard.CellType.OutOfBounds);

        expect_next_nonempty(
            velocity.turn_right(),
            new Vector2D(0, 2),
            GameBoard.CellType.Food);

        const nn_args = [
            4.0, GameBoard.CellType.OutOfBounds,
            1.0, GameBoard.CellType.OutOfBounds,
            2.0, GameBoard.CellType.Food
        ];
        const nn = new Mock();
        nn.expect_call("run", nn_args, [0.81, 0.1, 0.11]);

        const player = new AIPlayer(snake, game_board, nn, turn_threshold);
        player.update();

        snake.verify();
        game_board.verify();
        nn.verify();
    });

    it("doesn't do anything if all probabilies less than threshold", () => {
        const snake = new Mock();
        const player = new AIPlayer(snake, null, null, turn_threshold);
        player.evaluate(position, velocity, [0.1, 0.1, 0.0]);

        snake.verify();
    });

    it("doesn't do anything if don't turn probability is greater", () => {
        const snake = new Mock();
        const player = new AIPlayer(snake, null, null, turn_threshold);
        player.evaluate(position, velocity, [0.82, 0.81, 0.0]);

        snake.verify();
    });

    it("turns left", () => {
        const snake = new Mock();
        snake.expect_call("change_direction", [velocity.turn_left()]);

        const player = new AIPlayer(snake, null, null, turn_threshold);
        player.evaluate(position, velocity, [0.42, 0.81, 0.0]);

        snake.verify();
    });

    it("turns right", () => {
        const snake = new Mock();
        snake.expect_call("change_direction", [velocity.turn_right()]);

        const player = new AIPlayer(snake, null, null, turn_threshold);
        player.evaluate(position, velocity, [0.42, 0.81, 0.82]);

        snake.verify();
    });
});
