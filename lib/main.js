const Vector2D = require('./vector2d');
const GameRunner = require('./game_runner');
const GameManager = require('./game_manager');
const CanvasRender = require('./canvas_render');

const canvas = document.getElementById("test-canvas");
const context = canvas.getContext("2d");

const field_size = new Vector2D(20, 20);
const scale = 10;

const renderer = new CanvasRender(context, field_size, scale);
const gm = GameManager.create(field_size, renderer);
const runner = new GameRunner(window, gm, 5);
runner.start();
