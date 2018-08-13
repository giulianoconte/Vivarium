
class Input {
    constructor() {
        // input flags
        // 0 means button is up, 1 means button is pressed, 2 means button is held, 3 means button is released
        this.mouseStatus = 0;
        this.mouseIsPressed = false;
        this.mouseIsReleased = false;
    }

    update() {
        switch (this.mouseStatus) {
            case 0:
                if (this.mouseIsPressed === true) {
                    this.mouseStatus = 1;
                }
                break;
            case 1:
                if (this.mouseIsPressed === false) {
                    this.mouseStatus = 2;
                }
                break;
            case 2:
                if (this.mouseIsReleased === true) {
                    this.mouseStatus = 3;
                }
                break;
            case 3:
                if (this.mouseIsReleased === false) {
                    this.mouseStatus = 0;
                }
                break;
            default:
                this.mouseStatus = 0;
                break;
        }
        this.mouseIsPressed = false;
        this.mouseIsReleased = false;
    }

    mousePress() {
        this.mouseIsPressed = true;
    }

    mouseRelease() {
        this.mouseIsReleased = true;
    }
}