const {Chromosome, GeneticAlgorithm} = require("../lib/genetic_algorithm");
const Mock = require("./mock");

describe("GenticAlgorithm", () => {
    it("gets inital population from initalizer", () => {
        const initializer = new Mock();
        initializer.expect_call("get_population", [], []);
        const ga = new GeneticAlgorithm(initializer);
    });

    it("computes fitnesses asyncronously", async () => {
        const chromosome = new Mock();
        chromosome.expect_call("fitness", [], Promise.resolve(1337));

        const ga = GeneticAlgorithm.create_by_population([chromosome]);
        const fitnesses = await ga.compute_fitness();

        expect(fitnesses).toEqual([{chromosome: chromosome, fitness: 1337}]);
        chromosome.verify();
    });

    it("sorts chromosomes by fitness", () => {
        const fitnesses = [
            {chromosome: "one", fitness: 10},
            {chromosome: "two", fitness: 20}
        ];

        const result = GeneticAlgorithm.sort_by_fitness(fitnesses);
        expect(result[0].fitness).toEqual(20);
    });

    it("crosses over random chromosomes", () => {
        const fitnesses = [1,2,3,4].map(i => (
            {chromosome: new Mock(), fitness: i}
        ));
        const mocks = fitnesses.map(x => x.chromosome);
        const one = mocks[0];
        const two = mocks[1];
        const random = new Mock();

        random.expect_call("generate_int", [0, 2], 0);
        random.expect_call("generate_int", [0, 2], 1);
        random.expect_call("generate_float", [0, 1], 0.43);
        random.expect_call("generate_int", [0, 2], 1);
        random.expect_call("generate_int", [0, 2], 0);
        random.expect_call("generate_float", [0, 1], 0.78);

        one.expect_call("crossover", [two], new Mock());
        two.expect_call("crossover", [one], new Mock());

        GeneticAlgorithm.breed(fitnesses, random, 0.3);

        random.verify();
        one.verify();
        two.verify();
    });

    it("doesn't cross over the same breeder", () => {
        const one = new Mock();
        const two = new Mock();
        const random = new Mock();

        random.expect_call("generate_int", [0, 2], 0);
        random.expect_call("generate_int", [0, 2], 0);
        random.expect_call("generate_int", [0, 2], 1);
        random.expect_call("generate_float", [0, 1], 0.43);

        one.expect_call("crossover", [two], new Mock());

        GeneticAlgorithm.random_parents_crossover(2, [one, two], random, 0.3);

        random.verify();
        one.verify();
    });

    it("calls mutate()", () => {
        const one = new Mock();
        const two = new Mock();
        const child = new Mock();
        const random = new Mock();

        random.expect_call("generate_int", [0, 2], 0);
        random.expect_call("generate_int", [0, 2], 1);
        random.expect_call("generate_float", [0, 1], 0.19);
        one.expect_call("crossover", [two], child);
        child.expect_call("mutate", []);

        GeneticAlgorithm.random_parents_crossover(2, [one, two], random, 0.3);

        random.verify();
        one.verify();
        child.verify();
    });
});

describe("Chromosome", () => {
    it("calls back after computing fitness", () => {
        class FakeChromosome extends Chromosome {
            compute_fitness() {
                return 1337;
            }
        }

        const chromosome = new FakeChromosome();
        const ga = new Mock();

        ga.expect_call("fitness_computed", [chromosome, 1337]);
        chromosome.fitness(ga.fitness_computed.bind(ga));

        ga.verify();
    });
});
