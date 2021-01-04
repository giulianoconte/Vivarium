class Input {
  constructor() {
    // input flags
    // 0 means button is up, 1 means button is pressed,
    // 2 means button is held, 3 means button is released
    this.mouse = {
      // Positional info.
      // Called position/velocity so others can use it as in target.position just like entity.position.
      position: createVector(0, 0),
      lastPosition: createVector(0, 0), // Used for calculating velocity.
      // Calculate velocity for the mouse based on last frame. This allows the mouse to be used as an entity for steering behaviors i.e Pursue.
      velocity: createVector(0, 0),
      positionInitialized: false,
      // Click info.
      leftStatus: 0,
      isPressed: false,
      isReleased: false,
    };
    // this.mouseLeftStatus = 0;
    // this.mouseIsPressed = false;
    // this.mouseIsReleased = false;
    // this.mousePositionInitialized = false;
  }

  update() {
    this.updateMousePosition();
    this.updateMouseLeftStatus();
  }

  updateMousePosition() {
    if (this.mouse.positionInitialized === false) {
      if (mouseX !== 0 || mouseY !== 0) {
        this.mouse.positionInitialized = true;
      }
    } else {
      this.mouse.position.x = mouseX - WINDOW_CENTER_X;
      this.mouse.position.y = -(mouseY - WINDOW_CENTER_Y);
      // Calculate velocity based on previous position delta.
      this.mouse.velocity = p5.Vector.sub(
        this.mouse.position,
        this.mouse.lastPosition
      );
      // console.log(
      //   `mouse.lastPosition: ${this.mouse.lastPosition}, mouse.position: ${this.mouse.position}, mouse.velocity: ${this.mouse.velocity}`
      // );
      this.mouse.lastPosition.x = this.mouse.position.x;
      this.mouse.lastPosition.y = this.mouse.position.y;
    }
  }

  updateMouseLeftStatus() {
    switch (this.mouse.leftStatus) {
      case 0:
        if (this.mouse.isPressed === true) {
          this.mouse.leftStatus = 1;
        }
        break;
      case 1:
        if (this.mouse.isPressed === false) {
          this.mouse.leftStatus = 2;
        }
        break;
      case 2:
        if (this.mouse.isReleased === true) {
          this.mouse.leftStatus = 3;
        }
        break;
      case 3:
        if (this.mouse.isReleased === false) {
          this.mouse.leftStatus = 0;
        }
        break;
      default:
        this.mouse.leftStatus = 0;
        break;
    }
    this.mouse.isPressed = false;
    this.mouse.isReleased = false;
  }

  mousePress() {
    this.mouse.isPressed = true;
  }

  mouseRelease() {
    this.mouse.isReleased = true;
  }
}
