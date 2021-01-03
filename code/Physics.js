class Physics {
  constructor(entity) {
    this.entity = entity;

    this.finalResult = createVector(0, 0);
    this.forces = [];
  }

  apply() {
    this.wraparoundBoundaries();
    for (let i = 0; i < game.entities.length; i++) {
      if (this.entity !== game.entities[i]) {
        if (this.isCollidingWith(game.entities[i])) {
          const difference = p5.Vector.sub(game.entities[i].position, this.entity.position);
          difference.limit(this.entity.size / 2);
          Renderer.drawCircle(
            difference.add(this.entity.position),
            this.entity.size / 3,
            createVector(200, 0, 0),
            255,
          );
        }
      }
    }
  }

  wraparoundBoundaries() {
    if (this.entity.position.x <= -1 * (WINDOW_CENTER_X + this.entity.drawing.size)) {
      this.entity.position.x += WINDOW_HEIGHT + this.entity.drawing.size;
    }
    if (this.entity.position.y <= -1 * (WINDOW_CENTER_Y + this.entity.drawing.size)) {
      this.entity.position.y += WINDOW_HEIGHT + this.entity.drawing.size;
    }
    if (this.entity.position.x >= 1 * (WINDOW_CENTER_X + this.entity.drawing.size)) {
      this.entity.position.x -= WINDOW_HEIGHT + this.entity.drawing.size;
    }
    if (this.entity.position.y >= 1 * (WINDOW_CENTER_Y + this.entity.drawing.size)) {
      this.entity.position.y -= WINDOW_HEIGHT + this.entity.drawing.size;
    }
  }

  isCollidingWith(otherEntity) {
    const difference = p5.Vector.sub(otherEntity.position, this.entity.position).mag();
    if (difference <= (this.entity.size + otherEntity.size) / 2) {
      return true;
    }

    return false;
  }

  isWithinDistanceOf(otherEntity, distance) {
    const difference = p5.Vector.sub(otherEntity.position, this.entity.position).mag();
    if (difference <= distance) {
      return true;
    }

    return false;
  }
}
