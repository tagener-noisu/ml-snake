const Vector2D = require("../lib/vector2d");
const HumanPlayer = require("../lib/human_player.js");

const {
    SnakeMock,
    WindowMock
} = require("./mocks.js");

describe("HumanPlayer", () => {
    it("adds window event listener", () => {
        const window = new WindowMock();
        const player = new HumanPlayer(window);

        window.expect_call("addEventListener", ["keydown", player.keydown]);
        window.verify();
    });

    it("changes direction of the snake", () => {
        const coords = new Vector2D(0, 0);
        const snake = new SnakeMock(coords);
        const window = new WindowMock();
        const player = new HumanPlayer(window, snake);

        snake.expect_call("change_direction", [new Vector2D(0, 1)]);
        snake.expect_call("change_direction", [new Vector2D(0, -1)]);
        snake.expect_call("change_direction", [new Vector2D(1, 0)]);
        snake.expect_call("change_direction", [new Vector2D(-1, 0)]);

        const event = {key: "ArrowDown"};
        player.keydown(event);

        event.key = "ArrowUp";
        player.keydown(event);

        event.key = "ArrowRight";
        player.keydown(event);

        event.key = "ArrowLeft";
        player.keydown(event);

        snake.verify();
    });
});
