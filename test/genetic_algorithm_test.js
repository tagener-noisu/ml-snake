const {Chromosome, GeneticAlgorithm} = require("../lib/genetic_algorithm");
const {ChromosomeMock, GeneticAlgorithmMock} = require("./mocks");

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
