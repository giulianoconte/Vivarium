/*
Game
*/

class Game {
    constructor(input) {
        this.input = input;
    }

    getInput() {
        this.input.update();
    }

    update() {
        if (this.input.mouseStatus === 1) {
            console.log("ayy");
        }
    }

    render() {

    }
}