const Vector2D = require("../lib/vector2d");
const Player = require("../lib/player");
const Mock = require("./mock");

const {
    SnakeMock,
} = require("./mocks.js");

describe("Player", () => {
    it("renders itself", () => {
        const snake_pos = new Vector2D(0, 0);
        const snake = new SnakeMock();
        const board = new Mock();
        const renderer = new Mock();

        board.expect_call("next_nonempty_cell", [snake_pos, new Vector2D(1, 0)], new Vector2D(3, 0));
        board.expect_call("next_nonempty_cell", [snake_pos, new Vector2D(0, -1)], new Vector2D(0, -1));
        board.expect_call("next_nonempty_cell", [snake_pos, new Vector2D(-0, 1)], new Vector2D(0, 2));
        renderer.expect_call("line", [snake_pos, new Vector2D(3, 0)]);
        renderer.expect_call("line", [snake_pos, new Vector2D(0, -1)]);
        renderer.expect_call("line", [snake_pos, new Vector2D(0, 2)]);
        snake.expect_call("position", [], snake_pos);
        snake.expect_call("velocity", [], new Vector2D(1, 0));

        const player = new Player(snake, board);
        player.update();
        player.render(renderer, true);
        
        board.verify();
        renderer.verify();
    });
});
