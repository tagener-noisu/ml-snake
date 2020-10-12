const {
    GameManager,
    Snake,
    Food,
    Vector2D,
    CanvasRender,
    HumanPlayer
} = require("../lib/game.js");

const {
    SnakeMock,
    FoodMock,
    FakeRandom,
    MockContext,
    RenderMock,
    WindowMock
} = require("./mocks.js");

describe("GameManager", () => {
    const field_size = new Vector2D(10, 10);

    it("updates snake, food and render", () => {
        const snake = new SnakeMock(new Vector2D(0, 0));
        const food = new FoodMock(new Vector2D(3, 7));
        const render = new RenderMock();
        const cm = new GameManager(field_size, snake, food, render);

        snake.expect_call("update", []);
        snake.expect_call("ate_itself", [], false);
        food.expect_call("update", []);
        render.expect_call("update", []);
        cm.update();

        snake.verify();
        food.verify();
        render.verify();
    });

    it("stops updating it's objects on game over", () => {
        const snake = new SnakeMock(new Vector2D(0, 0));
        const food = new FoodMock(new Vector2D(3, 7));
        const render = new RenderMock();
        const cm = new GameManager(field_size, snake, food, render);

        cm.game_over = true;
        cm.update();

        snake.verify();
        food.verify();
        render.verify();
    });

    it("calls snake.grow() and food.change_position() when snake eats food", () => {
        const snake = new SnakeMock(new Vector2D(4, 7));
        const food = new FoodMock(new Vector2D(4, 7));
        const render = new RenderMock();
        const cm = new GameManager(field_size, snake, food, render);

        snake.expect_call("grow", []);
        snake.expect_call("update", []);
        snake.expect_call("ate_itself", [], false);
        food.expect_call("change_position", []);
        food.expect_call("update", []);
        cm.update();

        snake.verify();
        food.verify();
    });

    it("checks bounds", () => {
        const cm = new GameManager(field_size);

        expect(cm.out_of_bounds(new Vector2D(0, 0))).toBe(false);
        expect(cm.out_of_bounds(new Vector2D(9, 9))).toBe(false);

        expect(cm.out_of_bounds(new Vector2D(-1, 0))).toBe(true);
        expect(cm.out_of_bounds(new Vector2D(10, 0))).toBe(true);
        expect(cm.out_of_bounds(new Vector2D(0, -1))).toBe(true);
        expect(cm.out_of_bounds(new Vector2D(0, 10))).toBe(true);
    });

    it("check bounds on update", () => {
        const coords = new Vector2D(11, 0);
        const snake = new SnakeMock(coords);
        const food = new FoodMock(coords);
        const render = new RenderMock();
        const cm = new GameManager(field_size, snake, food, render);

        let game_over = false;
        cm.on_game_over = () => { game_over = true; };
        cm.update();
        expect(cm.game_over).toBe(true);
        expect(game_over).toBe(true);
    });

    it("finishes the game when snake eats itself", () => {
        const snake = new SnakeMock(new Vector2D(0, 0));
        const food = new FoodMock(new Vector2D(4, 4));
        const render = new RenderMock();

        snake.expect_call("update", []);
        snake.expect_call("ate_itself", [], true);

        const cm = new GameManager(field_size, snake, food, render);
        cm.update();

        snake.verify();
        expect(cm.game_over).toBe(true);
    });

    it("renders snake and food", () => {
        const coords = new Vector2D(0, 0);
        const snake = new SnakeMock(coords);
        const food = new FoodMock(coords);
        const render = new RenderMock();
        const cm = new GameManager(field_size, snake, food, render);

        snake.expect_call("render", [render]);
        food.expect_call("render", [render]);
        cm.render();

        snake.verify();
        food.verify();
    });

    it("runs itself with interval", () => {
        const interval = 200;
        const window = new WindowMock();
        const cm = new GameManager(field_size);

        window.expect_call("setInterval", [cm.tick, interval]);
        cm.run(window, interval);

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

    it("renders itself", () => {
        const snake = new Snake(initial_pos, velocity);
        snake.grow();
        snake.update();

        const render = new RenderMock();
        render.expect_call("fill", [new Vector2D(1, 0)]);
        render.expect_call("fill", [new Vector2D(0, 0)]);

        snake.render(render);
        render.verify();
    });

    it("checks self collision", () => {
        const snake = new Snake(initial_pos);
        snake.body.push(initial_pos);

        expect(snake.ate_itself()).toBe(true);
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

    it("renders itself", () => {
        const food = Food.create(game_size);
        const pos = food.position();
        const render = new RenderMock();
        render.expect_call("fill", [pos]);

        food.render(render);

        render.verify();
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

describe("AIPlayer", () => {
});
