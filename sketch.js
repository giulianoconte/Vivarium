// Provides intellisense data for Visual Studio Code: https://github.com/processing/p5.js/issues/1339#issuecomment-354351574
/// <reference path="./p5_intellisense/p5.d.ts" />
/// <reference path="./p5_intellisense/p5.global-mode.d.ts" />

/*
The engine
*/

// the window where stuff is rendered
let canvas;
const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 800;
const WINDOW_CENTER_X = WINDOW_WIDTH / 2;
const WINDOW_CENTER_Y = WINDOW_HEIGHT / 2;

let game;
let input;

// p5 function: preload() is called before page starts loading
function preload() {
  input = new Input();
  const renderer = new Renderer();
  game = new Game(input, renderer);
  game.initialize();
}

// p5 function: setup() is called on page load
function setup() {
  frameRate(60);
  canvas = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
  centerCanvas();
}

function centerCanvas() {
  const x = (windowWidth - width) / 2;
  const y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}

// p5 function: draw() called on each tick
function draw() {
  background(25);
  fill(0);

  // Game loop
  game.getInput();
  game.update();
  game.render();
}

function mousePressed() {
  input.mousePress();
}

function mouseReleased() {
  input.mouseRelease();
}
