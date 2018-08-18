
class GameObject {
    constructor(x, y) {
        this.acceleration = createVector(random(0.2) - 0.1, random(0.2) - 0.1);
        this.velocity = createVector(random(10) - 5, random(10) - 5);
        this.position = createVector(x, y);

        this.maxSpeed = 15;
        this.maxForce = 0.35;

        this.desired = createVector(0, 0);
        
        this.direction = this.velocity.heading();
        if (isNaN(this.direction)) {
            this.direction = 0;
        }

        let shape = Renderer.SHAPES.CIRCLE;
        let color = createVector(204, 101, 192);
        color = createVector(127 - random(127), 100 + 127 - random(127), 200 + random(255-200));
        this.drawing = new Drawing(shape, 10, color, this.position, this.direction);
    }

    update() {
        this.chooseDesiredVelocity();
        this.steer();
        this.updateDrawing();
    }

    chooseDesiredVelocity() {
        this.desired = createVector(0, 0);
        this.arrive(game.input.mousePosition);
        this.arrive(game.input.mousePosition);
        this.flee(game.input.mousePosition);
        for (let i = 0; i < game.entities.length; i++) {
            this.straferate(game.entities[i].position, game.input.mousePosition);
        }
    }

    alterSeek(target) {
        let seek = p5.Vector.sub(target, this.position);
        seek.setMag(this.maxSpeed);
        this.desired.add(seek);
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
        let separationDistance = 5;
        let distance = dist(this.position.x, this.position.y, target.x, target.y);
        let separate = p5.Vector.sub(this.position, target);
        if (distance > 0 && distance < separationDistance) {
            let speed = map(distance, separationDistance, 0, this.maxSpeed/10, this.maxSpeed);
            separate.setMag(speed);
        }
        else {
            separate.setMag(0);
        }
        this.desired.add(separate);
    }

    straferate(target, referencePoint) {
        let separationDistance = 15;
        let distance = dist(this.position.x, this.position.y, target.x, target.y);
        
        let toReferencePoint = p5.Vector.sub(referencePoint, this.position);
        let toTarget = p5.Vector.sub(target, this.position);
        let orthogonalToReferencePoint = createVector(-toReferencePoint.y, toReferencePoint.x);

        // dot product:
        //  positive -> vectors have acute angle
        //  0 -> vectors are orthogonal
        //  negative -> vectors have obtuse angle
        let orthogonalAndToTargetDotProduct = p5.Vector.dot(toTarget, orthogonalToReferencePoint);
        let straferate = (orthogonalAndToTargetDotProduct >= 0) 
            ? p5.Vector.mult(orthogonalToReferencePoint, -1)
            : p5.Vector.mult(orthogonalToReferencePoint, 1);

        if (distance > 0 && distance < separationDistance) {
            let speed = map(distance, separationDistance, 0, this.maxSpeed/10, this.maxSpeed);
            straferate.setMag(speed);
        }
        else {
            straferate.setMag(0);
        }
        this.desired.add(straferate);
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