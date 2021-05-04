const Vector2D = require("../lib/vector2d");
const Food = require("../lib/food");
const Mock = require("./mock");

describe("Food", () => {
    const initial_pos = new Vector2D(4, 4);
    const game_size = new Vector2D(10, 5);

    it("sets it's coordinates randomly", () => {
        const max_x = game_size.x() - 1;
        const max_y = game_size.y() - 1;
        const rg = new Mock();
        rg.expect_call("generate_int", [0, max_x], initial_pos.x());
        rg.expect_call("generate_int", [0, max_y], initial_pos.y());

        const food = new Food(rg, game_size);
        expect(food.position()).toEqual(initial_pos);

        rg.verify();
    });

    it("doesn't change it's position on simple update", () => {
        const food = Food.create(game_size);
        const initial_position = food.position();

        food.update();
        expect(food.position()).toEqual(initial_position);
    });

    it("changes it's position randomly", () => {
        const max_x = game_size.x() - 1;
        const max_y = game_size.y() - 1;
        const new_pos = new Vector2D(9, 3);
        const rg = new Mock();
        rg.expect_call("generate_int", [0, max_x], initial_pos.x());
        rg.expect_call("generate_int", [0, max_y], initial_pos.y());
        rg.expect_call("generate_int", [0, max_x], new_pos.x());
        rg.expect_call("generate_int", [0, max_y], new_pos.y());

        const food = new Food(rg, game_size);
        food.change_position();
        food.update();
        expect(food.position()).toEqual(new_pos);

        rg.verify();
    });

    it("puts itself on a game board", () => {
        const food = Food.create(game_size);
        const pos = food.position();
        const board = new Mock();
        board.expect_call("set_food", [pos]);

        food.put(board);

        board.verify();
    });
});
