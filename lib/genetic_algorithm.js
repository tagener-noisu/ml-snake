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
    }

    static create_by_population(population, random_generator, mutation_prob) {
        if (random_generator == undefined)
            random_generator = new Random();

        if (mutation_prob == undefined)
            mutation_prob = 0.03;

        const init = new PopulationArrayInitalizer(population);
        return new GeneticAlgorithm(init, random_generator, mutation_prob);
    }

    static sort_by_fitness(fitnesses) {
        return fitnesses.sort((x, y) => {
            return y.fitness - x.fitness
        });
    }

    static random_parents_crossover(
        num_of_breeders,
        chromosomes,
        random_generator,
        mutation_probability)
    {
        const random_breeder = () =>
            random_generator.generate_int(0, num_of_breeders)

        const one = random_breeder();
        let two = random_breeder();

        while (two === one)
            two = random_breeder();

        const child = chromosomes[one].crossover(chromosomes[two]);

        const prob = random_generator.generate_float(0, 1);
        if (prob < mutation_probability)
            child.mutate();

        return child;
    }

    static breed(fitnesses, random_generator, mutation_probability) {
        const population_size = fitnesses.length;
        const num_of_breeders = Math.round(population_size / 2);
        const chromosomes =
            fitnesses.slice(0, num_of_breeders).map(x => x.chromosome);

        while (chromosomes.length < population_size)
            chromosomes.push(
                GeneticAlgorithm.random_parents_crossover(
                    num_of_breeders,
                    chromosomes,
                    random_generator,
                    mutation_probability));

        return chromosomes;
    }

    async compute_fitness() {
        return Promise.all(this.chromosomes.map(async x => {
            const fitness = await x.fitness();
            return {chromosome: x, fitness};
        }));
    }
}

module.exports = {
    Chromosome,
    GeneticAlgorithm
}
