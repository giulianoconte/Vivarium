class GameState {
  constructor(mouse) {
    this.mouse = mouse;
    this.entities = [];
  }

  clear() {
    let n = 0;
    const { length } = this.entities;
    for (let i = 0; i < length; i++) {
      this.entities.pop();
      n++;
    }
  }
}
