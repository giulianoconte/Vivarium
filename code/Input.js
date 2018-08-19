
class Input {
    constructor() {
        // input flags
        // 0 means button is up, 1 means button is pressed, 2 means button is held, 3 means button is released
        this.mouseLeftStatus = 0;
        this.mouseIsPressed = false;
        this.mouseIsReleased = false;
        this.mousePosition = createVector(0, 0);
        this.mousePositionInitialized = false;
    }

    update() {
        this.updateMousePosition();
        this.updateMouseLeftStatus();
    }

    updateMousePosition() {
        if (this.mousePositionInitialized === false) {
            if (mouseX !== 0 || mouseY !== 0) {
                this.mousePositionInitialized = true;
            }
        }
        else {
            this.mousePosition.x = mouseX - WINDOW_CENTER_X;
            this.mousePosition.y = -(mouseY - WINDOW_CENTER_Y);
        }
    }

    updateMouseLeftStatus() {
        switch (this.mouseLeftStatus) {
            case 0:
                if (this.mouseIsPressed === true) {
                    this.mouseLeftStatus = 1;
                }
                break;
            case 1:
                if (this.mouseIsPressed === false) {
                    this.mouseLeftStatus = 2;
                }
                break;
            case 2:
                if (this.mouseIsReleased === true) {
                    this.mouseLeftStatus = 3;
                }
                break;
            case 3:
                if (this.mouseIsReleased === false) {
                    this.mouseLeftStatus = 0;
                }
                break;
            default:
                this.mouseLeftStatus = 0;
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