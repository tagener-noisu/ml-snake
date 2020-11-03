const Vector2D = require("../lib/vector2d");
const HumanPlayer = require("../lib/human_player.js");

const {
    SnakeMock,
    WindowMock
} = require("./mocks.js");

describe("HumanPlayer", () => {
    it("adds window event listener", () => {
        const snake = new SnakeMock();
        const window = new WindowMock();
        snake.expect_call("velocity", [], new Vector2D(0, 0));

        const player = new HumanPlayer(window, snake);

        window.expect_call("addEventListener", ["keydown", player.keydown]);
        window.verify();
    });

    it("changes direction of the snake", () => {
        const snake = new SnakeMock();
        const window = new WindowMock();
        snake.expect_call("velocity", [], new Vector2D(0, 0));

        const player = new HumanPlayer(window, snake);

        snake.expect_call("change_direction", [new Vector2D(0, 1)]);
        snake.expect_call("change_direction", [new Vector2D(0, -1)]);
        snake.expect_call("change_direction", [new Vector2D(1, 0)]);
        snake.expect_call("change_direction", [new Vector2D(-1, 0)]);

        const event = {key: "ArrowDown"};
        player.keydown(event);
        player.update();

        event.key = "ArrowUp";
        player.keydown(event);
        player.update();

        event.key = "ArrowRight";
        player.keydown(event);
        player.update();

        event.key = "ArrowLeft";
        player.keydown(event);
        player.update();

        snake.verify();
    });
});
