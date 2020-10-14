class Random {
    generate(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}

module.exports = Random
