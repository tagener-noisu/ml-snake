const Vector2D = require("../lib/vector2d");
const Snake = require("../lib/snake");
const Food = require("../lib/food");
const GameManager = require("../lib/game_manager");
const CanvasRender = require("../lib/canvas_render");
const Player = require("../lib/player.js");
const HumanPlayer = require("../lib/human_player.js");
const GameBoard = require("../lib/game_board.js");

const {
    SnakeMock,
    FoodMock,
    FakeRandom,
    MockContext,
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

describe("Vector2D", () => {
    it("has x and y coordinates", () => {
        const v = new Vector2D(4, 5);

        expect(v.x()).toBe(4);
        expect(v.y()).toBe(5);
    });

    it("sums two vectors", () => {
        const x = new Vector2D(0, 1);
        const y = new Vector2D(4, 7);

        expect(x.plus(y)).toEqual(new Vector2D(4, 8));
    });

    it("checks equality", () => {
        const x = new Vector2D(0, 5);
        const y = new Vector2D(0, 5);

        expect(x.equals(y)).toBe(true);
    });

    it("multiplies by a number", () => {
        const x = new Vector2D(2, 2);

        expect(x.multiply(3)).toEqual(new Vector2D(6, 6));
    });

    it("turns left", () => {
        const vec = new Vector2D(1, 0);
        const result = vec.turn_left();

        expect(result.equals(new Vector2D(0, -1))).toBe(true);
    });

    it("turns right", () => {
        const vec = new Vector2D(0, -1);
        const result = vec.turn_right();

        expect(result.equals(new Vector2D(1, 0))).toBe(true);
    });
});

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

describe("Food", () => {
    const initial_pos = new Vector2D(4, 4);
    const game_size = new Vector2D(10, 5);

    it("sets it's coordinates randomly", () => {
        const max_x = game_size.x() - 1;
        const max_y = game_size.y() - 1;
        const rg = new FakeRandom();
        rg.expect_call("generate", [0, max_x], initial_pos.x());
        rg.expect_call("generate", [0, max_y], initial_pos.y());

        const food = new Food(rg, game_size);
        expect(food.position()).toEqual(initial_pos);

        rg.verify();
    });

    it("doesn't change it's position on simple update", () => {
        const food = Food.create(game_size);
        const initial_position = food.position();

        food.update();
        expect(food.position()).toEqual(initial_position);
    });

    it("changes it's position randomly", () => {
        const max_x = game_size.x() - 1;
        const max_y = game_size.y() - 1;
        const new_pos = new Vector2D(9, 3);
        const rg = new FakeRandom();
        rg.expect_call("generate", [0, max_x], initial_pos.x());
        rg.expect_call("generate", [0, max_y], initial_pos.y());
        rg.expect_call("generate", [0, max_x], new_pos.x());
        rg.expect_call("generate", [0, max_y], new_pos.y());

        const food = new Food(rg, game_size);
        food.change_position();
        food.update();
        expect(food.position()).toEqual(new_pos);

        rg.verify();
    });

    it("puts itself on a game board", () => {
        const food = Food.create(game_size);
        const pos = food.position();
        const board = new GameBoardMock();
        board.expect_call("set_food", [pos]);

        food.put(board);

        board.verify();
    });
});

describe("CanvasRender", () => {
    const scale = 10;
    const field_size = new Vector2D(10, 10);

    it("clears the context on update", () => {
        const context = new MockContext();
        context.expect_call("clearRect",
                            [0, 0, field_size.x() * scale, field_size.y() * scale]);
        const render = new CanvasRender(context, field_size, scale);
        render.update();

        context.verify();
    });

    it("fills given coordinate", () => {
        const fill_coords = new Vector2D(4, 5);
        const context = new MockContext();
        context.expect_call("fillRect", [40, 50, 10, 10]);
        const render = new CanvasRender(context, field_size, scale);

        render.fill(fill_coords);

        context.verify();
    });

    it("draws a line", () => {
        const line_x = new Vector2D(0, 0);
        const line_y = new Vector2D(1, 0);
        const context = new MockContext();
        const render = new CanvasRender(context, field_size, scale);

        context.expect_call("beginPath", []);
        context.expect_call("moveTo", [5, 5]);
        context.expect_call("lineTo", [15, 5]);
        context.expect_call("stroke", []);
        context.expect_call("closePath", []);

        render.line(line_x, line_y);

        context.verify();
    });
});

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

describe("GameBoard", () => {
    const size = new Vector2D(3, 3);
    const pos = new Vector2D(0, 0);

    it("checks empty cells", () => {
        const board = new GameBoard(size);

        expect(board.cell(pos)).toEqual("empty");
    });

    it('checks "out of bound" cells', () => {
        const board = new GameBoard(size);

        expect(board.cell(new Vector2D(0, 3))).toEqual("out of bound");
        expect(board.cell(new Vector2D(3, 0))).toEqual("out of bound");
        expect(board.cell(new Vector2D(-1, 0))).toEqual("out of bound");
        expect(board.cell(new Vector2D(0, -2))).toEqual("out of bound");
    });

    it("checks food cells", () => {
        const board = new GameBoard(size);
        board.set_food(pos);

        expect(board.cell(new Vector2D(0, 0))).toEqual("food");
    });

    it("checks snake cells", () => {
        const board = new GameBoard(size);
        board.set_snake(pos);

        expect(board.cell(new Vector2D(0, 0))).toEqual("snake");
    });

    it('it doesn\'t "store out of bounds" cells', () => {
        const board = new GameBoard(size);
        const pos = new Vector2D(3, 5);
        board.set_snake(pos);
        board.set_food(pos);

        expect(board.board.filter(x => x !== undefined).length).toBe(0);
    });

    it("clears itself on update", () => {
        const board = new GameBoard(size);
        board.set_snake(new Vector2D(0, 1));
        board.set_food(new Vector2D(2, 1));
        board.update();

        expect(board.board.filter(x => x !== undefined).length).toBe(0);
    });

    it("renders itself", () => {
        const snake_pos = new Vector2D(0, 1);
        const food_pos = new Vector2D(2, 2);
        const board = new GameBoard(size);

        board.set_snake(snake_pos);
        board.set_food(food_pos);

        const renderer = new RenderMock;
        renderer.expect_call("fill", [snake_pos]);
        renderer.expect_call("fill", [food_pos]);

        board.render(renderer);
        renderer.verify();
    });

    it("returns next nonempty cell", () => {
        const board = new GameBoard(size);
        board.set_food(new Vector2D(2, 0));

        const forward = board.next_nonempty_cell(
            new Vector2D(0, 0), new Vector2D(1, 0));
        expect(forward.equals(new Vector2D(2, 0))).toBe(true);
    });
});

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
