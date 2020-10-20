const Mock = require("./mock");

class ChromosomeMock extends Mock {
    fitness() {
        return this.register_call("fitness", arguments);
    }
}

class GeneticAlgorithmMock extends Mock {
    fitness_computed(chromosome, fitness) {
        return this.register_call("fitness_computed", arguments);
    }
}

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

describe("GenticAlgorithm", () => {
    it("calls fitness() on first chromosome", () => {
        const chromosome = new ChromosomeMock();
        const ga = new GeneticAlgorithm([chromosome]);

        chromosome.expect_call("fitness", [ga.fitness_computed]);
        ga.compute_fitness();

        chromosome.verify();
    });
});

describe("Chromosome", () => {
    it("calls back after computing fitness", () => {
        const chromosome = new Chromosome();
        chromosome.compute_fitness = () => 1337;
        const ga = new GeneticAlgorithmMock();

        ga.expect_call("fitness_computed", [chromosome, 1337]);
        chromosome.fitness(ga.fitness_computed.bind(ga));

        ga.verify();
    });
});
