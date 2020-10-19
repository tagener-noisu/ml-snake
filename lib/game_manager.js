const Vector2D = require("./vector2d");
const HumanPlayer = require("./human_player");
const Snake = require("./snake");
const Food = require("./food");
const GameBoard = require("./game_board");

class GameManagerState {
    is_game_over() {
        return false;
    }

    update(gm) {
        return this;
    }

    render(gm) {
        gm.food.put(gm.game_board);
        gm.snake.put(gm.game_board);
        gm.game_board.render(gm.renderer);
        gm.player.render(gm.renderer);
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
            gm.scorepoints = gm.scorepoints + 1;
            gm.food.change_position();
            gm.snake.grow();
        }

        gm.game_board.update();
        gm.snake.update();
        gm.food.update();
        gm.player.update();
        gm.renderer.update();

        if (gm.out_of_bounds(gm.snake.position())
            || gm.snake.is_dead())
        {
            return new GameOverState();
        }

        return this;
    }
}

class GameManager {
    constructor(field_size, snake, food, game_board, renderer, player) {
        this.snake = snake;
        this.food = food;
        this.renderer = renderer;
        this.game_board = game_board;
        this.field_size = field_size;
        this.tick = this.tick.bind(this);
        this.state = new GameState();
        this.player = player;
        this.scorepoints = 0;
    }

    static create(field_size, renderer) {
        const initial_pos = new Vector2D(0, 0);
        const initial_vel = new Vector2D(1, 0);
        const snake = new Snake(initial_pos, initial_vel);
        const food = Food.create(field_size);
        const game_board = new GameBoard(field_size);

        const player = new HumanPlayer(window, snake, game_board);

        return new GameManager(field_size, snake, food, game_board, renderer, player);
    }

    score() {
        return this.scorepoints;
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
