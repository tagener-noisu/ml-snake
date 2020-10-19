const Vector2D = require("../lib/vector2d");

describe("Vector2D", () => {
    it("has x and y coordinates", () => {
        const v = new Vector2D(4, 5);

        expect(v.x()).toBe(4);
        expect(v.y()).toBe(5);
    });

    it("sums two vectors", () => {
        const x = new Vector2D(0, 1);
        const y = new Vector2D(4, 7);

        expect(x.plus(y)).toEqual(new Vector2D(4, 8));
    });

    it("checks equality", () => {
        const x = new Vector2D(0, 5);
        const y = new Vector2D(0, 5);

        expect(x.equals(y)).toBe(true);
    });

    it("multiplies by a number", () => {
        const x = new Vector2D(2, 2);

        expect(x.multiply(3)).toEqual(new Vector2D(6, 6));
    });

    it("turns left", () => {
        const vec = new Vector2D(1, 0);
        const result = vec.turn_left();

        expect(result.equals(new Vector2D(0, -1))).toBe(true);
    });

    it("turns right", () => {
        const vec = new Vector2D(0, -1);
        const result = vec.turn_right();

        expect(result.equals(new Vector2D(1, 0))).toBe(true);
    });
});