
class GameObject {
    constructor(x, y) {
        this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
        this.velocity = createVector(random(10) - 5, random(10) - 5);
        this.position = createVector(x, y);

        this.maxSpeed = 15;
        this.maxForce = 0.75;

        this.navigator = new Navigator(this);
        this.desired = createVector(0, 0);
        this.direction = this.velocity.heading();

        let shape = Renderer.SHAPES.THIN_TRIANGLE;
        let color = createVector(204, 101, 192);
        color = createVector(127 - random(127), 100 + 127 - random(127), 200 + random(255-200));
        this.drawing = new Drawing(shape, 30, color, this.position, this.direction);
    }

    update() {
        this.steer();
        this.updateDrawing();
    }

    steer() {
        this.desired = this.navigator.chooseDesiredVelocity();
        let steering = this.desired;
        steering.limit(this.maxSpeed);
        this.acceleration = p5.Vector.sub(steering, this.velocity);
        this.acceleration.limit(this.maxForce);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    updateDrawing() {
        this.drawing.position = this.position;
        this.direction = this.desired.heading();
        this.drawing.rotation = this.direction;
    }
}