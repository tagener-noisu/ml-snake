const Vector2D = require("../lib/vector2d");
const Player = require("../lib/player");

const {
    SnakeMock,
    RenderMock,
    GameBoardMock,
} = require("./mocks.js");

describe("Player", () => {
    it("renders itself", () => {
        const snake_pos = new Vector2D(0, 0);
        const snake_velocity = new Vector2D(1, 0);
        const snake = new SnakeMock(snake_pos, snake_velocity);
        const board = new GameBoardMock();
        const renderer = new RenderMock();

        board.expect_call("next_nonempty_cell", [snake_pos, new Vector2D(1, 0)], new Vector2D(3, 0));
        board.expect_call("next_nonempty_cell", [snake_pos, new Vector2D(0, -1)], new Vector2D(0, -1));
        board.expect_call("next_nonempty_cell", [snake_pos, new Vector2D(-0, 1)], new Vector2D(0, 2));
        renderer.expect_call("line", [snake_pos, new Vector2D(3, 0)]);
        renderer.expect_call("line", [snake_pos, new Vector2D(0, -1)]);
        renderer.expect_call("line", [snake_pos, new Vector2D(0, 2)]);

        const player = new Player(snake, board);
        player.update();
        player.render(renderer, true);
        
        board.verify();
        renderer.verify();
    });
});
