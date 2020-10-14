const Snake = require("./snake");
const GameManager = require("./game_manager");
const Vector2D = require("./vector2d");

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

module.exports = {
    HumanPlayer: HumanPlayer,
    GameManager: GameManager,
    CanvasRender: CanvasRender,
    Snake: Snake,
    Food: Food,
    Vector2D: Vector2D
}
