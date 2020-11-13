const mathjs = require('mathjs');

function relu(vector) {
    return vector.map(x => mathjs.max(x, 0));
}

class NeuralNet {
    constructor(math, dimensions, activation_fn) {
        this.math = math;
        this.activation_fn = activation_fn;

        const [hd, ...tl] = dimensions;

        const {layers, layers_dims} = tl.reduce((acc, current_layer) => {
            const {layers, layers_dims, prev_layer} = acc;
            const weights = math.random([prev_layer, current_layer], -1, 1);
            const biases = math.random([current_layer], -1, 1);

            layers.push({weights, biases});
            layers_dims.push([prev_layer, current_layer]);

            return {layers, layers_dims, prev_layer: current_layer};
        }, {layers: [], layers_dims: [], prev_layer: hd});

        this.layers = layers;
        this.layers_dims = layers_dims;
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

    to_vector() {
        return this.layers.reduce((result, layer, i) => {
            const [width, heigth] = this.layers_dims[i];
            const w_vec = this.math.reshape(layer.weights, [width * heigth]);

            result = result.concat(w_vec);
            return result.concat(layer.biases);
        }, []);
    }
}

module.exports = {
    NeuralNet,
    relu
}
