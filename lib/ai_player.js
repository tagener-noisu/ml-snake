const Player = require("./player");

class AIPlayer extends Player {
    constructor(snake, game_board, neural_net, turn_threshold) {
        super(snake, game_board);

        this.neural_net = neural_net;
        this.turn_threshold = turn_threshold;
    }

    static create(snake, game_board, turn_threshold = 0.8) {
        const dimensions = [6, 10, 5, 3];
        const nn = NeuralNet.create(dimensions);

        return new AIPlayer(snake, game_board, nn, turn_threshold);
    }

    next_nonempty(position, velocity) {
        const next = this.game_board.next_nonempty_cell(
            position, velocity);

        const distance = position.distance(next);
        const type = this.game_board.cell(next);

        return {distance, type};
    }

    evaluate(position, velocity, nn_output) {
        const [dont_turn_prob, turn_left_prob, turn_right_prob] = nn_output;

        if (turn_left_prob > dont_turn_prob
            && turn_left_prob > turn_right_prob
            && turn_left_prob > this.turn_threshold)
        {
            this.snake.change_direction(velocity.turn_left());
        }
        else if (turn_right_prob > dont_turn_prob
            && turn_right_prob > turn_left_prob
            && turn_right_prob > this.turn_threshold)
        {
            this.snake.change_direction(velocity.turn_right());
        }
    }

    update() {
        const position = this.snake.position();
        const velocity = this.snake.velocity();

        const next_forward = this.next_nonempty(position, velocity);
        const next_left = this.next_nonempty(position, velocity.turn_left());
        const next_right = this.next_nonempty(position, velocity.turn_right());

        const output = this.neural_net.run(
            next_forward.distance, next_forward.type,
            next_left.distance, next_left.type,
            next_right.distance, next_right.type
        );

        this.evaluate(position, velocity, output);
    }
}

module.exports = AIPlayer;
