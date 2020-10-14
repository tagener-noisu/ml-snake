const Random = require("./random");
const Vector2D = require("./vector2d");

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

    put(board) {
        board.set_food(this.pos);
    }
}

module.exports = Food
