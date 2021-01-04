/* exported Entity */
class Entity {
  static createEntity(x, y) {
    return new Entity(x, y, Renderer.SHAPES.THIN_TRIANGLE);
  }

  static createEntityWithShape(x, y, shape) {
    return new Entity(x, y, shape);
  }

  constructor(x, y, shape) {
    this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
    // TODO: Create builder constructor, put stuff like random velocity, shape, etc in builder functions.
    // Start with random velocity.
    // this.velocity = createVector(random(3) - 3 / 2, random(3) - 3 / 2);
    this.velocity = createVector(0, 0);
    this.position = createVector(x, y);

    let randomNumber = random(0.5);
    randomNumber *= randomNumber;
    const sizeMult = 12 * randomNumber;
    // this.size = 30 * (1 + sizeMult);
    this.size = 10;

    this.maxSpeed = 4;
    this.maxForce = 0.2;
    // this.maxSpeed *= 0.3;
    // this.maxForce *= 0.03;
    this.maxSpeed = 6;
    this.maxForce = 0.2;

    this.navigator = new Navigator(this);
    this.physics = new Physics(this);

    this.desired = createVector(0, 0);
    this.direction = this.velocity.heading();

    let color = createVector(204, 101, 192);
    color = createVector(
      127 - random(127),
      100 + 127 - random(127),
      200 + random(255 - 200)
    );
    this.drawing = new Drawing(
      shape,
      this.size,
      color,
      this.position,
      this.direction
    );
  }

  update() {
    this.move();
  }

  move() {
    this.steer();
    this.physics.apply();
  }

  steer() {
    this.desired = this.navigator.chooseDesiredVelocity();
    const steering = this.desired;
    steering.limit(this.maxSpeed);

    // Classic steering equation: ACCELERATION = DESIRED_STEERING - CURRENT_VELOCITY
    this.acceleration = p5.Vector.sub(steering, this.velocity);
    this.acceleration.limit(this.maxForce);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    // Update direction iff speed > 0 so direction doesn't default to 0 degrees
    if (this.velocity.mag() !== 0) {
      this.direction = this.velocity.heading();
    }
  }

  render() {
    this.renderNavigation();
    this.updateDrawing();
    game.renderer.render(this.drawing);
  }

  updateDrawing() {
    this.drawing.position = this.position;
    this.drawing.rotation = this.direction;
  }

  renderNavigation() {
    const vectorLength = this.size * 1.5;

    for (let i = 0; i < this.navigator.desires.length; i++) {
      const component = this.navigator.desires[i];
      const componentWeightedResult = component.weightedResult;
      componentWeightedResult.setMag(
        (vectorLength / this.navigator.desires.length) *
          mag(componentWeightedResult.x, componentWeightedResult.y)
      );
      Renderer.drawLine(
        this.position,
        p5.Vector.add(this.position, componentWeightedResult),
        createVector(255, 0, 0),
        100
      );
      component.behavior.render();
    }
    const { finalResult } = this.navigator;
    finalResult.setMag(vectorLength);
    Renderer.drawLine(
      this.position,
      p5.Vector.add(this.position, finalResult),
      createVector(0, 255, 0),
      100
    );
  }
}
