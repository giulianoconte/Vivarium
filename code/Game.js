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
        let entityAmount = 30;
        for (let i = 0; i < entityAmount; i++) {
            this.entities.push(new Entity(random(-WINDOW_CENTER_X, WINDOW_CENTER_X), random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)));
        }
        for (let i = 0; i < entityAmount; i++) {
            // this.entities[i].navigator.addWander('wander', 0.1, 50, 1);
            // this.entities[i].navigator.addPursue('pursue', 1, this.entities[(i + 1) % entityAmount], 20);
            // this.entities[i].navigator.addEvade('evade', 1, this.entities[(i + entityAmount - 1) % entityAmount], 20);

            this.entities[i].navigator.addSeek('seek', 1, this.entities[(i + 1) % entityAmount].position);
            // this.entities[i].navigator.addFlee('flee', 1, this.entities[(i + entityAmount - 1) % entityAmount].position);
            // this.entities[i].navigator.addArrive('arrive', 1, this.entities[(i + 1) % entityAmount].position, 50, 5000);

            // this.entities[i].navigator.addSeek('seek', 3, this.input.mousePosition);
            
            // this.entities[i].navigator.addArrive('arrive', 1.2, this.input.mousePosition, 0, 200);
            // this.entities[i].navigator.addFlee('flee', 1, this.input.mousePosition);
            // this.entities[i].navigator.addStraferate('straferate', 1, this.entities, this.input.mousePosition, 100);
            
            // this.entities[i].navigator.addWander('wander', 0.1, 50, 0.2);
            // this.entities[i].navigator.addSeparate('separate', 3, this.entities, 30);
            // this.entities[i].navigator.addAlign('align', 1, this.entities, 50);
            // this.entities[i].navigator.addCohere('cohere', 1, this.entities, 25);
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
            this.entities[i].render();
        }
    }
}