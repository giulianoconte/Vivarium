
class Physics {
    constructor(entity) {
        this.entity = entity;

        this.finalResult = createVector(0, 0);
        this.forces = [];
    }

    apply() {
        this.wraparoundBoundaries();
    }

    wraparoundBoundaries() {
        if (this.entity.position.x <= -1 * (WINDOW_CENTER_X + this.entity.drawing.size)) {
            this.entity.position.x += (WINDOW_HEIGHT + this.entity.drawing.size);
        }
        if (this.entity.position.y <= -1 * (WINDOW_CENTER_Y + this.entity.drawing.size)) {
            this.entity.position.y += (WINDOW_HEIGHT + this.entity.drawing.size);
        }
        if (this.entity.position.x >= 1 * (WINDOW_CENTER_X + this.entity.drawing.size)) {
            this.entity.position.x -= (WINDOW_HEIGHT + this.entity.drawing.size);
        }
        if (this.entity.position.y >= 1 * (WINDOW_CENTER_Y + this.entity.drawing.size)) {
            this.entity.position.y -= (WINDOW_HEIGHT + this.entity.drawing.size);
        }
    }
}