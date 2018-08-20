
class Navigator {
    constructor(entity) {
        this.entity = entity;
        this.calculateMode = Navigator.CALCULATE_MODES.WEIGHTED_SUM;

        this.finalResult = createVector(0, 0);
        this.desires = [];
    }

    update() {
        let entityPositions = [];
    }

    addDesire(id_, weight_, steeringBehavior_) {
        this.desires.push({id: id_, weight: weight_, behavior: steeringBehavior_, result: createVector(0, 0), weightedResult: createVector(0, 0)});
    }

    addSeek(id, weight, target) {
        let behavior = new Seek(this.entity, target);
        this.addDesire(id, weight, behavior);
    }

    addFlee(id, weight, target) {
        let behavior = new Flee(this.entity, target);
        this.addDesire(id, weight, behavior);
    }

    addArrive(id, weight, target) {
        let behavior = new Arrive(this.entity, target);
        this.addDesire(id, weight, behavior);
    }

    addFreezeFlee(id, weight, target) {
        let behavior = new FreezeFlee(this.entity, target);
        this.addDersire(id, weight, behavior);
    }

    addSeparate(id, weight, flock) {
        let behavior = new Separate(this.entity, flock);
        this.addDesire(id, weight, behavior);
    }

    addAlign(id, weight, flock) {
        let behavior = new Align(this.entity, flock);
        this.addDesire(id, weight, behavior);
    }

    addCohere(id, weight, flock) {
        let behavior = new Cohere(this.entity, flock);
        this.addDesire(id, weight, behavior);
    }

    addStraferate(id, weight, flock, referencePoint) {
        let behavior = new Straferate(this.entity, flock, referencePoint);
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

    calculateWeightedAverage() {
        this.finalResult = createVector(0, 0);
        let totalWeight = 0;
        for (let i = 0; i < this.desires.length; i++) {
            this.desires[i].result = this.desires[i].behavior.calculate();
            this.desires[i].weightedResult = p5.Vector.mult(this.desires[i].result, this.desires[i].weight);
            this.finalResult.add(this.desires[i].weightedResult);
            totalWeight += this.desires[i].weight;
        }
        if (totalWeight !== 0) {
            this.finalResult.mult(1.0 / totalWeight);
        }
        return this.finalResult;
    }

    calculateWeightedSum() {
        this.finalResult = createVector(0, 0);
        for (let i = 0; i < this.desires.length; i++) {
            this.desires[i].result = this.desires[i].behavior.calculate();
            this.desires[i].weightedResult = p5.Vector.mult(this.desires[i].result, this.desires[i].weight);
            this.finalResult.add(this.desires[i].weightedResult);
        }
        return this.finalResult;
    }

    chooseDesiredAcceleration() {
        return this.calculateWeightedSumAsForce();
    }
    
    calculateWeightedSumAsForce() {
        this.finalResult = createVector(0, 0);
        for (let i = 0; i < this.desires.length; i++) {
            this.desires[i].result = this.desires[i].behavior.calculate();
            let desired = this.desires[i].result;
            desired.limit(this.entity.maxSpeed);
            let current = this.entity.velocity;
            let component = p5.Vector.sub(desired, current);
            this.desires[i].weightedResult = p5.Vector.mult(component, this.desires[i].weight*this.desires[i].behavior.partiality);
            this.finalResult.add(this.desires[i].weightedResult);
        }
        this.finalResult.limit(this.entity.maxForce);
        return this.finalResult;
    }
    
    drawDesires() {
        for (let i = 0; i < this.desires.length; i++) {
            // console.log(`${this.desires[i].id}: ${this.desires[i].weightedResult}`);
            Renderer.drawLine(this.entity.position, p5.Vector.add(this.entity.position, p5.Vector.mult(this.desires[i].weightedResult, 4)), createVector(255, 0, 0), 100);
        }
        // console.log(`${this.finalResult}`);
        // console.log(`-----------`);
        Renderer.drawLine(this.entity.position, p5.Vector.add(this.entity.position, p5.Vector.mult(this.finalResult, 8 / this.entity.maxForce)), createVector(0, 255, 0), 150);
    }
}

Navigator.CALCULATE_MODES = Object.freeze({ WEIGHTED_SUM: 0, WEIGHTED_AVERAGE: 1});