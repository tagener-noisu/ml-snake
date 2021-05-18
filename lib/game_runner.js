class StoppedState {
    tick() {
        return this;
    }
}

class RunningState {
    constructor(game_manager, timestamp, framerate) {
        this.game_manager = game_manager;
        this.last_timestamp = timestamp;
        this.frame_ms = 1000 / framerate;
        this.tick = this.tick.bind(this);
    }

    tick(timestamp) {
        if (timestamp - this.last_timestamp > this.frame_ms) {
            this.last_timestamp = timestamp;
            this.game_manager.tick();
        }

        return this;
    }
}

class FirstTickState {
    constructor(game_manager, framerate) {
        this.game_manager = game_manager;
        this.framerate = framerate;
        this.tick = this.tick.bind(this);
    }

    tick(timestamp) {
        return new RunningState(this.game_manager, timestamp, this.framerate);
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
        this.state = new FirstTickState(this.game_manager, this.framerate);
        this.window.requestAnimationFrame(this.tick);
    }

    tick(timestamp) {
        this.state = this.state.tick(timestamp);
        this.window.requestAnimationFrame(this.tick);
    }
}

module.exports = GameRunner;
