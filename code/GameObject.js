
class GameObject {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.position = createVector(x, y);
        
        this.direction = Math.atan(this.velocity.y/this.velocity.x);
        if (isNaN(this.direction)) {
            this.direction = 0;
        }

        let shape = Renderer.SHAPES.SQUARE;
        let color = createVector(204, 101, 192);
        this.drawing = new Drawing(shape, 50, color, this.position, this.direction);
    }

    update() {
        this.direction += 0.02;
        while (this.direction >= 2*PI) {
            this.direction -= 2*PI;
        }
        this.drawing.rotation = this.direction;

        if (this.direction >= 3*PI/2) {
            this.drawing.shape = Renderer.SHAPES.SQUARE;
        }
        else if (this.direction >= 2*PI/2) {
            this.drawing.shape = Renderer.SHAPES.CIRCLE;
        }
        else if (this.direction >= 1*PI/2) {
            this.drawing.shape = Renderer.SHAPES.TRIANGLE;
        }
        else if (this.direction >= 0*PI/2) {
            this.drawing.shape = Renderer.SHAPES.THIN_TRIANGLE;
        }
    }
}