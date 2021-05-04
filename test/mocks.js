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

class WindowMock extends Mock {
    addEventListener(event, fn) {
        return this.register_call("addEventListener", arguments);
    }

    setInterval(fn, interval) {
        return this.register_call("setInterval", arguments);
    }
}

class PlayerMock extends Mock {
    update() {
        this.register_call("update", arguments);
    }

    render(renderer) {
        this.register_call("render", arguments);
    }
}

class MockNeuralNet extends Mock {
    run() {
        return this.register_call("run", arguments);
    }
}

class MockMath extends Mock {
    random() {
        return this.register_call("random", arguments);
    }

    multiply() {
        return this.register_call("multiply", arguments);
    }

    add() {
        return this.register_call("add", arguments);
    }

    reshape() {
        return this.register_call("reshape", arguments);
    }
}

class GameManagerMock extends Mock {
    run() {
        return this.register_call("run", arguments);
    }
}

module.exports = {
    WindowMock,
    SnakeMock,
    FoodMock,
    PlayerMock,
    MockNeuralNet,
    MockMath,
    GameManagerMock,
}
