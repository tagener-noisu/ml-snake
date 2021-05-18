const GameRunner = require("../lib/game_runner");
const Mock = require("./mock");

describe("GameRunner", () => {
    it("starts loop", async () => {
        const window = new Mock();
        const runner = new GameRunner(window);
        window.expect_call("requestAnimationFrame", [runner.tick]);

        runner.start();

        window.verify();
    });

    it("calls game_manager.tick() on framerate", () => {
        const framerate = 5;
        const frame_ms = 1000 / framerate;
        const gm = new Mock();
        const window = new Mock();
        const runner = new GameRunner(window, gm, framerate);

        gm.expect_call("tick", []);
        window.expect_call("requestAnimationFrame", []);
        window.expect_call("requestAnimationFrame", []);
        window.expect_call("requestAnimationFrame", []);

        runner.start();
        runner.tick(0);
        runner.tick(frame_ms);
        runner.tick(frame_ms + 1);

        expect(window.calls).toEqual([
            "requestAnimationFrame",
            "requestAnimationFrame",
            "requestAnimationFrame",
            "requestAnimationFrame",
        ]);
    });
});
