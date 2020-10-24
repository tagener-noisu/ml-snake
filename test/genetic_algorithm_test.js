const {Chromosome, GeneticAlgorithm} = require("../lib/genetic_algorithm");
const {ChromosomeMock, GeneticAlgorithmMock, PopulationMockInitalizer} = require("./mocks");

describe("GenticAlgorithm", () => {
    it("gets inital population from initalizer", () => {
        const initializer = new PopulationMockInitalizer();
        initializer.expect_call("get_population", []);
        const ga = new GeneticAlgorithm(initializer);
    });

    it("calls fitness() on first chromosome", () => {
        const chromosome = new ChromosomeMock();
        const ga = GeneticAlgorithm.create_by_population([chromosome]);

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
