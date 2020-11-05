class Random {
    generate_int(min, max) {
        return Math.round(this.generate_float(min, max));
    }

    generate_float(min, max) {
        return Math.random() * (max - min) + min;
    }
}

module.exports = Random
