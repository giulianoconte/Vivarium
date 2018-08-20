

class SteeringBehavior {
    constructor(entity) {
        this.entity = entity;
        this.partiality = 1.0;
    }
}

class AbstractTargetedSteeringBehavior extends SteeringBehavior {
    constructor(entity, target) {
        super(entity);
        this.target = target;
    }

    updateTarget(target) {
        this.target = target;
    }
}

class Seek extends AbstractTargetedSteeringBehavior {
    constructor(entity, target) {
        super(entity, target);
    }

    calculate() {
        let seek = p5.Vector.sub(this.target, this.entity.position);
        seek.setMag(this.entity.maxSpeed);
        return seek;
    }
}

class Flee extends AbstractTargetedSteeringBehavior {
    constructor(entity, target) {
        super(entity, target);
    }

    calculate() {
        let flee = p5.Vector.sub(this.entity.position, this.target);
        flee.setMag(this.entity.maxSpeed);
        return flee;
    }
}

class Arrive extends AbstractTargetedSteeringBehavior {
    constructor(entity, target) {
        super(entity, target);
    }

    calculate() {
        let slowDistance = 200;
        let distance = dist(this.entity.position.x, this.entity.position.y, this.target.x, this.target.y);
        let arrive = p5.Vector.sub(this.target, this.entity.position);
        if (distance >= slowDistance) {
            arrive.setMag(this.entity.maxSpeed);
        }
        else {
            let speed = map(distance, 0, slowDistance, 0, this.entity.maxSpeed);
            arrive.setMag(speed);
        }
        return arrive;
    }
}

// Will freeze if the target comes too close, else it will slowly accelerate away
class FreezeFlee extends AbstractTargetedSteeringBehavior {
    constructor(entity, target) {
        super(entity, target);
    }
    
    calculate() {
        let freezeDistance = 80;
        let slowDistance = 300;
        let distance = dist(this.entity.position.x, this.entity.position.y, this.target.x, this.target.y);
        let freezeFlee = p5.Vector.sub(this.entity.position, this.target);
        if (distance >= slowDistance) {
            freezeFlee.setMag(this.entity.maxSpeed);
        }
        else if (distance >= freezeDistance) {
            let speed = map(distance, freezeDistance, slowDistance, 0, this.entity.maxSpeed);
            freezeFlee.setMag(speed);
        }
        else {
            freezeFlee.setMag(0);
        }
        return freezeFlee;
    }
}

class AbstractFlockingSteeringBehavior extends SteeringBehavior {
    constructor(entity, flock) {
        super(entity);
        this.flock = flock;
    }

    updateTargets(flock) {
        this.flock = flock;
    }
}

// Separation: 1 of 3 classic flocking behaviors of Craig Reynolds' boids.
// Entity tries to keep a minimum distance between its neighbors
class Separate extends AbstractFlockingSteeringBehavior {
    constructor(entity, flock) {
        super(entity, flock);
    }

    calculate() {
        this.partiality = 0;
        let separate = createVector(0, 0);
        let separationDistance = 35;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.entity.position.x, this.entity.position.y, this.flock[i].position.x, this.flock[i].position.y);
            let component = p5.Vector.sub(this.entity.position, this.flock[i].position);
            if (distance > 0 && distance < separationDistance) {
                this.partiality = 1;
                let speed = map(distance, separationDistance, 0, this.entity.maxSpeed / 10, this.entity.maxSpeed);
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

// Alignment: 2 of 3 classic flocking behaviors of Craig Reynolds' boids.
// Entity tries to keep same velocity as its neighbors
class Align extends AbstractFlockingSteeringBehavior {
    constructor(entity, flock) {
        super(entity, flock);
    }

    calculate() {
        this.partiality = 0;
        let align = createVector(0, 0);
        let separationDistance = 30;
        let neighborAmount = 0;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.entity.position.x, this.entity.position.y, this.flock[i].position.x, this.flock[i].position.y);
            if (distance > 0 && distance < separationDistance) {
                this.partiality = 1;
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

// Cohesion: 3 of 3 classic flocking behaviors of Craig Reynolds' boids.
// Entity tries to move toward the average position of its neighbors
class Cohere extends AbstractFlockingSteeringBehavior {
    constructor(entity, flock) {
        super(entity, flock);
    }

    calculate() {
        this.partiality = 0;
        let cohere = createVector(0, 0);
        let separationDistance = 25;
        let neighborAmount = 0;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.entity.position.x, this.entity.position.y, this.flock[i].position.x, this.flock[i].position.y);
            if (distance > 0 && distance < separationDistance) {
                this.partiality = 1;
                cohere.add(p5.Vector.sub(this.flock[i].position, this.entity.position));
                neighborAmount++;
            }
        }
        if (neighborAmount > 0) {
            cohere.mult(1.0 / neighborAmount);
        }
        return cohere;
    }
}

// Similar to Separate except it will "strafe" away from the flock with respect to a reference point.
// "Strafing" here means it will move orthogonally to the reference point.
class Straferate extends AbstractFlockingSteeringBehavior {
    constructor(entity, flock, referencePoint) {
        super(entity, flock);
        this.referencePoint = referencePoint;
    }

    updateReferencePoint(referencePoint) {
        this.referencePoint = referencePoint;
    }

    calculate() {
        this.partiality = 0;
        let straferate = createVector(0, 0);
        let separationDistance = 40;
        for (let i = 0; i < this.flock.length; i++) {
            let distance = dist(this.entity.position.x, this.entity.position.y, this.flock[i].position.x, this.flock[i].position.y);

            let toReferencePoint = p5.Vector.sub(this.referencePoint, this.entity.position);
            let toTarget = p5.Vector.sub(this.flock[i].position, this.entity.position);
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
                this.partiality = 1;
                let speed = map(distance, separationDistance, 0, 0, this.entity.maxSpeed);
                component.setMag(speed);
            }
            else {
                component.setMag(0);
            }
            straferate.add(component);
        }
        return straferate;
    }
}