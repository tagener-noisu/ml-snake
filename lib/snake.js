class SnakeState {
    is_dead() {
        return false;
    }

    update() {
        return this;
    }
}

class DeadState extends SnakeState {
    is_dead() {
        return true;
    }
}

class MoveState extends SnakeState {
    update(snake) {
        const new_head = snake.body[0].plus(snake.velocity);
        snake.body.unshift(new_head);
        snake.body.pop();

        if (snake.ate_itself()) {
            return new DeadState();
        }

        return this;
    }
}

class GrowState extends SnakeState {
    update(snake) {
        const new_head = snake.body[0].plus(snake.velocity);
        snake.body.unshift(new_head);

        if (snake.ate_itself()) {
            return new DeadState();
        }

        return new MoveState();
    }
}

class ChangeDirectionState extends MoveState {
    constructor(new_velocity) {
        super();

        this.new_velocity = new_velocity;
    }

    update(snake) {
        if (!snake.velocity.equals(this.new_velocity.multiply(-1)))
            snake.velocity = this.new_velocity;

        return super.update(snake);
    }
}

class Snake {
    constructor(pos, vel) {
        this.body = [pos];
        this.velocity = vel;
        this.state = new MoveState();
    }

    position() {
        return this.body[0];
    }

    change_direction(new_vel) {
        this.state = new ChangeDirectionState(new_vel);
    }

    grow() {
        this.state = new GrowState();
    }

    ate_itself() {
        const head = this.position();

        return this.body.filter(x => x.equals(head)).length > 1;
    }

    update() {
        this.state = this.state.update(this);
    }

    is_dead() {
        return this.state.is_dead();
    }

    put(board) {
        this.body.forEach(coord => {
            board.set_snake(coord);
        });
    }
}

module.exports = Snake
