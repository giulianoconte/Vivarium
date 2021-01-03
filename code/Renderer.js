const PI = 3.14159265;

const RELATIVE_SQUARE_SIZE = 1.0;
const RELATIVE_CIRCLE_SIZE = 1.15;
const RELATIVE_TRIANGLE_SIZE = 1.5;
const RELATIVE_THIN_TRIANGLE_SIZE = 2.1;

/* exported Renderer */
class Renderer {
  constructor() {}

  render(drawing) {
    fill(drawing.color.x, drawing.color.y, drawing.color.z, 127);
    stroke(
      drawing.color.x * 0.67,
      drawing.color.y * 0.67,
      drawing.color.z * 0.67
    );

    switch (drawing.shape) {
      case Renderer.SHAPES.SQUARE: {
        const size = drawing.size * RELATIVE_SQUARE_SIZE;

        const centerPoint = createVector(
          drawing.position.x,
          drawing.position.y
        );
        const point0 = createVector(
          drawing.position.x - size / 2,
          drawing.position.y - size / 2
        );
        const point1 = createVector(
          drawing.position.x + size / 2,
          drawing.position.y - size / 2
        );
        const point2 = createVector(
          drawing.position.x + size / 2,
          drawing.position.y + size / 2
        );
        const point3 = createVector(
          drawing.position.x - size / 2,
          drawing.position.y + size / 2
        );
        const originPoint0 = this.translate(
          point0,
          this.scale(centerPoint, -1)
        );
        const originPoint1 = this.translate(
          point1,
          this.scale(centerPoint, -1)
        );
        const originPoint2 = this.translate(
          point2,
          this.scale(centerPoint, -1)
        );
        const originPoint3 = this.translate(
          point3,
          this.scale(centerPoint, -1)
        );
        const rotatedOriginPoint0 = this.rotate(originPoint0, drawing.rotation);
        const rotatedOriginPoint1 = this.rotate(originPoint1, drawing.rotation);
        const rotatedOriginPoint2 = this.rotate(originPoint2, drawing.rotation);
        const rotatedOriginPoint3 = this.rotate(originPoint3, drawing.rotation);
        const rotatedPoint0 = this.translate(rotatedOriginPoint0, centerPoint);
        const rotatedPoint1 = this.translate(rotatedOriginPoint1, centerPoint);
        const rotatedPoint2 = this.translate(rotatedOriginPoint2, centerPoint);
        const rotatedPoint3 = this.translate(rotatedOriginPoint3, centerPoint);

        beginShape();
        vertex(
          WINDOW_CENTER_X + rotatedPoint0.x,
          WINDOW_CENTER_Y - rotatedPoint0.y
        );
        vertex(
          WINDOW_CENTER_X + rotatedPoint1.x,
          WINDOW_CENTER_Y - rotatedPoint1.y
        );
        vertex(
          WINDOW_CENTER_X + rotatedPoint2.x,
          WINDOW_CENTER_Y - rotatedPoint2.y
        );
        vertex(
          WINDOW_CENTER_X + rotatedPoint3.x,
          WINDOW_CENTER_Y - rotatedPoint3.y
        );
        endShape();
        break;
      }
      case Renderer.SHAPES.CIRCLE:
        const size = drawing.size * RELATIVE_CIRCLE_SIZE;

        ellipse(
          WINDOW_CENTER_X + drawing.position.x,
          WINDOW_CENTER_Y - drawing.position.y,
          size,
          size
        );
        break;
      case Renderer.SHAPES.TRIANGLE: {
        const size = drawing.size * RELATIVE_TRIANGLE_SIZE;

        const centerPoint = createVector(
          drawing.position.x,
          drawing.position.y
        );
        const point0 = createVector(centerPoint.x + size / 2, centerPoint.y);
        const originPoint0 = this.translate(
          point0,
          this.scale(centerPoint, -1)
        );
        const rotatedOriginPoint0 = this.rotate(
          originPoint0,
          drawing.rotation + (0 * PI) / 3
        );
        const rotatedOriginPoint1 = this.rotate(
          rotatedOriginPoint0,
          (2 * PI) / 3
        );
        const rotatedOriginPoint2 = this.rotate(
          rotatedOriginPoint0,
          (4 * PI) / 3
        );
        const rotatedPoint0 = this.translate(rotatedOriginPoint0, centerPoint);
        const rotatedPoint1 = this.translate(rotatedOriginPoint1, centerPoint);
        const rotatedPoint2 = this.translate(rotatedOriginPoint2, centerPoint);

        triangle(
          WINDOW_CENTER_X + rotatedPoint0.x,
          WINDOW_CENTER_Y - rotatedPoint0.y,
          WINDOW_CENTER_X + rotatedPoint1.x,
          WINDOW_CENTER_Y - rotatedPoint1.y,
          WINDOW_CENTER_X + rotatedPoint2.x,
          WINDOW_CENTER_Y - rotatedPoint2.y
        );
        break;
      }
      case Renderer.SHAPES.THIN_TRIANGLE: {
        const size = drawing.size * RELATIVE_THIN_TRIANGLE_SIZE;

        const centerPoint = createVector(
          drawing.position.x,
          drawing.position.y
        );
        const point0 = createVector(centerPoint.x + size / 2, centerPoint.y);
        const originPoint0 = this.translate(
          point0,
          this.scale(centerPoint, -1)
        );
        const rotatedOriginPoint0 = this.rotate(
          originPoint0,
          drawing.rotation + (0 * PI) / 3
        );
        const rotatedOriginPoint1 = this.rotate(
          this.scale(rotatedOriginPoint0, 0.5),
          (2 * PI) / 3
        );
        const rotatedOriginPoint2 = this.rotate(
          this.scale(rotatedOriginPoint0, 0.5),
          (4 * PI) / 3
        );
        const rotatedPoint0 = this.translate(rotatedOriginPoint0, centerPoint);
        const rotatedPoint1 = this.translate(rotatedOriginPoint1, centerPoint);
        const rotatedPoint2 = this.translate(rotatedOriginPoint2, centerPoint);

        triangle(
          WINDOW_CENTER_X + rotatedPoint0.x,
          WINDOW_CENTER_Y - rotatedPoint0.y,
          WINDOW_CENTER_X + rotatedPoint1.x,
          WINDOW_CENTER_Y - rotatedPoint1.y,
          WINDOW_CENTER_X + rotatedPoint2.x,
          WINDOW_CENTER_Y - rotatedPoint2.y
        );
        break;
      }
      default:
        break;
    }
  }

  translate(vector1, vector2) {
    return createVector(vector1.x + vector2.x, vector1.y + vector2.y);
  }

  scale(vector, magnitude) {
    return createVector(vector.x * magnitude, vector.y * magnitude);
  }

  rotate(vector, radians) {
    return createVector(
      Math.cos(radians) * vector.x - Math.sin(radians) * vector.y,
      Math.sin(radians) * vector.x + Math.cos(radians) * vector.y
    );
  }
}

// TODO: Add Renderer.COLORS for useful primary-like colors.
// Accessed like: color = Renderer.COLORS.LIGHT_BLUE;

Renderer.SHAPES = Object.freeze({
  SQUARE: 0,
  CIRCLE: 1,
  TRIANGLE: 2,
  THIN_TRIANGLE: 3,
});

Renderer.drawLine = function (a, b, color, alpha) {
  stroke(color.x, color.y, color.z, alpha);
  line(
    WINDOW_CENTER_X + a.x,
    WINDOW_CENTER_Y - a.y,
    WINDOW_CENTER_X + b.x,
    WINDOW_CENTER_Y - b.y
  );
};

Renderer.drawCircle = function (position, radius, color, alpha) {
  stroke(color.x, color.y, color.z, alpha);
  fill(color.x, color.y, color.z, alpha);
  ellipse(
    WINDOW_CENTER_X + position.x,
    WINDOW_CENTER_Y - position.y,
    radius * 2,
    radius * 2
  );
};
