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
    constructor(pos) {
        super();

        this.pos = pos;
    }

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

class MockRandom extends Mock {
    generate_int(min, max) {
        return this.register_call("generate_int", arguments);
    }

    generate_float(min, max) {
        return this.register_call("generate_float", arguments);
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

    cell(position) {
        return this.register_call("cell", arguments);
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

    mutate() {
        return this.register_call("mutate", arguments);
    }

    crossover(other) {
        return this.register_call("crossover", arguments);
    }
}

class GeneticAlgorithmMock extends Mock {
    fitness_computed(chromosome, fitness) {
        return this.register_call("fitness_computed", arguments);
    }
}

class PopulationMockInitalizer extends Mock {
    get_population() {
        return this.register_call("get_population", arguments);
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

module.exports = {
    WindowMock,
    RenderMock,
    MockContext,
    SnakeMock,
    FoodMock,
    GameBoardMock,
    PlayerMock,
    MockRandom,
    ChromosomeMock,
    GeneticAlgorithmMock,
    MockNeuralNet,
    MockMath,
    PopulationMockInitalizer
}
