

class SteeringBehavior {
    constructor(gameObject) {
        this.gameObject = gameObject;
    }
}

class AbstractTargetedSteeringBehavior extends SteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject);
        this.target = target;
    }

    updateTarget(target) {
        this.target = target;
    }
}

class Seek extends AbstractTargetedSteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject, target);
    }

    calculate() {
        let seek = p5.Vector.sub(this.target, this.gameObject.position);
        seek.setMag(this.gameObject.maxSpeed);
        return seek;
    }
}

class Flee extends AbstractTargetedSteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject, target);
    }

    calculate() {
        let flee = p5.Vector.sub(this.gameObject.position, this.target);
        flee.setMag(this.gameObject.maxSpeed);
        return flee;
    }
}

class Arrive extends AbstractTargetedSteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject, target);
    }

    calculate() {
        let slowDistance = 200;
        let distance = dist(this.gameObject.position.x, this.gameObject.position.y, this.target.x, this.target.y);
        let arrive = p5.Vector.sub(this.target, this.gameObject.position);
        if (distance >= slowDistance) {
            arrive.setMag(this.gameObject.maxSpeed);
        }
        else {
            let speed = map(distance, 0, slowDistance, 0, this.gameObject.maxSpeed);
            arrive.setMag(speed);
        }
        return arrive;
    }
}

class FreezeFlee extends AbstractTargetedSteeringBehavior {
    constructor(gameObject, target) {
        super(gameObject, target);
    }
    
    calculate() {
        let freezeDistance = 80;
        let slowDistance = 300;
        let distance = dist(this.gameObject.position.x, this.gameObject.position.y, this.target.x, this.target.y);
        let freezeFlee = p5.Vector.sub(this.gameObject.position, this.target);
        if (distance >= slowDistance) {
            freezeFlee.setMag(this.gameObject.maxSpeed);
        }
        else if (distance >= freezeDistance) {
            let speed = map(distance, freezeDistance, slowDistance, 0, this.gameObject.maxSpeed);
            freezeFlee.setMag(speed);
        }
        else {
            freezeFlee.setMag(0);
        }
        return freezeFlee;
    }
}

class AbstractFlockingSteeringBehavior extends SteeringBehavior {
    constructor(gameObject, flock) {
        super(gameObject);
        this.flock = flock;
    }

    updateTargets(flock) {
        this.flock = flock;
    }
}

class Separate extends AbstractFlockingSteeringBehavior {
    constructor(gameObject, flock) {
        super(gameObject, flock);
    }

    calculate() {
        let separate = createVector(0, 0);
        let separationDistance = 35;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.gameObject.position.x, this.gameObject.position.y, this.flock[i].position.x, this.flock[i].position.y);
            let component = p5.Vector.sub(this.gameObject.position, this.flock[i].position);
            if (distance > 0 && distance < separationDistance) {
                let speed = map(distance, separationDistance, 0, this.gameObject.maxSpeed / 10, this.gameObject.maxSpeed);
                component.setMag(speed);
            }
            else {
                component.setMag(0);
            }
            separate.add(component);
        }
        return separate;
    }
}

class Align extends AbstractFlockingSteeringBehavior {
    constructor(gameObject, flock) {
        super(gameObject, flock);
    }

    calculate() {
        let align = createVector(0, 0);
        let separationDistance = 30;
        let neighborAmount = 0;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.gameObject.position.x, this.gameObject.position.y, this.flock[i].position.x, this.flock[i].position.y);
            if (distance > 0 && distance < separationDistance) {
                align.add(this.flock[i].velocity);
                neighborAmount++;
            }
        }
        if (neighborAmount > 0) {
            align.mult(1.0 / neighborAmount);
        }
        return align;
    }
}

class Cohere extends AbstractFlockingSteeringBehavior {
    constructor(gameObject, flock) {
        super(gameObject, flock);
    }

    calculate() {
        let cohere = createVector(0, 0);
        let separationDistance = 25;
        let neighborAmount = 0;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.gameObject.position.x, this.gameObject.position.y, this.flock[i].position.x, this.flock[i].position.y);
            if (distance > 0 && distance < separationDistance) {
                cohere.add(p5.Vector.sub(this.flock[i].position, this.gameObject.position));
                neighborAmount++;
            }
        }
        if (neighborAmount > 0) {
            cohere.mult(1.0 / neighborAmount);
        }
        return cohere;
    }
}

class Straferate extends AbstractFlockingSteeringBehavior {
    constructor(gameObject, flock, referencePoint) {
        super(gameObject, flock);
        this.referencePoint = referencePoint;
    }

    updateReferencePoint(referencePoint) {
        this.referencePoint = referencePoint;
    }

    calculate() {
        let hasOpinion = false;
        let straferate = createVector(0, 0);
        let separationDistance = 40;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.gameObject.position.x, this.gameObject.position.y, this.flock[i].position.x, this.flock[i].position.y);

            let toReferencePoint = p5.Vector.sub(this.referencePoint, this.gameObject.position);
            let toTarget = p5.Vector.sub(this.flock[i].position, this.gameObject.position);
            let orthogonalToReferencePoint = createVector(-toReferencePoint.y, toReferencePoint.x);

            // dot product:
            //  positive -> vectors have acute angle
            //  0 -> vectors are orthogonal
            //  negative -> vectors have obtuse angle
            let orthogonalAndToTargetDotProduct = p5.Vector.dot(toTarget, orthogonalToReferencePoint);
            let component = (orthogonalAndToTargetDotProduct >= 0) 
                ? p5.Vector.mult(orthogonalToReferencePoint, -1)
                : p5.Vector.mult(orthogonalToReferencePoint, 1);
            
            if (distance > 0 && distance < separationDistance) {
                hasOpinion = true;
                let speed = map(distance, separationDistance, 0, 0, this.gameObject.maxSpeed);
                component.setMag(speed);
            }
            else {
                component.setMag(0);
            }
            straferate.add(component);
        }
        if (hasOpinion === false) {
            straferate = this.gameObject.velocity;
        }
        return straferate;
    }
}