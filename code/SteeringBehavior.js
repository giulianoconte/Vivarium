class SteeringBehavior {
  constructor(entity) {
    this.entity = entity;
    this.partiality = 1;
  }

  render() {}
}

class WanderRenders {
  constructor(wanderCircleCenter, wanderCircleRadius, wanderPoint) {
    this.wanderCircleCenter = wanderCircleCenter;
    this.wanderCircleRadius = wanderCircleRadius;
    this.wanderPoint = wanderPoint;
  }
}

class Wander extends SteeringBehavior {
  constructor(entity, turnStrength, turnChangeRate) {
    super(entity);
    this.turnStrength = turnStrength;
    this.turnChangeRate = turnChangeRate;
    this.lastTheta = 0.0;
    this.renders = new WanderRenders(createVector(0, 0), 1, createVector(0, 0));
  }

  calculate() {
    const offset = (random(2) - 1) * this.turnChangeRate;
    let newTheta = this.lastTheta + offset;
    if (newTheta > 4 * PI || newTheta < -4 * PI) {
      newTheta %= 2 * PI;
    }
    const wanderFromOrigin = createVector(cos(newTheta), sin(newTheta));
    wanderFromOrigin.setMag(this.turnStrength);
    const headingTheta = MathUtil.getTheta(this.entity.velocity);
    const wanderFromOriginRotatedForHeading = MathUtil.rotateVector(
      wanderFromOrigin,
      headingTheta
    );
    const wander = p5.Vector.add(
      this.getRelativeWanderCircle(),
      wanderFromOriginRotatedForHeading
    );
    this.lastTheta = newTheta;

    this.updateRenderInfo(wanderFromOriginRotatedForHeading);
    return wander;
  }

  getRelativeWanderCircle() {
    const wanderCircleOffset = createVector(
      this.entity.velocity.x,
      this.entity.velocity.y
    );
    wanderCircleOffset.setMag((8 / 3) * this.turnStrength);
    return wanderCircleOffset;
  }

  getWanderCirclePosition() {
    return p5.Vector.add(this.getRelativeWanderCircle(), this.entity.position);
  }

  updateRenderInfo(wanderPoint) {
    this.renders.wanderPoint = p5.Vector.add(
      this.getWanderCirclePosition(),
      wanderPoint
    );
    this.renders.wanderCircleCenter = this.getWanderCirclePosition();
    this.renders.wanderCircleRadius = this.turnStrength;
  }

  render() {
    super.render();
    Renderer.drawCircle(
      this.renders.wanderPoint,
      3,
      createVector(255, 0, 255),
      50
    );
    Renderer.drawCircle(
      this.renders.wanderCircleCenter,
      this.renders.wanderCircleRadius,
      createVector(0, 155, 155),
      50
    );
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

  render() {
    Renderer.drawCircle(this.target.position, 3, createVector(255, 0, 0), 80);
    super.render();
  }
}

class Seek extends AbstractTargetedSteeringBehavior {
  calculate() {
    const seek = p5.Vector.sub(this.target.position, this.entity.position);
    seek.setMag(this.entity.maxSpeed);
    return seek;
  }
}

class Flee extends AbstractTargetedSteeringBehavior {
  calculate() {
    const flee = p5.Vector.sub(this.entity.position, this.target.position);
    flee.setMag(this.entity.maxSpeed);
    return flee;
  }
}

class TargetRenders {
  constructor(target) {
    this.target = target;
  }
}

class Pursue extends AbstractTargetedSteeringBehavior {
  constructor(entity, target, maxEstimationTime) {
    super(entity, target);
    this.maxEstimationTime = maxEstimationTime;
    this.renders = new TargetRenders(createVector(0, 0));
  }

  calculate() {
    const distance = dist(
      this.entity.position.x,
      this.entity.position.y,
      this.target.position.x,
      this.target.position.y
    );
    const timeUntilImpact = distance / this.entity.maxSpeed;
    const estimatedPosition = p5.Vector.add(
      this.target.position,
      p5.Vector.mult(
        this.target.velocity,
        Math.min(timeUntilImpact, this.maxEstimationTime)
      )
    );
    const pursue = p5.Vector.sub(estimatedPosition, this.entity.position);
    pursue.setMag(this.entity.maxSpeed);

    this.renders.target = estimatedPosition.copy();
    return pursue;
  }

  render() {
    Renderer.drawCircle(this.renders.target, 3, createVector(255, 255, 0), 80);
  }
}

class Evade extends AbstractTargetedSteeringBehavior {
  constructor(entity, target, maxEstimationTime) {
    super(entity, target);
    this.maxEstimationTime = maxEstimationTime;
    this.renders = new TargetRenders(createVector(0, 0));
  }

  calculate() {
    const distance = dist(
      this.entity.position.x,
      this.entity.position.y,
      this.target.position.x,
      this.target.position.y
    );
    const timeUntilImpact = distance / this.target.maxSpeed;
    const estimatedPosition = p5.Vector.add(
      this.target.position,
      p5.Vector.mult(
        this.target.velocity,
        Math.min(timeUntilImpact, this.maxEstimationTime)
      )
    );
    const evade = p5.Vector.sub(this.entity.position, estimatedPosition);
    evade.setMag(this.entity.maxSpeed);

    this.renders.target = estimatedPosition.copy();
    return evade;
  }

  render() {
    Renderer.drawCircle(this.renders.target, 3, createVector(255, 0, 255), 80);
  }
}

class Arrive extends AbstractTargetedSteeringBehavior {
  constructor(entity, target, freezeDistance, slowDistance) {
    super(entity, target);
    this.freezeDistance = freezeDistance;
    this.slowDistance = slowDistance;
  }

  calculate() {
    const distance = dist(
      this.entity.position.x,
      this.entity.position.y,
      this.target.position.x,
      this.target.position.y
    );
    const arrive = p5.Vector.sub(this.target.position, this.entity.position);
    if (distance >= this.slowDistance) {
      arrive.setMag(this.entity.maxSpeed);
    } else if (distance >= this.freezeDistance) {
      const speed = map(
        distance,
        this.freezeDistance,
        this.slowDistance,
        0,
        this.entity.maxSpeed
      );
      arrive.setMag(speed);
    } else {
      arrive.setMag(0);
    }
    return arrive;
  }
}

// Will freeze if the target comes too close, else it will slowly accelerate away
class FreezeFlee extends AbstractTargetedSteeringBehavior {
  constructor(entity, target, freezeDistance, slowDistance) {
    super(entity, target);
    this.freezeDistance = freezeDistance;
    this.slowDistance = slowDistance;
  }

  calculate() {
    const distance = dist(
      this.entity.position.x,
      this.entity.position.y,
      this.target.position.x,
      this.target.position.y
    );
    const freezeFlee = p5.Vector.sub(
      this.entity.position,
      this.target.position
    );
    if (distance >= this.slowDistance) {
      freezeFlee.setMag(this.entity.maxSpeed);
    } else if (distance >= this.freezeDistance) {
      const speed = map(
        distance,
        this.freezeDistance,
        this.slowDistance,
        0,
        this.entity.maxSpeed
      );
      freezeFlee.setMag(speed);
    } else {
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
  constructor(entity, flock, separationDistance) {
    super(entity, flock);
    this.separationDistance = separationDistance;
  }

  calculate() {
    this.partiality = 0;
    const separate = createVector(0, 0);
    for (let i = 0; i < this.flock.length; i++) {
      const distance = dist(
        this.entity.position.x,
        this.entity.position.y,
        this.flock[i].position.x,
        this.flock[i].position.y
      );
      const component = p5.Vector.sub(
        this.entity.position,
        this.flock[i].position
      );
      if (distance > 0 && distance < this.separationDistance) {
        this.partiality = 1;
        const speed = map(
          distance,
          this.separationDistance,
          0,
          0,
          this.entity.maxSpeed
        );
        component.setMag(speed);
      } else {
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
  constructor(entity, flock, separationDistance) {
    super(entity, flock);
    this.separationDistance = separationDistance;
  }

  calculate() {
    this.partiality = 0;
    const align = createVector(0, 0);
    let neighborAmount = 0;
    for (let i = 0; i < this.flock.length; i++) {
      const distance = dist(
        this.entity.position.x,
        this.entity.position.y,
        this.flock[i].position.x,
        this.flock[i].position.y
      );
      if (distance > 0 && distance < this.separationDistance) {
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
  constructor(entity, flock, separationDistance) {
    super(entity, flock);
    this.separationDistance = separationDistance;
  }

  calculate() {
    this.partiality = 0;
    const cohere = createVector(0, 0);
    let neighborAmount = 0;
    for (let i = 0; i < this.flock.length; i++) {
      const distance = dist(
        this.entity.position.x,
        this.entity.position.y,
        this.flock[i].position.x,
        this.flock[i].position.y
      );
      if (distance > 0 && distance < this.separationDistance) {
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
  constructor(entity, flock, referencePoint, separationDistance) {
    super(entity, flock);
    this.referencePoint = referencePoint;
    this.separationDistance = separationDistance;
  }

  updateReferencePoint(referencePoint) {
    this.referencePoint = referencePoint;
  }

  calculate() {
    this.partiality = 0;
    const straferate = createVector(0, 0);
    for (let i = 0; i < this.flock.length; i++) {
      const distance = dist(
        this.entity.position.x,
        this.entity.position.y,
        this.flock[i].position.x,
        this.flock[i].position.y
      );

      const toReferencePoint = p5.Vector.sub(
        this.referencePoint.position,
        this.entity.position
      );
      const toTarget = p5.Vector.sub(
        this.flock[i].position,
        this.entity.position
      );
      const orthogonalToReferencePoint = createVector(
        -toReferencePoint.y,
        toReferencePoint.x
      );

      // dot product:
      //  positive -> vectors have acute angle
      //  0 -> vectors are orthogonal
      //  negative -> vectors have obtuse angle
      const orthogonalAndToTargetDotProduct = p5.Vector.dot(
        toTarget,
        orthogonalToReferencePoint
      );
      const component =
        orthogonalAndToTargetDotProduct >= 0
          ? p5.Vector.mult(orthogonalToReferencePoint, -1)
          : p5.Vector.mult(orthogonalToReferencePoint, 1);

      if (distance > 0 && distance < this.separationDistance) {
        this.partiality = 1;
        const speed = map(
          distance,
          this.separationDistance,
          0,
          0,
          this.entity.maxSpeed
        );
        component.setMag(speed);
      } else {
        component.setMag(0);
      }
      straferate.add(component);
    }
    return straferate;
  }
}
