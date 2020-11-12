const mathjs = require('mathjs');

function relu(vector) {
    return vector.map(x => mathjs.max(x, 0));
}

class NeuralNet {
    constructor(math, dimensions, activation_fn) {
        this.math = math;
        this.activation_fn = activation_fn;

        const [hd, ...tl] = dimensions;

        const {layers} = tl.reduce((acc, current_layer) => {
            const {layers, prev_layer} = acc;
            const weights = math.random([prev_layer, current_layer], -1, 1);
            const biases = math.random([current_layer], -1, 1);

            layers.push({weights, biases});
            return {layers, prev_layer: current_layer};
        }, {layers: [], prev_layer: hd});

        this.layers = layers;
    }

    static create(dimensions) {
        return new NeuralNet(mathjs, dimensions, relu);
    }

    run(input) {
        return this.layers.reduce((prev_activations, layer) => {
            const A = this.math.add(
                this.math.multiply(prev_activations, layer.weights),
                layer.biases
            );

            return this.activation_fn(A);
        }, input);
    }
}

module.exports = {
    NeuralNet,
    relu
}
