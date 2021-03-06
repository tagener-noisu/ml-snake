const Random = require("./random");
const Vector2D = require("./vector2d");

class FoodState {
    update(food) {
        return this;
    }
}

class IdleState extends FoodState {}

class ChangePositionState extends FoodState {
    constructor(rg, field_size) {
        super();

        this.field_size = field_size;
        this.random_generator = rg;
    }

    random_coordinate() {
        const rand = (from, to) => this.random_generator.generate_int(from, to);
        const new_x = rand(0, this.field_size.x() - 1);
        const new_y = rand(0, this.field_size.y() - 1);

        return new Vector2D(new_x, new_y);
    }

    update(food) {
        food.set_position(this.random_coordinate());
        return new IdleState();
    }
}

class Food {
    constructor(rg, field_size) {
        this.random_generator = rg;
        this.field_size = field_size;
        this.state = new ChangePositionState(rg, field_size);

        this.update();
    }

    static create(game_size) {
        return new Food(new Random(), game_size);
    }

    position() {
        return this.pos;
    }

    set_position(pos) {
        this.pos = pos;
    }

    change_position() {
        this.state = new ChangePositionState(
            this.random_generator, this.field_size);
    }

    update() {
        this.state = this.state.update(this);
    }

    put(board) {
        board.set_food(this.pos);
    }
}

module.exports = Food
