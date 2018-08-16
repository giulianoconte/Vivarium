
class GameObject {
    constructor(x, y) {
        this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
        this.velocity = createVector(random(10) - 5, random(10) - 5);
        this.position = createVector(x, y);

        this.maxSpeed = 7;
        this.maxForce = 0.15;

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
        this.chooseDesiredVelocity();
        this.steer();
        this.updateDrawing();
    }

    chooseDesiredVelocity() {
        this.desired = createVector(0, 0);
        this.separate(game.input.mousePosition);
        // for (let i = 0; i < game.entities.length; i++) {
        //     this.separate(game.entities[i].position);
        // }
    }

    steer() {
        let steering = createVector(this.desired.x, this.desired.y);
        steering.limit(this.maxSpeed);
        this.acceleration = p5.Vector.sub(steering, this.velocity);
        this.acceleration.limit(this.maxForce);
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
    }

    seek(target) {
        let seek = p5.Vector.sub(target, this.position);
        seek.setMag(this.maxSpeed);
        this.desired.add(seek);
    }

    flee(target) {
        let flee = p5.Vector.sub(this.position, target);
        flee.setMag(this.maxSpeed);
        this.desired.add(flee);
    }

    arrive(target) {
        let slowDistance = 200;
        let distance = dist(this.position.x, this.position.y, target.x, target.y);
        let arrive = p5.Vector.sub(target, this.position);
        if (distance >= slowDistance) {
            arrive.setMag(this.maxSpeed);
        }
        else {
            let speed = map(distance, 0, slowDistance, 0, this.maxSpeed);
            arrive.setMag(speed);
        }
        this.desired.add(arrive);
    }

    freezeFlee(target) {
        let freezeDistance = 80;
        let slowDistance = 300;
        let distance = dist(this.position.x, this.position.y, target.x, target.y);
        let arrive = p5.Vector.sub(this.position, target);
        if (distance >= slowDistance) {
            arrive.setMag(this.maxSpeed);
        }
        else if (distance >= freezeDistance) {
            let speed = map(distance, freezeDistance, slowDistance, 0, this.maxSpeed);
            arrive.setMag(speed);
        }
        else {
            arrive.setMag(0);
        }
        this.desired.add(arrive);
    }

    separate(target) {
        let separationDistance = 50;
        let distance = dist(this.position.x, this.position.y, target.x, target.y);
        let separate = p5.Vector.sub(this.position, target);
        if (distance > 0 && distance < separationDistance) {
            let speed = map(distance, separationDistance, 0, 0, this.maxSpeed);
            separate.setMag(speed);
        }
        this.logVector("distance", distance);
        this.desired.add(separate);
    }

    updateDrawing() {
        this.drawing.position = this.position;
        this.direction = this.velocity.heading();
        this.drawing.rotation = this.direction;
    }

    logVector(vectorName, vector) {
        console.log(`${vectorName}: ${vector}`);
    }
}