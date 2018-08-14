/*
Game
*/

class Game {
    constructor(input, renderer) {
        this.input = input;
        this.renderer = renderer;

        this.entities = [];
        for (let i = 0; i < 100; i++) {
            this.entities.push(new GameObject(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
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
        }
    }

    render() {
        for (let i = 0; i < this.entities.length; i++) {
            this.renderer.render(this.entities[i].drawing);
        }
    }
}