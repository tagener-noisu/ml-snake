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
        const snake_position = gm.snake.position();
        if(snake_position.equals(gm.food.position())) {
            gm.scorepoints = gm.scorepoints + 1;
            gm.food.change_position();
            gm.snake.grow();
        }

        gm.game_board.update();
        gm.snake.update();
        gm.food.update();
        gm.player.update();
        gm.renderer.update();

        if (gm.game_board.out_of_bounds(snake_position)
            || gm.snake.is_dead())
        {
            return new GameOverState();
        }

        return this;
    }
}

class GameManager {
    constructor(snake, food, game_board, renderer, player) {
        this.snake = snake;
        this.food = food;
        this.renderer = renderer;
        this.game_board = game_board;
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

        return new GameManager(snake, food, game_board, renderer, player);
    }

    score() {
        return this.scorepoints;
    }

    is_game_over() {
        return this.state.is_game_over();
    }

    game_over() {
        this.state = new GameOverState();
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
