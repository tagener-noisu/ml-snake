const {Chromosome, GeneticAlgorithm} = require("../lib/genetic_algorithm");
const {
    FakeRandom,
    ChromosomeMock,
    ChromosomeFake,
    GeneticAlgorithmMock,
    PopulationMockInitalizer} = require("./mocks");

describe("GenticAlgorithm", () => {
    it("gets inital population from initalizer", () => {
        const initializer = new PopulationMockInitalizer();
        initializer.expect_call("get_population", [], []);
        const ga = new GeneticAlgorithm(initializer);
    });

    it("doesn't do anything if no chromosomes left", () => {
        const ga = GeneticAlgorithm.create_by_population([]);

        expect(() => ga.compute_fitness()).not.toThrow();
    });

    it("calls fitness() on first chromosome", () => {
        const chromosome = new ChromosomeMock();
        const ga = GeneticAlgorithm.create_by_population([chromosome]);

        chromosome.expect_call("fitness", [ga.fitness_computed]);
        ga.compute_fitness();
        ga.fitness_computed(chromosome, 1337);

        chromosome.verify();
    });

    it("calls fitness() on next chromosome on callback", () => {
        const chromosome = new ChromosomeMock();
        const ga = GeneticAlgorithm.create_by_population([chromosome]);

        chromosome.expect_call("fitness", [ga.fitness_computed]);
        ga.fitness_computed();

        chromosome.verify();
    });

    it("sorts chromosomes by fitness", () => {
        const one = new ChromosomeFake(10);
        const two = new ChromosomeFake(20);
        const ga = GeneticAlgorithm.create_by_population([one, two]);
        ga.compute_fitness();

        const result = ga.top();
        expect(result.chromosome).toEqual(one);

        ga.sort_by_fitness();
        const result2 = ga.top();
        expect(result2.chromosome).toEqual(two);
    });

    it("crosses over random chromosomes", () => {
        const fitnesses = [1,2,3,4].map(i => (
            {chromosome: new ChromosomeMock(), fitness: i}
        ));
        const mocks = fitnesses.map(x => x.chromosome);
        const one = mocks[0];
        const two = mocks[1];
        const three = mocks[2];
        const random = new FakeRandom();

        random.expect_call("generate", [0, 2], 0);
        random.expect_call("generate", [0, 2], 1);
        random.expect_call("generate", [0, 2], 1);
        random.expect_call("generate", [0, 2], 0);

        one.expect_call("crossover", [two], new ChromosomeMock());
        two.expect_call("crossover", [one], new ChromosomeMock());

        const ga = GeneticAlgorithm.create_by_population([], random);
        ga.fitnesses = fitnesses;
        ga.population_size = 4;
        ga.breed();

        random.verify();
        one.verify();
        two.verify();
        three.verify();
    });

    it("doesn't cross over the same breeder", () => {
        const one = new ChromosomeMock();
        const two = new ChromosomeMock();
        const random = new FakeRandom();
        const ga = GeneticAlgorithm.create_by_population([], random);

        random.expect_call("generate", [0, 2], 0);
        random.expect_call("generate", [0, 2], 0);
        random.expect_call("generate", [0, 2], 1);

        one.expect_call("crossover", [two], new ChromosomeMock());

        ga.random_parents_crossover(2, [one, two], random);

        random.verify();
        one.verify();
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
