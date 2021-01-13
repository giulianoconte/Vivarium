class Scenario {
  constructor(gameState) {
    this.gs = gameState;
    this.entities = this.gs.entities;
  }

  set(scenario) {
    switch (scenario) {
      case Scenario.SCENARIOS.TEST_1:
        this.gs.clear();
        this.test1();
        break;
      case Scenario.SCENARIOS.FLOCKING_1:
        this.gs.clear();
        this.flocking1();
        break;
      case Scenario.SCENARIOS.FLOCKING_2:
        this.gs.clear();
        this.flocking2();
        break;
      case Scenario.SCENARIOS.FLOCKING_OBSTACLES:
        this.gs.clear();
        this.flockingObstacles();
        break;
      case Scenario.SCENARIOS.SEEK_PURSUE:
        this.gs.clear();
        this.seekPursue();
        break;
      case Scenario.SCENARIOS.CIRCLE_RITUAL:
        this.gs.clear();
        this.circleRitual();
        break;
      default:
        console.warn(`Could not find scenario matching ${scenario}`);
        break;
    }
  }

  test1() {
    console.log(`hello: ${this.gs.entities.length}`);
    // textSize(32);
    // text('word', 10, 30);
  }

  flocking1() {
    // Create boundary flock to keep entities within.
    const entityBoundaryAmount = 0;
    let theta = 0;
    const boundaryFlock = [];
    for (let i = 0; i < entityBoundaryAmount; i++) {
      theta += (2 * PI) / entityBoundaryAmount;
      const newEntityX = cos(theta) * WINDOW_CENTER_X * 0.9;
      const newEntityY = sin(theta) * WINDOW_CENTER_Y * 0.9;
      const newEntity = Entity.createEntityWithShape(
        newEntityX,
        newEntityY,
        Renderer.SHAPES.CIRCLE
      );
      boundaryFlock.push(newEntity);
      this.entities.push(boundaryFlock[i]);
    }

    // Add flock of AI.
    const agentAmount = 64;
    const agentFlock = [];
    for (let i = 0; i < agentAmount; i++) {
      const agent = Entity.createEntity(
        random(-WINDOW_CENTER_X, WINDOW_CENTER_X),
        random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)
      );
      agentFlock.push(agent);
      this.entities.push(agentFlock[i]);
    }
    for (let i = 0; i < agentAmount; i++) {
      // Wandering flocking
      agentFlock[i].navigation.addWander('wander', 1.0, 15, 0.7);
      agentFlock[i].navigation.addSeparate('separate', 24, this.entities, 30);
      agentFlock[i].navigation.addAlign('align', 8, this.entities, 50);
      agentFlock[i].navigation.addCohere('cohere', 8, this.entities, 25);

      // Avoid boundary flock if exists.
      agentFlock[i].navigation.addSeparate(
        'separate',
        10.0,
        boundaryFlock,
        120
      );
    }
  }

  flocking2() {
    // Create boundary flock to keep entities within.
    const entityBoundaryAmount = 32;
    let theta = 0;
    const boundaryFlock = [];
    for (let i = 0; i < entityBoundaryAmount; i++) {
      theta += (2 * PI) / entityBoundaryAmount;
      const newEntityX = cos(theta) * WINDOW_CENTER_X * 0.9;
      const newEntityY = sin(theta) * WINDOW_CENTER_Y * 0.9;
      const newEntity = Entity.createEntityWithShape(
        newEntityX,
        newEntityY,
        Renderer.SHAPES.CIRCLE
      );
      boundaryFlock.push(newEntity);
      this.entities.push(boundaryFlock[i]);
    }

    // Add flock of AI.
    const agentAmount = 32;
    const agentFlock = [];
    for (let i = 0; i < agentAmount; i++) {
      const agent = Entity.createEntity(
        random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
        random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
      );
      agentFlock.push(agent);
      this.entities.push(agentFlock[i]);
    }
    for (let i = 0; i < agentAmount; i++) {
      // Wandering flocking
      agentFlock[i].navigation.addWander('wander', 1.0, 15, 0.7);
      agentFlock[i].navigation.addSeparate('separate', 24, this.entities, 30);
      agentFlock[i].navigation.addAlign('align', 8, this.entities, 50);
      agentFlock[i].navigation.addCohere('cohere', 8, this.entities, 25);

      // Avoid boundary flock if exists.
      agentFlock[i].navigation.addSeparate(
        'separate',
        10.0,
        boundaryFlock,
        120
      );
    }
  }

  flockingObstacles() {
    // Create boundary flock to keep entities within.
    const entityBoundaryAmount = 5;
    let theta = 0;
    const boundaryFlock = [];
    for (let i = 0; i < entityBoundaryAmount; i++) {
      theta += (2 * PI) / entityBoundaryAmount;
      const newEntityX = cos(theta) * WINDOW_CENTER_X * 0.9;
      const newEntityY = sin(theta) * WINDOW_CENTER_Y * 0.9;
      const newEntity = Entity.createEntityWithShape(
        newEntityX,
        newEntityY,
        Renderer.SHAPES.CIRCLE
      );
      newEntity.velocity = createVector(random(3) - 3 / 2, random(3) - 3 / 2);
      newEntity.setSize(65);
      boundaryFlock.push(newEntity);
      this.entities.push(boundaryFlock[i]);
    }

    // Add flock of AI.
    const agentAmount = 80;
    const agentFlock = [];
    for (let i = 0; i < agentAmount; i++) {
      const agent = Entity.createEntity(
        random(-WINDOW_CENTER_X, WINDOW_CENTER_X),
        random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)
      );
      agent.maxSpeed = 4;
      agent.maxForce = 0.2;
      agentFlock.push(agent);
      this.entities.push(agentFlock[i]);
    }
    for (let i = 0; i < agentAmount; i++) {
      // Wandering flocking
      agentFlock[i].navigation.addWander('wander', 1.0, 15, 0.7);
      agentFlock[i].navigation.addSeparate('separate', 24, this.entities, 30);
      agentFlock[i].navigation.addAlign('align', 8, this.entities, 50);
      agentFlock[i].navigation.addCohere('cohere', 8, this.entities, 25);

      // Avoid boundary flock if exists.
      agentFlock[i].navigation.addSeparate(
        'separate',
        12.0,
        boundaryFlock,
        480
      );
    }
  }

  seekPursue() {
    // Create boundary flock to keep entities within.
    const entityBoundaryAmount = 12;
    let theta = 0;
    const boundaryFlock = [];
    for (let i = 0; i < entityBoundaryAmount; i++) {
      theta += (2 * PI) / entityBoundaryAmount;
      const newEntityX = cos(theta) * WINDOW_CENTER_X * 0.9;
      const newEntityY = sin(theta) * WINDOW_CENTER_Y * 0.9;
      const newEntity = Entity.createEntityWithShape(
        newEntityX,
        newEntityY,
        Renderer.SHAPES.CIRCLE
      );
      boundaryFlock.push(newEntity);
      this.entities.push(boundaryFlock[i]);
    }
    const entityA = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    const entityB = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    const entityC = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    entityA.navigation.addWander('wander', 1.0, 15, 0.7);
    entityA.maxSpeed = 4;
    entityA.navigation.addSeparate('separate', 10.0, boundaryFlock, 60);
    this.entities.push(entityA);
    // TODO: Why does the entity slow down when it has conflicting desire directions?
    entityB.navigation.addSeek('seek', 1.0, entityA);
    entityB.navigation.addSeparate('separate', 10.0, boundaryFlock, 60);
    this.entities.push(entityB);
    entityC.navigation.addPursue('pursue', 1.0, entityA, 10);
    entityC.navigation.addSeparate('separate', 10.0, boundaryFlock, 60);
    this.entities.push(entityC);

    // Add flock of AI.
    const agentAmount = 0;
    const agentFlock = [];
    for (let i = 0; i < agentAmount; i++) {
      const agent = Entity.createEntity(
        random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
        random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
      );
      agentFlock.push(agent);
      this.entities.push(agentFlock[i]);
    }
    for (let i = 0; i < agentAmount; i++) {
      // Avoid boundary flock if exists.
      agentFlock[i].navigation.addSeparate(
        'separate',
        10.0,
        boundaryFlock,
        120
      );
    }
  }

  circleRitual() {
    // Create boundary flock to keep entities within.
    const entityBoundaryAmount = 0;
    let theta = 0;
    const boundaryFlock = [];
    for (let i = 0; i < entityBoundaryAmount; i++) {
      theta += (2 * PI) / entityBoundaryAmount;
      const newEntityX = cos(theta) * WINDOW_CENTER_X * 0.9;
      const newEntityY = sin(theta) * WINDOW_CENTER_Y * 0.9;
      const newEntity = Entity.createEntityWithShape(
        newEntityX,
        newEntityY,
        Renderer.SHAPES.CIRCLE
      );
      boundaryFlock.push(newEntity);
      this.entities.push(boundaryFlock[i]);
    }

    // Add flock of AI.
    const agentAmount = 24;
    const agentFlock = [];
    for (let i = 0; i < agentAmount; i++) {
      const agent = Entity.createEntity(
        random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
        random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
      );
      agentFlock.push(agent);
      this.entities.push(agentFlock[i]);
    }
    for (let i = 0; i < agentAmount; i++) {
      // Cursor circle ritual
      agentFlock[i].navigation.addSeek('seek', 3, this.gs.mouse);
      agentFlock[i].navigation.addArrive('arrive', 1.2, this.gs.mouse, 0, 200);
      agentFlock[i].navigation.addFlee('flee', 1, this.gs.mouse);
      agentFlock[i].navigation.addStraferate(
        'straferate',
        1,
        this.entities,
        this.gs.mouse,
        100
      );

      // Avoid boundary flock if exists.
      agentFlock[i].navigation.addSeparate(
        'separate',
        10.0,
        boundaryFlock,
        120
      );
    }
  }

  copyPasteOldScenario() {
    // Create boundary flock to keep entities within.
    const entityBoundaryAmount = 12;
    let theta = 0;
    const boundaryFlock = [];
    for (let i = 0; i < entityBoundaryAmount; i++) {
      theta += (2 * PI) / entityBoundaryAmount;
      const newEntityX = cos(theta) * WINDOW_CENTER_X * 0.9;
      const newEntityY = sin(theta) * WINDOW_CENTER_Y * 0.9;
      const newEntity = Entity.createEntityWithShape(
        newEntityX,
        newEntityY,
        Renderer.SHAPES.CIRCLE
      );
      boundaryFlock.push(newEntity);
      this.entities.push(boundaryFlock[i]);
    }
    const entityA = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    const entityB = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    const entityC = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    entityA.navigation.addWander('wander', 1.0, 15, 0.7);
    entityA.maxSpeed = 4;
    entityA.navigation.addSeparate('separate', 10.0, boundaryFlock, 60);
    this.entities.push(entityA);
    // entityB.navigation.addPursue('pursue', 1.0, entityA, 20);
    // TODO: Why does the entity slow down when it has conflicting desire directions?
    entityB.navigation.addSeek('seek', 1.0, entityA);
    entityB.navigation.addSeparate('separate', 10.0, boundaryFlock, 60);
    this.entities.push(entityB);
    // entityC.navigation.addPursue('pursue', 1.0, entityB, 20);
    entityC.navigation.addPursue('pursue', 1.0, entityA, 10);
    entityC.navigation.addSeparate('separate', 10.0, boundaryFlock, 60);
    this.entities.push(entityC);

    // const entityZ = Entity.createEntity(
    //   random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
    //   random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    // );
    // // TODO: Why does wander+separate require drastic tuning? Expect wander:1 and separate:2 to be close to good enough!
    // entityZ.navigation.addWander('wander', 1.0, 15, 0.7);
    // entityZ.navigation.addSeparate('separate', 10.0, boundaryFlock, 120);
    // this.entities.push(entityZ);

    // const entityMouse = Entity.createEntity(
    //   random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
    //   random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    // );
    // entityMouse.navigation.addSeek('seek', 1.0, this.input.mouse);
    // this.entities.push(entityMouse);

    // Add flock of AI.
    const agentAmount = 0;
    const agentFlock = [];
    for (let i = 0; i < agentAmount; i++) {
      const agent = Entity.createEntity(
        random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
        random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
      );
      agentFlock.push(agent);
      this.entities.push(agentFlock[i]);
    }
    for (let i = 0; i < agentAmount; i++) {
      // agentFlock[i].navigation.addWander('wander', 1.0, 15, 0.7);

      // Epic attacking dodging
      // agentFlock[i].navigation.addWander('wander', 0.1, 50, 1);
      // agentFlock[i].navigation.addPursue(
      //   'pursue',
      //   1,
      //   agentFlock[(i + 1) % agentAmount],
      //   20
      // );
      // agentFlock[i].navigation.addEvade(
      //   'evade',
      //   1,
      //   agentFlock[(i + agentAmount - 1) % agentAmount],
      //   20
      // );
      //
      // Movement noise
      // agentFlock[i].navigation.addSeek(
      //   'seek',
      //   1,
      //   agentFlock[(i + 1) % agentAmount]
      // );
      // agentFlock[i].navigation.addFlee(
      //   'flee',
      //   1,
      //   agentFlock[(i + agentAmount - 1) % agentAmount]
      // );
      // agentFlock[i].navigation.addArrive(
      //   'arrive',
      //   1,
      //   agentFlock[(i + 1) % agentAmount],
      //   50,
      //   5000
      // );
      //
      // Cursor circle ritual
      // agentFlock[i].navigation.addSeek('seek', 3, this.input.mouse);
      // agentFlock[i].navigation.addArrive('arrive', 1.2, this.input.mouse, 0, 200);
      // agentFlock[i].navigation.addFlee('flee', 1, this.input.mouse);
      // agentFlock[i].navigation.addStraferate(
      //   'straferate',
      //   1,
      //   this.entities,
      //   this.input.mouse,
      //   100,
      // );
      //
      // Wandering flocking
      // agentFlock[i].navigation.addWander('wander', 1.0, 15, 0.7);
      // agentFlock[i].navigation.addSeparate('separate', 24, this.entities, 30);
      // agentFlock[i].navigation.addAlign('align', 8, this.entities, 50);
      // agentFlock[i].navigation.addCohere('cohere', 8, this.entities, 25);

      // Avoid boundary flock if exists.
      agentFlock[i].navigation.addSeparate(
        'separate',
        10.0,
        boundaryFlock,
        120
      );
    }
  }
}

Scenario.SCENARIOS = Object.freeze({
  FLOCKING_1: 0,
  FLOCKING_2: 1,
  FLOCKING_OBSTACLES: 2,
  SEEK_PURSUE: 3,
  CIRCLE_RITUAL: 4,
  TEST_1: 101,
});
