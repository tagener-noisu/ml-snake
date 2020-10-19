const Vector2D = require("../lib/vector2d");
const CanvasRender = require("../lib/canvas_render");

const {
    MockContext,
} = require("./mocks.js");

describe("CanvasRender", () => {
    const scale = 10;
    const field_size = new Vector2D(10, 10);

    it("clears the context on update", () => {
        const context = new MockContext();
        context.expect_call("clearRect",
                            [0, 0, field_size.x() * scale, field_size.y() * scale]);
        const render = new CanvasRender(context, field_size, scale);
        render.update();

        context.verify();
    });

    it("fills given coordinate", () => {
        const fill_coords = new Vector2D(4, 5);
        const context = new MockContext();
        context.expect_call("fillRect", [40, 50, 10, 10]);
        const render = new CanvasRender(context, field_size, scale);

        render.fill(fill_coords);

        context.verify();
    });

    it("draws a line", () => {
        const line_x = new Vector2D(0, 0);
        const line_y = new Vector2D(1, 0);
        const context = new MockContext();
        const render = new CanvasRender(context, field_size, scale);

        context.expect_call("beginPath", []);
        context.expect_call("moveTo", [5, 5]);
        context.expect_call("lineTo", [15, 5]);
        context.expect_call("stroke", []);
        context.expect_call("closePath", []);

        render.line(line_x, line_y);

        context.verify();
    });
});
