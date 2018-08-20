
class Navigator {
    constructor(gameObject) {
        this.gameObject = gameObject;
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
        let behavior = new Seek(this.gameObject, target);
        this.addDesire(id, weight, behavior);
    }

    addFlee(id, weight, target) {
        let behavior = new Flee(this.gameObject, target);
        this.addDesire(id, weight, behavior);
    }

    addArrive(id, weight, target) {
        let behavior = new Arrive(this.gameObject, target);
        this.addDesire(id, weight, behavior);
    }

    addFreezeFlee(id, weight, target) {
        let behavior = new FreezeFlee(this.gameObject, target);
        this.addDersire(id, weight, behavior);
    }

    addSeparate(id, weight, flock) {
        let behavior = new Separate(this.gameObject, flock);
        this.addDesire(id, weight, behavior);
    }

    addAlign(id, weight, flock) {
        let behavior = new Align(this.gameObject, flock);
        this.addDesire(id, weight, behavior);
    }

    addCohere(id, weight, flock) {
        let behavior = new Cohere(this.gameObject, flock);
        this.addDesire(id, weight, behavior);
    }

    addStraferate(id, weight, flock, referencePoint) {
        let behavior = new Straferate(this.gameObject, flock, referencePoint);
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
            desired.limit(this.gameObject.maxSpeed);
            let current = this.gameObject.velocity;
            let component = p5.Vector.sub(desired, current);
            this.desires[i].weightedResult = p5.Vector.mult(component, this.desires[i].weight);
            this.finalResult.add(this.desires[i].weightedResult);
        }
        this.finalResult.limit(this.gameObject.maxForce);
        return this.finalResult;
    }
    
    drawDesires() {
        for (let i = 0; i < this.desires.length; i++) {
            // console.log(`${this.desires[i].id}: ${this.desires[i].weightedResult}`);
            Renderer.drawLine(this.gameObject.position, p5.Vector.add(this.gameObject.position, p5.Vector.mult(this.desires[i].weightedResult, 4)), createVector(255, 0, 0), 100);
        }
        // console.log(`${this.finalResult}`);
        // console.log(`-----------`);
        Renderer.drawLine(this.gameObject.position, p5.Vector.add(this.gameObject.position, p5.Vector.mult(this.finalResult, 8 / this.gameObject.maxForce)), createVector(0, 255, 0), 150);
    }
}

Navigator.CALCULATE_MODES = Object.freeze({ WEIGHTED_SUM: 0, WEIGHTED_AVERAGE: 1});