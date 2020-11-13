const mathjs = require('mathjs');

function relu(vector) {
    return vector.map(x => mathjs.max(x, 0));
}

class NeuralNet {
    constructor(layers, layers_dims, activation_fn, math) {
        this.math = math;
        this.activation_fn = activation_fn;
        this.layers = layers;
        this.layers_dims = layers_dims;
    }

    static random(dimensions, activation_fn = relu, math = mathjs) {
        const [hd, ...tl] = dimensions;

        const {layers, layers_dims} = tl.reduce((acc, current_layer) => {
            const {layers, layers_dims, prev_layer} = acc;
            const weights = math.random([prev_layer, current_layer], -1, 1);
            const biases = math.random([current_layer], -1, 1);

            layers.push({weights, biases});
            layers_dims.push([prev_layer, current_layer]);

            return {layers, layers_dims, prev_layer: current_layer};
        }, {layers: [], layers_dims: [], prev_layer: hd});

        return new NeuralNet(layers, layers_dims, activation_fn, math);
    }

    static from_vector(dimensions, vector, activation_fn = relu, math = mathjs) {
        const [hd, ...tl] = dimensions;

        const {layers, layers_dims} = tl.reduce((acc, current_layer) => {
            const {layers, layers_dims, prev_layer, vector} = acc;
            const weigths_len = prev_layer * current_layer;

            const weights = vector.slice(0, weigths_len);
            const biases = vector.slice(weigths_len, weigths_len + current_layer);
            const vec = vector.slice(weigths_len + current_layer);

            layers.push({weights, biases});
            layers_dims.push([prev_layer, current_layer]);

            return {layers, layers_dims, prev_layer: current_layer, vec};
        }, {layers: [], layers_dims: [], prev_layer: hd, vector});

        return new NeuralNet(layers, layers_dims, activation_fn, math);
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
            const [width, height] = this.layers_dims[i];
            const w_vec = this.math.reshape(layer.weights, [width * height]);

            return result.concat(w_vec).concat(layer.biases);
        }, []);
    }
}

module.exports = {
    NeuralNet,
    relu
}
