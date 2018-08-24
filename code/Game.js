/*
Game
*/

class Game {
    constructor(input, renderer) {
        this.input = input;
        this.renderer = renderer;

        this.entities = [];
    }

    initialize() {
        // for (let i = 0; i < 50; i++) {
        //     this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        // }
        this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        // this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        // this.entities[0].velocity = p5.Vector.sub(this.entities[0].position, createVector(0, 0));
        // Renderer.drawLine(this.entities[0].position, p5.Vector.add(this.entities[0].position, this.entities[0].velocity), createVector(100, 100, 100), 255);
        this.entities[1].navigator.addPursue('pursue', 1, this.entities[0], 20);
        this.entities[1].drawing.color = createVector(255, 0, 0);
        // this.entities[2].navigator.addEvade('evade', 1, this.entities[0], 20);
        // this.entities[1].drawing.color = createVector(0, 255, 0);
    }

    getInput() {
        this.input.update();
    }

    update() {
        if (this.input.mouseLeftStatus === 1) {
            console.log("ayy");
        }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].update();
            this.wraparound(this.entities[i]);
        }
    }

    wraparound(entity) {
        if (entity.position.x <= -1 * (WINDOW_CENTER_X + entity.drawing.size)) {
            entity.position.x += (WINDOW_HEIGHT + entity.drawing.size);
        }
        if (entity.position.y <= -1 * (WINDOW_CENTER_Y + entity.drawing.size)) {
            entity.position.y += (WINDOW_HEIGHT + entity.drawing.size);
        }
        if (entity.position.x >= 1 * (WINDOW_CENTER_X + entity.drawing.size)) {
            entity.position.x -= (WINDOW_HEIGHT + entity.drawing.size);
        }
        if (entity.position.y >= 1 * (WINDOW_CENTER_Y + entity.drawing.size)) {
            entity.position.y -= (WINDOW_HEIGHT + entity.drawing.size);
        }
    }

    render() {
        for (let i = 0; i < this.entities.length; i++) {
            this.renderer.render(this.entities[i].drawing);
            // this.entities[i].navigator.drawDesires();
        }
    }
}