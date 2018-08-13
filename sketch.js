/*
The engine
*/

// the window where stuff is rendered
let canvas;
let WINDOW_WIDTH = 600
let WINDOW_HEIGHT = 600

let game;
let input;

// p5 function: preload() is called before page starts loading
function preload() {
    input = new Input()
    game = new Game(input);
}

// p5 function: setup() is called on page load
function setup() {
    canvas = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    centerCanvas();
}

function centerCanvas() {
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
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