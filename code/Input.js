class Button {
  constructor() {
    this.state = 0;
    this.isPressed = false;
    this.isReleased = false;
  }
}

class Input {
  constructor() {
    this.mouse = {
      // Positional info.
      // Called position/velocity so others can use it as in target.position just like entity.position.
      position: createVector(0, 0),
      lastPosition: createVector(0, 0), // Used for calculating velocity.
      // Calculate velocity for the mouse based on last frame. This allows the mouse to be used as an entity for steering behaviors i.e Pursue.
      velocity: createVector(0, 0),
      positionInitialized: false,
      // Click flags.
      // 0 means button is up, 1 means button is pressed,
      // 2 means button is held, 3 means button is released
      leftStatus: 0,
      isPressed: false,
      isReleased: false,
      left: new Button(),
    };
    this.keys = { tilda: new Button() };
  }

  update() {
    this.updateMousePosition();
    this.updateButtonStates();
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
      this.mouse.lastPosition.x = this.mouse.position.x;
      this.mouse.lastPosition.y = this.mouse.position.y;
    }
  }

  updateButtonStates() {
    Input.updateButtonState(this.mouse.left);
    Input.updateButtonState(this.keys.tilda);
  }

  mousePress() {
    this.mouse.left.isPressed = true;
  }

  mouseRelease() {
    this.mouse.left.isReleased = true;
  }

  keyPress(k, c) {
    if (c === 192) {
      this.keys.tilda.isPressed = true;
    }
  }

  keyRelease(k, c) {
    if (c === 192) {
      this.keys.tilda.isReleased = true;
    }
  }

  static updateButtonState(button) {
    switch (button.state) {
      case 0:
        if (button.isPressed === true) {
          button.state = 1;
        }
        break;
      case 1:
        if (button.isPressed === false) {
          button.state = 2;
        }
        break;
      case 2:
        if (button.isReleased === true) {
          button.state = 3;
        }
        break;
      case 3:
        if (button.isReleased === false) {
          button.state = 0;
        }
        break;
      default:
        button.state = 0;
        break;
    }
    button.isPressed = false;
    button.isReleased = false;
  }
}
