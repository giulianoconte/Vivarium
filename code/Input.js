class Button {
  constructor() {
    // 0 means button is up, 1 means button is pressed,
    // 2 means button is held, 3 means button is released
    this.state = 0;
    this.pressed = false;
    this.released = false;
  }

  isUp() {
    return this.state === 0;
  }

  isPressed() {
    return this.state === 1;
  }

  isHeld() {
    return this.state === 2;
  }

  isReleased() {
    return this.state === 3;
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
      left: new Button(),
    };
    this.keys = new Map();
    // TODO: fix eslint config
    // eslint-disable-next-line no-restricted-syntax
    for (const key in Key.CODES) {
      // https://eslint.org/docs/rules/guard-for-in
      if ({}.hasOwnProperty.call(Key.CODES, key)) {
        this.keys.set(Key.CODES[key], new Button());
      }
    }
  }

  key(keyCode) {
    if (!this.keys.has(keyCode)) {
      console.warn(`Attempted to lookup key ${keyCode} but found no match.`);
      return null;
    }
    return this.keys.get(keyCode);
  }

  update() {
    this.updateMousePosition();
    Input.updateButtonState(this.mouse.left);
    for (const [_, button] of this.keys.entries()) {
      Input.updateButtonState(button);
    }
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

  static updateButtonState(button) {
    switch (button.state) {
      case 0:
        if (button.pressed === true) {
          button.state = 1;
        }
        break;
      case 1:
        if (button.pressed === false) {
          button.state = 2;
        }
        break;
      case 2:
        if (button.released === true) {
          button.state = 3;
        }
        break;
      case 3:
        if (button.released === false) {
          button.state = 0;
        }
        break;
      default:
        button.state = 0;
        break;
    }
    button.pressed = false;
    button.released = false;
  }

  debugLog() {
    for (const [key, button] of this.keys.entries()) {
      console.log(`key ${key}: ${button.state}`);
    }
  }

  // Methods accessed only by sketch.js to update input state.
  mousePress() {
    this.mouse.left.pressed = true;
  }

  mouseRelease() {
    this.mouse.left.released = true;
  }

  keyPress(key, code) {
    if (this.keys.has(code)) {
      this.keys.get(code).pressed = true;
    }
  }

  keyRelease(key, code) {
    if (this.keys.has(code)) {
      this.keys.get(code).released = true;
    }
  }
}
