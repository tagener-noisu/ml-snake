const Random = require("./random");

class Chromosome {
    fitness(callback) {
        callback(this, this.compute_fitness());
    }
}

class PopulationArrayInitalizer {
    constructor(population) {
        this.population = population;
    }

    get_population() {
        return this.population;
    }
}

class GeneticAlgorithm {
    constructor(initalizer, random_generator, mutation_prob) {
        this.mutation_probability = mutation_prob;
        this.random_generator = random_generator;
        this.chromosomes = initalizer.get_population();
        this.population_size = this.chromosomes.length;
        this.fitnesses = [];

        this.fitness_computed = this.fitness_computed.bind(this);
    }

    static create_by_population(population, random_generator, mutation_prob) {
        if (random_generator == undefined)
            random_generator = new Random();

        if (mutation_prob == undefined)
            mutation_prob = 0.03;

        const init = new PopulationArrayInitalizer(population);
        return new GeneticAlgorithm(init, random_generator, mutation_prob);
    }

    top() {
        const [top, ...rest] = this.fitnesses;

        return top;
    }

    sort_by_fitness() {
        this.fitnesses.sort((x, y) => {
            return y.fitness - x.fitness
        });
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

    random_parents_crossover(num_of_breeders, chromosomes, random_generator) {
        const random_breeder = () =>
            random_generator.generate_int(0, num_of_breeders)

        const one = random_breeder();
        let two = random_breeder();

        while (two === one)
            two = random_breeder();

        const child = chromosomes[one].crossover(chromosomes[two]);

        const prob = random_generator.generate_float(0, 1);
        if (prob < this.mutation_probability)
            child.mutate();

        return child;
    }

    breed() {
        const num_of_breeders = Math.round(this.fitnesses.length / 2);
        this.chromosomes =
            this.fitnesses.slice(0, num_of_breeders).map(x => x.chromosome);

        while (this.chromosomes.length < this.population_size)
            this.chromosomes.push(
                this.random_parents_crossover(
                    num_of_breeders, this.chromosomes, this.random_generator));
    }
}

module.exports = {
    Chromosome,
    GeneticAlgorithm
}
