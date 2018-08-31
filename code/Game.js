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
        let entityAmount = 9;
        for (let i = 0; i < entityAmount; i++) {
            this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        }
        for (let i = 0; i < entityAmount; i++) {
            this.entities[i].navigator.addPursue('pursue', 1, this.entities[(i + 1) % entityAmount], 20);
            this.entities[i].navigator.addEvade('evade', 1, this.entities[(i + entityAmount - 1) % entityAmount], 20);

            // this.entities[i].navigator.addSeek('seek', 1, this.entities[(i + 1) % entityAmount].position);
            // this.entities[i].navigator.addFlee('flee', 1, this.entities[(i + entityAmount - 1) % entityAmount].position);

            // this.entities[i].navigator.addSeek('seek', 3, this.input.mousePosition);
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
        // for (let i = 0; i < this.entities.length; i++) {
        //     this.renderer.render(this.entities[i].drawing);
        //     // this.entities[i].navigator.drawDesires();
        // }
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].render();
        }
    }
}