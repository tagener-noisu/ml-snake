const Snake = require("./snake");

class Vector2D {
    constructor(x, y) {
        this.pos = {x, y};
    }

    x() {
        return this.pos.x;
    }

    y() {
        return this.pos.y;
    }

    plus(other) {
        return new Vector2D(this.pos.x + other.x(), this.pos.y + other.y());
    }

    equals(other) {
        return this.pos.x == other.x() && this.pos.y == other.y();
    }

    multiply(n) {
        return new Vector2D(this.pos.x * n, this.pos.y * n);
    }
}

class Random {
    generate(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}

class Food {
    constructor(rg, field_size) {
        this.random_generator = rg;
        this.field_size = field_size;
        this.change_position_on_update = true;

        this.update();
    }

    static create(game_size) {
        return new Food(new Random(), game_size);
    }

    position() {
        return this.pos;
    }

    random_coordinate() {
        const new_x = this.random_generator.generate(0, this.field_size.x() - 1);
        const new_y = this.random_generator.generate(0, this.field_size.y() - 1);

        return new Vector2D(new_x, new_y);
    }

    change_position() {
        this.change_position_on_update = true;
    }

    update() {
        if (this.change_position_on_update) {
            this.pos = this.random_coordinate();
            this.change_position_on_update = false;
        }
    }

    render(renderer) {
        renderer.fill(this.pos);
    }
}

class GameManager {
    constructor(field_size, snake, food, renderer) {
        this.snake = snake;
        this.food = food;
        this.renderer = renderer;
        this.field_size = field_size;
        this.game_over = false;
        this.tick = this.tick.bind(this);
    }

    static create(field_size, scale, renderer) {
        const initial_pos = new Vector2D(0, 0);
        const initial_vel = new Vector2D(1, 0);
        const snake = new Snake(initial_pos, initial_vel);
        const food = Food.create(field_size);

        const player = new HumanPlayer(window, snake);

        return new GameManager(field_size, snake, food, renderer);
    }

    run(window, interval) {
        window.setInterval(this.tick, interval);
    }

    out_of_bounds(pos) {
        const x = pos.x();
        const y = pos.y();
        const x_bound = this.field_size.x() - 1;
        const y_bound = this.field_size.y() - 1;

        return (x < 0 || x > x_bound || y < 0 || y > y_bound);
    }

    on_game_over() {
    }

    update() {
        if (this.game_over) return;

        if(this.snake.position().equals(this.food.position())) {
            this.food.change_position();
            this.snake.grow();
        }

        this.snake.update();
        this.food.update();
        this.renderer.update();

        if (this.out_of_bounds(this.snake.position())
            || this.snake.ate_itself())
        {
            this.game_over = true;
            this.on_game_over();
        }
    }

    render() {
        this.food.render(this.renderer);
        this.snake.render(this.renderer);
    }

    tick() {
        this.update();
        this.render();
    }
}

class CanvasRender {
    constructor(context, field_size, scale) {
        this.context = context;
        this.width = field_size.x();
        this.height = field_size.y();
        this.scale = scale;
    }

    fill(pos) {
        const x = pos.x() * this.scale;
        const y = pos.y() * this.scale;

        this.context.fillRect(x, y, this.scale, this.scale);
    }

    update() {
        this.context.clearRect(
            0, 0, this.width * this.scale, this.height * this.scale);
    }
}

class HumanPlayer {
    constructor(window, snake) {
        this.snake = snake;
        this.keydown = this.keydown.bind(this);
        window.addEventListener("keydown", this.keydown);
    }

    keydown(e) {
        switch (e.key) {
        case "ArrowDown":
            this.snake.change_direction(new Vector2D(0, 1));
            break;
        case "ArrowUp":
            this.snake.change_direction(new Vector2D(0, -1));
            break;
        case "ArrowRight":
            this.snake.change_direction(new Vector2D(1, 0));
            break;
        case "ArrowLeft":
            this.snake.change_direction(new Vector2D(-1, 0));
            break;
        }
    }
}

if (module == undefined)
    var module = {exports: undefined};

module.exports = {
    HumanPlayer: HumanPlayer,
    GameManager: GameManager,
    CanvasRender: CanvasRender,
    Snake: Snake,
    Food: Food,
    Vector2D: Vector2D
}
