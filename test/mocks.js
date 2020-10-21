const Mock = require("./mock");

class SnakeMock extends Mock {
    constructor(head, velocity) {
        super();

        this.head = head;
        this.velocity = velocity;
    }

    position() {
        return this.head;
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
    constructor(pos) {
        super();

        this.pos = pos;
    }

    position() {
        return this.pos;
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

class FakeRandom extends Mock {
    generate(min, max) {
        return this.register_call("generate", arguments);
    }
}

class MockContext extends Mock {
    clearRect(x, y, w, h) {
        return this.register_call("clearRect", arguments);
    }

    fillRect(x, y, w, h) {
        return this.register_call("fillRect", arguments);
    }

    beginPath() {
        return this.register_call("beginPath", arguments);
    }

    closePath() {
        return this.register_call("closePath", arguments);
    }

    moveTo(x, y) {
        return this.register_call("moveTo", arguments);
    }

    lineTo(x, y) {
        return this.register_call("lineTo", arguments);
    }

    stroke() {
        return this.register_call("stroke", arguments);
    }
}

class RenderMock extends Mock {
    fill(pos) {
        this.register_call("fill", arguments);
    }

    update() {
        return this.register_call("update", arguments);
    }

    line(from, to) {
        return this.register_call("line", arguments);
    }
}

class GameBoardMock extends Mock {
    set_snake(pos) {
        this.register_call("set_snake", arguments);
    }

    render(renderer) {
        this.register_call("render", arguments);
    }

    update() {
        this.register_call("update", arguments);
    }

    set_food(pos) {
        this.register_call("set_food", arguments);
    }

    next_nonempty_cell(position, velocity) {
        return this.register_call("next_nonempty_cell", arguments);
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

class ChromosomeMock extends Mock {
    fitness() {
        return this.register_call("fitness", arguments);
    }
}

class GeneticAlgorithmMock extends Mock {
    fitness_computed(chromosome, fitness) {
        return this.register_call("fitness_computed", arguments);
    }
}

module.exports = {
    WindowMock,
    RenderMock,
    MockContext,
    SnakeMock,
    FoodMock,
    GameBoardMock,
    PlayerMock,
    FakeRandom,
    ChromosomeMock,
    GeneticAlgorithmMock
}
