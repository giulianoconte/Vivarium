
class Entity {
    constructor(x, y) {
        this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
        this.velocity = createVector(random(3) - ((3) / 2), random(3) - ((3) / 2));
        this.position = createVector(x, y);

        this.size = 15;

        this.maxSpeed = 4;
        this.maxForce = 0.20;
        // this.maxSpeed = 16;
        // this.maxForce = 0.8;
        this.maxSpeed *= 4;
        this.maxForce *= 4;

        this.navigator = new Navigator(this);
        // this.navigator.addSeek('seek', 1.5, game.input.mousePosition);
        // this.navigator.addFlee('flee', 1, game.input.mousePosition);
        // this.navigator.addArrive('arrive', 2, game.input.mousePosition, 200);
        // this.navigator.addFreezeFlee('freezeFlee', 1, game.input.mousePosition, 80, 120);
        // this.navigator.addSeparate('separate', 2, game.entities, 35);
        // this.navigator.addAlign('align', 1.5, game.entities, 30);
        // this.navigator.addCohere('cohere', 1, game.entities, 25);
        // this.navigator.addStraferate('straferate', 1, game.entities, game.input.mousePosition, 40);

        this.desired = createVector(0, 0);
        this.direction = this.velocity.heading();

        let shape = Renderer.SHAPES.THIN_TRIANGLE;
        let color = createVector(204, 101, 192);
        color = createVector(127 - random(127), 100 + 127 - random(127), 200 + random(255-200));
        this.drawing = new Drawing(shape, this.size, color, this.position, this.direction);
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
    }

    updateDrawing() {
        this.drawing.position = this.position;
        // Update direction iff speed > 0 so direction doesn't default to 0 degrees
        if (this.velocity.mag() !== 0) {
            this.direction = this.velocity.heading();
        }
        this.drawing.rotation = this.direction;
    }

    render() {
        // this.renderNavigation();
        game.renderer.render(this.drawing);
    }

    renderNavigation() {
        let vectorLength = this.size * 1.5;

        for (let i = 0; i < this.navigator.desires.length; i++) {
            let componentWeightedResult = this.navigator.desires[i].weightedResult;
            componentWeightedResult.setMag(vectorLength / this.navigator.desires.length);
            Renderer.drawLine(this.position, p5.Vector.add(this.position, componentWeightedResult), createVector(255, 0, 0), 100);
        }
        let finalResult = this.navigator.finalResult;
        finalResult.setMag(vectorLength);
        Renderer.drawLine(this.position, p5.Vector.add(this.position, finalResult), createVector(0, 255, 0), 150);
    }
}