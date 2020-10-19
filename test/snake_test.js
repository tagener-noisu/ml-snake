const Vector2D = require("../lib/vector2d");
const Snake = require("../lib/snake");

const {
    GameBoardMock,
} = require("./mocks.js");

describe("Snake", () => {
    const initial_pos = new Vector2D(0, 0);
    const velocity = new Vector2D(1, 0);

    it("moves on update", () => {
        const snake = new Snake(initial_pos, velocity);

        expect(snake.position()).toEqual(initial_pos);
        snake.update();
        expect(snake.position()).toEqual(new Vector2D(1, 0));
    });

    it("grows after grow call to grow", () => {
        const snake = new Snake(initial_pos, velocity);
        expect(snake.body).toEqual([new Vector2D(0, 0)]);

        snake.grow();
        snake.update();
        expect(snake.body).toEqual([new Vector2D(1, 0), new Vector2D(0, 0)]);
    });

    it("changes direction", () => {
        const snake = new Snake(initial_pos, velocity);

        snake.change_direction(new Vector2D(0, 1));
        snake.update();
        expect(snake.position()).toEqual(new Vector2D(0, 1));
    });

    it("doesn't go backward", () => {
        const snake = new Snake(initial_pos, velocity);

        snake.change_direction(new Vector2D(-1, 0));
        snake.update();
        expect(snake.position()).toEqual(velocity);
    });

    it("puts itself on a game board", () => {
        const snake = new Snake(initial_pos, velocity);
        snake.grow();
        snake.update();

        const board = new GameBoardMock();
        board.expect_call("set_snake", [new Vector2D(1, 0)]);
        board.expect_call("set_snake", [new Vector2D(0, 0)]);

        snake.put(board);
        board.verify();
    });

    it("checks self collision on move", () => {
        const snake = new Snake(initial_pos, velocity);
        expect(snake.is_dead()).toBe(false);

        snake.grow();
        snake.update();
        snake.grow();
        snake.update();
        snake.velocity = snake.velocity.multiply(-1);
        snake.update();

        expect(snake.is_dead()).toBe(true);
        snake.update();
    });

    it("checks self collision on grow", () => {
        const snake = new Snake(initial_pos, velocity);
        expect(snake.is_dead()).toBe(false);

        snake.grow();
        snake.update();
        snake.grow();
        snake.update();
        snake.velocity = snake.velocity.multiply(-1);
        snake.grow();
        snake.update();

        expect(snake.is_dead()).toBe(true);
        snake.update();
    });

    it("grows and changes direction at the same time", () => {
        const snake = new Snake(initial_pos, velocity);
        snake.grow();
        snake.change_direction(new Vector2D(0, 1));
        snake.update();

        expect(snake.position()).toEqual(new Vector2D(0, 1));
        expect(snake.body.length).toEqual(2);
    });
});
