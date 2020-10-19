const Vector2D = require("../lib/vector2d");
const GameManager = require("../lib/game_manager");

const {
    SnakeMock,
    FoodMock,
    RenderMock,
    GameBoardMock,
    PlayerMock,
    WindowMock
} = require("./mocks.js");

describe("GameManager", () => {
    const field_size = new Vector2D(10, 10);

    it("updates game_board, snake, food, player and render", () => {
        const snake = new SnakeMock(new Vector2D(0, 0));
        const food = new FoodMock(new Vector2D(3, 7));
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();
        const gm = new GameManager(field_size, snake, food, board, render, player);

        board.expect_call("update", []);
        snake.expect_call("update", []);
        snake.expect_call("is_dead", [], false);
        food.expect_call("update", []);
        render.expect_call("update", []);
        player.expect_call("update", []);
        gm.update();

        board.verify();
        snake.verify();
        food.verify();
        render.verify();
        player.verify();
    });

    it("stops updating it's objects on game over", () => {
        const snake = new SnakeMock(new Vector2D(0, 0));
        const food = new FoodMock(new Vector2D(3, 7));
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();
        const gm = new GameManager(field_size, snake, food, board, render, player);

        gm.game_over();
        gm.update();

        board.verify();
        snake.verify();
        food.verify();
        render.verify();
    });

    it("calls snake.grow() and food.change_position() when snake eats food", () => {
        const snake = new SnakeMock(new Vector2D(4, 7));
        const food = new FoodMock(new Vector2D(4, 7));
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();
        const gm = new GameManager(field_size, snake, food, board, render, player);

        snake.expect_call("grow", []);
        snake.expect_call("update", []);
        snake.expect_call("is_dead", [], false);
        food.expect_call("change_position", []);
        food.expect_call("update", []);
        gm.update();

        snake.verify();
        food.verify();
    });

    it("updates score when snake eats food", () => {
        const snake = new SnakeMock(new Vector2D(4, 7));
        const food = new FoodMock(new Vector2D(4, 7));
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();
        const gm = new GameManager(field_size, snake, food, board, render, player);

        expect(gm.score()).toBe(0);
        gm.update();
        expect(gm.score()).toBe(1);
    });

    it("checks bounds", () => {
        const gm = new GameManager(field_size);

        expect(gm.out_of_bounds(new Vector2D(0, 0))).toBe(false);
        expect(gm.out_of_bounds(new Vector2D(9, 9))).toBe(false);

        expect(gm.out_of_bounds(new Vector2D(-1, 0))).toBe(true);
        expect(gm.out_of_bounds(new Vector2D(10, 0))).toBe(true);
        expect(gm.out_of_bounds(new Vector2D(0, -1))).toBe(true);
        expect(gm.out_of_bounds(new Vector2D(0, 10))).toBe(true);
    });

    it("check bounds on update", () => {
        const coords = new Vector2D(11, 0);
        const snake = new SnakeMock(coords);
        const food = new FoodMock(coords);
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();
        const gm = new GameManager(field_size, snake, food, board, render, player);

        gm.update();
        expect(gm.is_game_over()).toBe(true);
    });

    it("finishes the game when snake eats itself", () => {
        const snake = new SnakeMock(new Vector2D(0, 0));
        const food = new FoodMock(new Vector2D(4, 4));
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();

        snake.expect_call("update", []);
        snake.expect_call("is_dead", [], true);

        const gm = new GameManager(field_size, snake, food, board, render, player);
        gm.update();

        snake.verify();
        expect(gm.is_game_over()).toBe(true);
    });

    it("renders snake, food and player", () => {
        const coords = new Vector2D(0, 0);
        const snake = new SnakeMock(coords);
        const food = new FoodMock(coords);
        const render = new RenderMock();
        const board = new GameBoardMock();
        const player = new PlayerMock();
        const gm = new GameManager(field_size, snake, food, board, render, player);

        snake.expect_call("put", [board]);
        food.expect_call("put", [board]);
        board.expect_call("render", [render]);
        player.expect_call("render", [render]);
        gm.render();

        snake.verify();
        food.verify();
        board.verify();
        player.verify();
    });

    it("runs itself with interval", () => {
        const interval = 200;
        const window = new WindowMock();
        const gm = new GameManager(field_size);

        window.expect_call("setInterval", [gm.tick, interval]);
        gm.run(window, interval);

        window.verify();
    });
});
