const Vector2D = require("../lib/vector2d");
const GameBoard = require("../lib/game_board");

const {
    RenderMock
} = require("./mocks.js");

describe("GameBoard", () => {
    const size = new Vector2D(3, 3);
    const pos = new Vector2D(0, 0);

    it("has cell type enum", () => {
        expect(GameBoard.CellType.OutOfBounds).toBe(0);
        expect(GameBoard.CellType.Empty).toBe(1);
        expect(GameBoard.CellType.Snake).toBe(2);
        expect(GameBoard.CellType.Food).toBe(3);
    });

    it("checks empty cells", () => {
        const board = new GameBoard(size);

        expect(board.cell(pos)).toEqual(GameBoard.CellType.Empty);
    });

    it('checks "out of bound" cells', () => {
        const board = new GameBoard(size);

        expect(board.cell(new Vector2D(0, 3))).toEqual(GameBoard.CellType.OutOfBounds);
        expect(board.cell(new Vector2D(3, 0))).toEqual(GameBoard.CellType.OutOfBounds);
        expect(board.cell(new Vector2D(-1, 0))).toEqual(GameBoard.CellType.OutOfBounds);
        expect(board.cell(new Vector2D(0, -2))).toEqual(GameBoard.CellType.OutOfBounds);
    });

    it("checks food cells", () => {
        const board = new GameBoard(size);
        board.set_food(pos);

        expect(board.cell(new Vector2D(0, 0))).toEqual(GameBoard.CellType.Food);
    });

    it("checks snake cells", () => {
        const board = new GameBoard(size);
        board.set_snake(pos);

        expect(board.cell(new Vector2D(0, 0))).toEqual(GameBoard.CellType.Snake);
    });

    it('it doesn\'t "store out of bounds" cells', () => {
        const board = new GameBoard(size);
        const pos = new Vector2D(3, 5);
        board.set_snake(pos);
        board.set_food(pos);

        expect(board.board.filter(x => x !== undefined).length).toBe(0);
    });

    it("clears itself on update", () => {
        const board = new GameBoard(size);
        board.set_snake(new Vector2D(0, 1));
        board.set_food(new Vector2D(2, 1));
        board.update();

        expect(board.board.filter(x => x !== undefined).length).toBe(0);
    });

    it("renders itself", () => {
        const snake_pos = new Vector2D(0, 1);
        const food_pos = new Vector2D(2, 2);
        const board = new GameBoard(size);

        board.set_snake(snake_pos);
        board.set_food(food_pos);

        const renderer = new RenderMock;
        renderer.expect_call("fill", [snake_pos]);
        renderer.expect_call("fill", [food_pos]);

        board.render(renderer);
        renderer.verify();
    });

    it("returns next nonempty cell", () => {
        const board = new GameBoard(size);
        board.set_food(new Vector2D(2, 0));

        const forward = board.next_nonempty_cell(
            new Vector2D(0, 0), new Vector2D(1, 0));
        expect(forward.equals(new Vector2D(2, 0))).toBe(true);
    });
});
