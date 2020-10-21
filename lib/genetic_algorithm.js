class Chromosome {
    compute_fitness() {
        return undefined;
    }

    fitness(callback) {
        callback(this, this.compute_fitness());
    }
}

class GeneticAlgorithm {
    constructor(chromosomes) {
        this.chromosomes = chromosomes;
        this.fitnesses = [];

        this.fitness_computed = this.fitness_computed.bind(this);
    }

    fitness_computed(chromosome, fitness) {
        this.fitnesses.push({chromosome, fitness});

        if (this.chromosomes.length !== 0)
            this.compute_fitness();
        else
            this.compute_fitness_done();
    }

    compute_fitness_done() {
    }

    compute_fitness() {
        const [hd, ...tl] = this.chromosomes;

        if (hd !== undefined) {
            this.chromosomes = tl;
            hd.fitness(this.fitness_computed);
        }
    }
}

module.exports = {
    Chromosome,
    GeneticAlgorithm
}
