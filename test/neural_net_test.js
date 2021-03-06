const mathjs = require('mathjs');
const {NeuralNet, relu} = require('../lib/neural_net');
const Mock = require("./mock");

describe("relu", () => {
    it("works", () => {
        expect(relu([])).toEqual([]);
        expect(relu([-1, 0, 1])).toEqual([0, 0, 1]);
    });
});

describe("NeuralNet", () => {
    it("initializes randomly", () => {
        const math = new Mock();
        math.expect_call("random", [[3, 5], -1, 1]);
        math.expect_call("random", [[5], -1, 1]);
        math.expect_call("random", [[5, 5], -1, 1]);
        math.expect_call("random", [[5], -1, 1]);
        math.expect_call("random", [[5, 3], -1, 1]);
        math.expect_call("random", [[3], -1, 1]);

        const nn = NeuralNet.random([3, 5, 5, 3], undefined, math);

        math.verify();
    });

    it("initalizes by vector", () => {
        const weigths = [1, 2, 3, 4, 5, 6];
        const nn = NeuralNet.from_vector([1, 3], weigths);

        const result = nn.to_vector();

        expect(result).toEqual(weigths);
    });

    it("propagates forward", () => {
        const activation_fn = jest.fn();
        activation_fn.mockReturnValueOnce("layer1");
        activation_fn.mockReturnValueOnce("layer2");

        const math = new Mock();
        math.expect_call("random", [[2, 4], -1, 1], "weights1");
        math.expect_call("random", [[4], -1, 1], "biases1");
        math.expect_call("random", [[4, 4], -1, 1], "weights2");
        math.expect_call("random", [[4], -1, 1], "biases2");

        math.expect_call("multiply", ["input", "weights1"], "multiply1");
        math.expect_call("add", ["multiply1", "biases1"], "add1");

        math.expect_call("multiply", ["layer1", "weights2"], "multiply2");
        math.expect_call("add", ["multiply2", "biases2"], "add2");

        const nn = NeuralNet.random([2, 4, 4], activation_fn, math);
        const result = nn.run("input");

        math.verify();
        expect(activation_fn.mock.calls.length).toBe(2);
        expect(activation_fn.mock.calls[0]).toEqual(["add1"]);
        expect(activation_fn.mock.calls[1]).toEqual(["add2"]);

        expect(result).toBe("layer2");
    });

    it("returns vector representation", () => {
        const weigths = [[1, 2], [3, 4]];
        const math = new Mock();
        math.expect_call("random", [[2, 2], -1, 1], weigths);
        math.expect_call("random", [[2], -1, 1], [5, 6]);
        math.expect_call("reshape", [weigths, [4]], [1, 2, 3, 4]);

        const nn = NeuralNet.random([2, 2], undefined, math);
        const vec = nn.to_vector();

        expect(vec).toEqual([1,2,3,4,5,6]);

        math.verify();
    });
});
