const Vector2D = require("./vector2d");
const HumanPlayer = require("./human_player");
const Snake = require("./snake");
const Food = require("./food");

class GameManagerState {
    is_game_over() {
        return false;
    }

    update(gm) {
        return this;
    }

    render(gm) {
    }
}

class GameOverState extends GameManagerState {
    is_game_over() {
        return true;
    }
}

class GameState extends GameManagerState {
    update(gm) {
        if(gm.snake.position().equals(gm.food.position())) {
            gm.food.change_position();
            gm.snake.grow();
        }

        gm.snake.update();
        gm.food.update();
        gm.renderer.update();

        if (gm.out_of_bounds(gm.snake.position())
            || gm.snake.is_dead())
        {
            return new GameOverState();
        }

        return this;
    }

    render(gm) {
        gm.food.render(gm.renderer);
        gm.snake.render(gm.renderer);
    }
}

class GameManager {
    constructor(field_size, snake, food, renderer) {
        this.snake = snake;
        this.food = food;
        this.renderer = renderer;
        this.field_size = field_size;
        this.tick = this.tick.bind(this);
        this.state = new GameState();
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

    is_game_over() {
        return this.state.is_game_over();
    }

    game_over() {
        this.state = new GameOverState();
    }

    out_of_bounds(pos) {
        const x = pos.x();
        const y = pos.y();
        const x_bound = this.field_size.x() - 1;
        const y_bound = this.field_size.y() - 1;

        return (x < 0 || x > x_bound || y < 0 || y > y_bound);
    }

    update() {
        this.state = this.state.update(this);
    }

    render() {
        this.state.render(this);
    }

    tick() {
        this.update();
        this.render();
    }
}

module.exports = GameManager
