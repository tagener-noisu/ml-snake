const {performance} = require('perf_hooks');
const Vector2D = require('../lib/vector2d');
const GameBoard = require('../lib/game_board');

const inital_position = new Vector2D(0, 0);
const velocity = new Vector2D(1, 0);
const board = new GameBoard(new Vector2D(10, 10));

function run(times, fn) {
    const begin = performance.now();

    for (let i = 0; i < times; ++i)
        fn();

    const end = performance.now();
    const interval = (end - begin) / 1000;
    console.log("Time: " + (interval) + " sec.");
}

const one = () =>  board.next_nonempty_cell(inital_position, velocity);

run(100000, one);
run(200000, one);
run(400000, one);
