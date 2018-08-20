
class Entity {
    constructor(x, y) {
        this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
        this.velocity = createVector(random(10) - 5, random(10) - 5);
        // this.velocity = createVector(0, 0);
        this.position = createVector(x, y);

        this.maxSpeed = 5;
        this.maxForce = 0.25;

        this.navigator = new Navigator(this);
        // this.navigator.addSeek('seek', 1, game.input.mousePosition);
        // this.navigator.addFlee('flee', 1, game.input.mousePosition);
        // this.navigator.addArrive('arrive', 1, game.input.mousePosition);
        this.navigator.addSeparate('separate', 2, game.entities);
        this.navigator.addAlign('align', 1.5, game.entities);
        this.navigator.addCohere('cohere', 1, game.entities);
        // this.navigator.addStraferate('straferate', 1, game.entities, game.input.mousePosition);

        this.desired = createVector(0, 0);
        this.direction = this.velocity.heading();

        let shape = Renderer.SHAPES.THIN_TRIANGLE;
        let color = createVector(204, 101, 192);
        color = createVector(127 - random(127), 100 + 127 - random(127), 200 + random(255-200));
        this.drawing = new Drawing(shape, 20, color, this.position, this.direction);
    }

    update() {
        this.navigator.update();
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

        // this.acceleration = this.navigator.chooseDesiredAcceleration();
        // // this.acceleration.limit(this.maxForce);
        // this.velocity.add(this.acceleration);
        // this.position.add(this.velocity);
    }

    updateDrawing() {
        this.drawing.position = this.position;
        this.direction = this.velocity.heading();
        this.drawing.rotation = this.direction;
    }
}