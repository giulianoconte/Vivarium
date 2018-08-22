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
        for (let i = 0; i < 50; i++) {
            this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        }
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