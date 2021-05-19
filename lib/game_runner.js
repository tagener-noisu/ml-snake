class StoppedState {
    tick() {
        return this;
    }
}

class RunningState {
    constructor(game_runner, timestamp) {
        this.game_runner = game_runner;
        this.window = game_runner.window;
        this.last_timestamp = timestamp;
        this.frame_ms = 1000 / game_runner.framerate;
    }

    tick(timestamp) {
        if (timestamp - this.last_timestamp > this.frame_ms) {
            this.last_timestamp = timestamp;
            this.game_runner.game_manager.tick();
        }

        this.window.requestAnimationFrame(this.game_runner.tick);
        return this;
    }
}

class FirstTickState {
    constructor(game_runner) {
        this.game_runner = game_runner;
    }

    tick(timestamp) {
        this.game_runner.window.requestAnimationFrame(this.game_runner.tick);
        return new RunningState(this.game_runner, timestamp);
    }
}

class GameRunner {
    constructor(window, game_manager, framerate) {
        this.window = window;
        this.game_manager = game_manager;
        this.state = new StoppedState();
        this.framerate = framerate;
        this.tick = this.tick.bind(this);
    }

    start() {
        this.state = new FirstTickState(this);
        this.window.requestAnimationFrame(this.tick);
    }

    tick(timestamp) {
        this.state = this.state.tick(timestamp);
    }
}

module.exports = GameRunner;
