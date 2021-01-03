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
    const entityBoundaryAmount = 80;
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
    entityA.navigator.addFlee('flee', 0.5, entityB);
    // entityA.navigator.addSeparate('separate', 1.0, boundaryFlock, 60);
    // this.entities.push(entityA);
    entityB.navigator.addPursue('pursue', 0.5, entityA, 20);
    // entityB.navigator.addSeparate('separate', 1.0, boundaryFlock, 60);
    // this.entities.push(entityB);
    const entityC = Entity.createEntity(
      random(-WINDOW_CENTER_X / 2, WINDOW_CENTER_X / 2),
      random(-WINDOW_CENTER_Y / 2, WINDOW_CENTER_Y / 2)
    );
    // TODO: Why does wander+separate require drastic tuning? Expect wander:1 and separate:2 to be close good enough!
    entityC.navigator.addWander('wander', 1.0, 15, 0.7);
    entityC.navigator.addSeparate('separate', 50.0, boundaryFlock, 80);
    this.entities.push(entityC);

    // Add flock of AI.
    const entityAmount = 0;
    for (let i = 0; i < entityAmount; i++) {
      this.entities.push(
        Entity.createEntity(
          random(-WINDOW_CENTER_X, WINDOW_CENTER_X),
          random(-WINDOW_CENTER_Y, WINDOW_CENTER_Y)
        )
      );
    }
    for (let i = 0; i < entityAmount; i++) {
      // Epic attacking dodging
      // this.entities[i].navigator.addWander('wander', 0.1, 50, 1);
      // this.entities[i].navigator.addPursue(
      //   'pursue',
      //   1,
      //   this.entities[(i + 1) % entityAmount],
      //   20
      // );
      // this.entities[i].navigator.addEvade(
      //   'evade',
      //   1,
      //   this.entities[(i + entityAmount - 1) % entityAmount],
      //   20
      // );
      //
      // Classic flocking
      // this.entities[i].navigator.addSeek('seek', 1, this.entities[(i + 1) % entityAmount].position);
      // this.entities[i].navigator.addFlee('flee', 1, this.entities[(i + entityAmount - 1) % entityAmount].position);
      // this.entities[i].navigator.addArrive('arrive', 1, this.entities[(i + 1) % entityAmount].position, 50, 5000);
      //
      // Cursor circle ritual
      // this.entities[i].navigator.addSeek('seek', 3, this.input.mousePosition);
      // this.entities[i].navigator.addArrive('arrive', 1.2, this.input.mousePosition, 0, 200);
      // this.entities[i].navigator.addFlee('flee', 1, this.input.mousePosition);
      // this.entities[i].navigator.addStraferate(
      //   'straferate',
      //   1,
      //   this.entities,
      //   this.input.mousePosition,
      //   100,
      // );
      //
      // Wandering flocking
      // this.entities[i].navigator.addWander('wander', 0.1, 50, 0.2);
      // this.entities[i].navigator.addSeparate('separate', 3, this.entities, 30);
      // this.entities[i].navigator.addAlign('align', 1, this.entities, 50);
      // this.entities[i].navigator.addCohere('cohere', 1, this.entities, 25);
      //
      // Avoid boundary flock if exists.
      // this.entities[i].navigator.addSeparate(
      //   'separate',
      //   1.0,
      //   boundaryFlock,
      //   30
      // );
    }
  }

  getInput() {
    this.input.update();
  }

  update() {
    if (this.input.mouseLeftStatus === 1) {
      console.log('ayy');
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
