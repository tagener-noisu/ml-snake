class Mock {
    constructor() {
        this.call_num = 0;
        this.expected_calls = [];
        this.return_values = [];
        this.calls = [];
    }

    expect_call(method, args, return_value = undefined) {
        const call = {};
        call[method] = args;

        this.expected_calls.push(call);
        this.return_values.push(return_value);
    }

    register_call(method, args) {
        const call = {};
        call[method] = [...args];

        this.calls.push(call);

        const result = this.return_values[this.call_num];
        this.call_num = this.call_num + 1;
        return result;
    }

    verify() {
        expect(this.calls).toEqual(this.expected_calls);
    }
}

class SnakeMock extends Mock {
    constructor(head) {
        super();

        this.head = head;
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

    render(renderer) {
        this.register_call("render", arguments);
    }

    change_direction(vel) {
        this.register_call("change_direction", arguments);
    }

    ate_itself() {
        return this.register_call("ate_itself", arguments);
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

    render(renderer) {
        this.register_call("render", arguments);
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
}

class RenderMock extends Mock {
    fill(pos) {
        this.register_call("fill", arguments);
    }

    update() {
        return this.register_call("update", arguments);
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

module.exports = {
    WindowMock: WindowMock,
    RenderMock: RenderMock,
    MockContext: MockContext,
    SnakeMock: SnakeMock,
    FoodMock: FoodMock,
    FakeRandom: FakeRandom
}
