
class Navigator {
    constructor(gameObject) {
        this.desires = [];
        this.steeringFactory = new AbstractSteeringBehaviorFactory(gameObject);
        this.desires.push({id: 'seek', behavior: this.steeringFactory.createSeek(game.input.mousePosition), weight: 2, result: createVector(0, 0)});
        this.desires.push({id: 'flee', behavior: this.steeringFactory.createFlee(game.input.mousePosition), weight: 1, result: createVector(0, 0)});
        
        this.gameObject = gameObject;
    }

    chooseDesiredVelocity() {
        let desired = createVector(0, 0);
        let totalWeight = 0;
        for (let i = 0; i < this.desires.length; i++) {
            this.desires[i].result = this.desires[i].behavior.execute();
            desired.add(p5.Vector.mult(this.desires[i].result, this.desires[i].weight));
            totalWeight += this.desires[i].weight;
        }
        if (totalWeight !== 0) {
            desired.mult(1.0 / totalWeight);
        }
        return desired;

        // this.arrive(game.input.mousePosition);
        // this.arrive(game.input.mousePosition);
        // this.flee(game.input.mousePosition);
        // for (let i = 0; i < game.entities.length; i++) {
        //     this.straferate(game.entities[i].position, game.input.mousePosition);
        // }

        // return this.desired;
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
        let separationDistance = 15;
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

        let separationDistance = 40;
        if (distance > 0 && distance < separationDistance) {
            Renderer.drawLine(this.position, target, createVector(255, 255, 255), 50);
            let speed = map(distance, separationDistance, 0, 0, this.maxSpeed);
            straferate.setMag(speed);
        }
        else {
            straferate.setMag(0);
        }
        this.desired.add(straferate);
    }
}

class AbstractSteeringBehaviorFactory {
    constructor(gameObject) {
        this.gameObject = gameObject;
    }

    createSeek(target) {
        return new Seek(this.gameObject, target);
    }

    createFlee(target) {
        return new Flee(this.gameObject, target);
    }
}

class SteeringBehavior {
    constructor(gameObject) {
        this.gameObject = gameObject;
    }
}

class Seek extends SteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject);
        this.target = target;
    }

    updateTarget(target) {
        this.target = target;
    }

    execute() {
        let seek = p5.Vector.sub(this.target, this.gameObject.position);
        seek.setMag(this.gameObject.maxSpeed);
        return seek;
    }
}

class Flee extends SteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject);
        this.target = target;
    }

    updateTarget(target) {
        this.target = target;
    }

    execute() {
        let flee = p5.Vector.sub(this.gameObject.position, this.target);
        flee.setMag(this.gameObject.maxSpeed);
        return flee;
    }
}