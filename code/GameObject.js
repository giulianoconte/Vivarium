
class GameObject {
    constructor(x, y) {
        this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
        this.velocity = createVector(random(10) - 5, random(10) - 5);
        this.position = createVector(x, y);

        this.desired = createVector(0, 0);
        
        this.direction = this.velocity.heading();
        if (isNaN(this.direction)) {
            this.direction = 0;
        }

        let shape = Renderer.SHAPES.CIRCLE;
        let color = createVector(204, 101, 192);
        this.drawing = new Drawing(shape, 10, color, this.position, this.direction);
    }

    update() {
        this.act();
        this.steer();
        this.updateDrawing();
    }

    act() {
        this.seek(game.input.mousePosition);
    }

    steer() {
        this.acceleration = p5.Vector.sub(this.desired, this.velocity);
        this.acceleration.normalize();
        this.acceleration.mult(0.15);
        // console.log(
        //     `target: ${game.input.mousePosition} ${"\n"}` +
        //     `desired: ${this.desired} ${"\n"}` +
        //     `velocity: ${this.velocity} ${"\n"}` +
        //     `steering: ${p5.Vector.sub(this.desired, this.velocity)} ${"\n"}` +
        //     `acceleration: ${this.acceleration}`
        // )
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    seek(target) {
        this.desired = p5.Vector.sub(target, this.position);
        this.desired.setMag(7);
    }

    flee(target) {
        this.desired = p5.Vector.sub(target, this.position);
        this.desired = p5.Vector.mult(this.desired, -1);
    }

    updateDrawing() {
        this.drawing.position = this.position;
        this.direction = this.velocity.heading();
        this.drawing.rotation = this.direction;
    }
}