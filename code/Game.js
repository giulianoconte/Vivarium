/*
Game
*/

class Game {
  constructor(input, renderer) {
    this.input = input;
    this.renderer = renderer;

    this.entities = [];
  }

  initialize() {
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

  getInput() {
    this.input.update();
  }

  update() {
    if (this.input.mouse.left.isPressed()) {
      console.log('ayy');
    }
    if (this.input.key(Key.CODES.GRAVE_ACCENT).isPressed()) {
      console.log('lmao');
      for (let i = 0; i < this.entities.length; i++) {
        this.entities[i].toggleNavigationRendering();
      }
    }
    if (this.input.key(Key.CODES.ENTER).isPressed()) {
      console.log('enter lmamama');
    }
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].update();
    }
  }

  render() {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].render();
    }
  }
}
