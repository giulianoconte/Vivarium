class Navigator {
  constructor(entity) {
    this.entity = entity;
    this.calculateMode = Navigator.CALCULATE_MODES.WEIGHTED_AVERAGE;

    this.finalResult = createVector(0, 0);
    this.desires = [];
  }

  addDesire(id_, weight_, steeringBehavior_) {
    this.desires.push({
      id: id_,
      weight: weight_,
      behavior: steeringBehavior_,
      result: createVector(0, 0),
      weightedResult: createVector(0, 0),
    });
  }

  addWander(id, weight, turnStrength, turnChangeRate) {
    const behavior = new Wander(this.entity, turnStrength, turnChangeRate);
    this.addDesire(id, weight, behavior);
  }

  addSeek(id, weight, target) {
    const behavior = new Seek(this.entity, target);
    this.addDesire(id, weight, behavior);
  }

  addFlee(id, weight, target) {
    const behavior = new Flee(this.entity, target);
    this.addDesire(id, weight, behavior);
  }

  addArrive(id, weight, target, freezeDistance, slowDistance) {
    const behavior = new Arrive(
      this.entity,
      target,
      freezeDistance,
      slowDistance
    );
    this.addDesire(id, weight, behavior);
  }

  addFreezeFlee(id, weight, target, freezeDistance, slowDistance) {
    const behavior = new FreezeFlee(
      this.entity,
      target,
      freezeDistance,
      slowDistance
    );
    this.addDesire(id, weight, behavior);
  }

  addPursue(id, weight, target, maxEstimationTime) {
    const behavior = new Pursue(this.entity, target, maxEstimationTime);
    this.addDesire(id, weight, behavior);
  }

  addEvade(id, weight, target, maxEstimationTime) {
    const behavior = new Evade(this.entity, target, maxEstimationTime);
    this.addDesire(id, weight, behavior);
  }

  addSeparate(id, weight, flock, separationDistance) {
    const behavior = new Separate(this.entity, flock, separationDistance);
    this.addDesire(id, weight, behavior);
  }

  addAlign(id, weight, flock, separationDistance) {
    const behavior = new Align(this.entity, flock, separationDistance);
    this.addDesire(id, weight, behavior);
  }

  addCohere(id, weight, flock, separationDistance) {
    const behavior = new Cohere(this.entity, flock, separationDistance);
    this.addDesire(id, weight, behavior);
  }

  addStraferate(id, weight, flock, referencePoint, separationDistance) {
    const behavior = new Straferate(
      this.entity,
      flock,
      referencePoint,
      separationDistance
    );
    this.addDesire(id, weight, behavior);
  }

  chooseDesiredVelocity() {
    let desired;
    switch (this.calculateMode) {
      case Navigator.CALCULATE_MODES.WEIGHTED_SUM:
        desired = this.calculateWeightedSum();
        break;
      case Navigator.CALCULATE_MODES.WEIGHTED_AVERAGE:
        desired = this.calculateWeightedAverage();
        break;
      default:
        desired = this.calculateWeightedSum();
        break;
    }
    return desired;
  }

  // Document the pros and cons of weighted average vs weighted sum of desires.
  calculateWeightedAverage() {
    this.finalResult = createVector(0, 0);
    let totalWeight = 0;
    for (let i = 0; i < this.desires.length; i++) {
      const desire = this.desires[i].behavior.calculate();
      this.desires[i].result = desire;
      const adjustedWeight =
        this.desires[i].weight * this.desires[i].behavior.partiality;
      const weightedResult = p5.Vector.mult(desire, adjustedWeight);
      this.desires[i].weightedResult = weightedResult;
      this.finalResult.add(this.desires[i].weightedResult);
      totalWeight += adjustedWeight;
    }
    if (totalWeight !== 0) {
      this.finalResult.mult(1.0 / totalWeight);
    } else {
      this.finalResult = this.entity.velocity;
    }
    return this.finalResult;
  }

  calculateWeightedSum() {
    this.finalResult = createVector(0, 0);
    let totalWeight = 0;
    for (let i = 0; i < this.desires.length; i++) {
      const desire = this.desires[i].behavior.calculate();
      this.desires[i].result = desire;
      const adjustedWeight =
        this.desires[i].weight * this.desires[i].behavior.partiality;
      const weightedResult = p5.Vector.mult(desire, adjustedWeight);
      this.desires[i].weightedResult = weightedResult;
      this.finalResult.add(this.desires[i].weightedResult);
      totalWeight += adjustedWeight;
    }
    if (totalWeight !== 0) {
    } else {
      this.finalResult = this.entity.velocity;
    }
    return this.finalResult;
  }
}

Navigator.CALCULATE_MODES = Object.freeze({
  WEIGHTED_SUM: 0,
  WEIGHTED_AVERAGE: 1,
});
