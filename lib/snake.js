class Snake {
    constructor(pos, vel) {
        this.body = [pos];
        this.velocity = vel;
        this.grow_on_update = false;
    }

    position() {
        return this.body[0];
    }

    change_direction(new_vel) {
        if (!this.velocity.equals(new_vel.multiply(-1)))
            this.velocity = new_vel;
    }

    grow() {
        this.grow_on_update = true;
    }

    ate_itself() {
        const head = this.position();

        return this.body.filter(x => x.equals(head)).length > 1;
    }

    update() {
        const new_head = this.body[0].plus(this.velocity);
        this.body.unshift(new_head);

        if (this.grow_on_update)
            this.grow_on_update = false;
        else
            this.body.pop();
    }

    render(renderer) {
        this.body.forEach(coord => {
            renderer.fill(coord);
        });
    }
}


module.exports = Snake
