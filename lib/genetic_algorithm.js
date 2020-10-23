class Chromosome {
    compute_fitness() {
        return undefined;
    }

    fitness(callback) {
        callback(this, this.compute_fitness());
    }
}

class PopulationInitializer {
    get_population() {
        return [];
    }
}

class PopulationArrayInitalizer extends PopulationInitializer {
    constructor(population) {
        super();
        this.population = population;
    }

    get_population() {
        return this.population;
    }
}

class GeneticAlgorithm {
    constructor(initalizer) {
        this.chromosomes = initalizer.get_population();
        this.fitnesses = [];

        this.fitness_computed = this.fitness_computed.bind(this);
    }

    static create_by_population(population) {
        const init = new PopulationArrayInitalizer(population);
        return new GeneticAlgorithm(init);
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
