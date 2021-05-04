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

        if (this[method] === undefined) {
            this[method] = (function () {
                return this.register_call(method, arguments);
            });
        }
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

module.exports = Mock
