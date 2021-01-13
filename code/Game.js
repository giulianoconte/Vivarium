/*
Game
*/

class Game {
  constructor(input, renderer) {
    this.input = input;
    this.renderer = renderer;
    this.gs = new GameState(this.input.mouse);
    this.scenario = new Scenario(this.gs);

    this.entities = this.gs.entities;
  }

  initialize() {
    this.scenario.set(Scenario.SCENARIOS.SEEK_PURSUE);
  }

  getInput() {
    this.input.update();
  }

  update() {
    if (this.input.key(Key.CODES.D_0).isPressed()) {
      this.scenario.set(Scenario.SCENARIOS.TEST_1);
    }
    if (this.input.key(Key.CODES.D_1).isPressed()) {
      this.scenario.set(Scenario.SCENARIOS.FLOCKING_1);
    }
    if (this.input.key(Key.CODES.D_2).isPressed()) {
      this.scenario.set(Scenario.SCENARIOS.FLOCKING_2);
    }
    if (this.input.key(Key.CODES.D_3).isPressed()) {
      this.scenario.set(Scenario.SCENARIOS.SEEK_PURSUE);
    }
    if (this.input.key(Key.CODES.D_4).isPressed()) {
      this.scenario.set(Scenario.SCENARIOS.CIRCLE_RITUAL);
    }
    if (this.input.key(Key.CODES.D_5).isPressed()) {
      this.scenario.set(Scenario.SCENARIOS.FLOCKING_OBSTACLES);
    }
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
