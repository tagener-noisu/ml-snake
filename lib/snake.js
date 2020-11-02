class SnakeState {
    is_dead() {
        return false;
    }

    update() {
        return this;
    }

    change_direction(snake, new_vel) {
        if (!snake.vel.equals(new_vel.multiply(-1)))
            snake.set_velocity(new_vel);
    }
}

class DeadState extends SnakeState {
    is_dead() {
        return true;
    }
}

class MoveState extends SnakeState {
    update(snake) {
        const new_head = snake.body[0].plus(snake.vel);
        snake.body.unshift(new_head);
        snake.body.pop();

        if (snake.ate_itself())
            return new DeadState();

        return this;
    }
}

class GrowState extends SnakeState {
    update(snake) {
        const new_head = snake.body[0].plus(snake.vel);
        snake.body.unshift(new_head);

        if (snake.ate_itself())
            return new DeadState();

        return new MoveState();
    }
}

class Snake {
    constructor(pos, vel) {
        this.body = [pos];
        this.vel = vel;
        this.state = new MoveState();
    }

    position() {
        return this.body[0];
    }

    velocity() {
        return this.vel;
    }

    set_velocity(new_velocity) {
        this.vel = new_velocity;
    }

    change_direction(new_vel) {
        this.state.change_direction(this, new_vel);
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
