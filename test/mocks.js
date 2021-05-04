const Mock = require("./mock");

class SnakeMock extends Mock {
    position() {
        return this.register_call("position", arguments);
    }

    velocity() {
        return this.register_call("velocity", arguments);
    }

    grow() {
        this.register_call("grow", arguments);
    }

    update() {
        this.register_call("update", arguments);
    }

    put(board) {
        this.register_call("put", arguments);
    }

    change_direction(vel) {
        this.register_call("change_direction", arguments);
    }

    is_dead() {
        return this.register_call("is_dead", arguments);
    }
}

class FoodMock extends Mock {
    position() {
        return this.register_call("position", arguments);
    }

    change_position() {
        this.register_call("change_position", arguments);
    }

    update() {
        this.register_call("update", arguments);
    }

    put(board) {
        this.register_call("put", arguments);
    }
}

module.exports = {
    SnakeMock,
    FoodMock,
}
