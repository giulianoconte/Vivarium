
let PI = 3.14159265;

class Renderer {
    constructor() {}

    render(drawing) {
        fill(drawing.color.x, drawing.color.y, drawing.color.z, 127);
        stroke(drawing.color.x * 0.67, drawing.color.y * 0.67, drawing.color.z * 0.67);

        switch (drawing.shape) {
            case Renderer.SHAPES.SQUARE:
            {
                let centerPoint = createVector(drawing.position.x, drawing.position.y);
                let point0 = createVector(drawing.position.x - drawing.size/2, drawing.position.y - drawing.size/2);
                let point1 = createVector(drawing.position.x + drawing.size/2, drawing.position.y - drawing.size/2);
                let point2 = createVector(drawing.position.x + drawing.size/2, drawing.position.y + drawing.size/2);
                let point3 = createVector(drawing.position.x - drawing.size/2, drawing.position.y + drawing.size/2);
                let originPoint0 = this.translate(point0, this.scale(centerPoint, -1));
                let originPoint1 = this.translate(point1, this.scale(centerPoint, -1));
                let originPoint2 = this.translate(point2, this.scale(centerPoint, -1));
                let originPoint3 = this.translate(point3, this.scale(centerPoint, -1));
                let rotatedOriginPoint0 = this.rotate(originPoint0, drawing.rotation);
                let rotatedOriginPoint1 = this.rotate(originPoint1, drawing.rotation);
                let rotatedOriginPoint2 = this.rotate(originPoint2, drawing.rotation);
                let rotatedOriginPoint3 = this.rotate(originPoint3, drawing.rotation);
                let rotatedPoint0 = this.translate(rotatedOriginPoint0, centerPoint);
                let rotatedPoint1 = this.translate(rotatedOriginPoint1, centerPoint);
                let rotatedPoint2 = this.translate(rotatedOriginPoint2, centerPoint);
                let rotatedPoint3 = this.translate(rotatedOriginPoint3, centerPoint);


                beginShape();
                vertex((WINDOW_CENTER_X + rotatedPoint0.x), (WINDOW_CENTER_Y - rotatedPoint0.y));
                vertex((WINDOW_CENTER_X + rotatedPoint1.x), (WINDOW_CENTER_Y - rotatedPoint1.y));
                vertex((WINDOW_CENTER_X + rotatedPoint2.x), (WINDOW_CENTER_Y - rotatedPoint2.y));
                vertex((WINDOW_CENTER_X + rotatedPoint3.x), (WINDOW_CENTER_Y - rotatedPoint3.y));
                endShape();
                break;
            }
            case Renderer.SHAPES.CIRCLE:
                ellipse(WINDOW_CENTER_X + drawing.position.x, WINDOW_CENTER_Y - drawing.position.y, drawing.size, drawing.size);
                break;
            case Renderer.SHAPES.TRIANGLE:
            {
                let centerPoint = createVector(drawing.position.x, drawing.position.y);
                let point0 = createVector(centerPoint.x + (drawing.size/2), centerPoint.y);
                let originPoint0 = this.translate(point0, this.scale(centerPoint, -1));
                let rotatedOriginPoint0 = this.rotate(originPoint0, drawing.rotation + (0*PI/3));
                let rotatedOriginPoint1 = this.rotate(rotatedOriginPoint0, (2*PI/3));
                let rotatedOriginPoint2 = this.rotate(rotatedOriginPoint0, (4*PI/3));
                let rotatedPoint0 = this.translate(rotatedOriginPoint0, centerPoint);
                let rotatedPoint1 = this.translate(rotatedOriginPoint1, centerPoint);
                let rotatedPoint2 = this.translate(rotatedOriginPoint2, centerPoint);

                triangle(
                    WINDOW_CENTER_X + rotatedPoint0.x, WINDOW_CENTER_Y - rotatedPoint0.y, 
                    WINDOW_CENTER_X + rotatedPoint1.x, WINDOW_CENTER_Y - rotatedPoint1.y, 
                    WINDOW_CENTER_X + rotatedPoint2.x, WINDOW_CENTER_Y - rotatedPoint2.y);
                break;
            }
            case Renderer.SHAPES.THIN_TRIANGLE:
            {
                let centerPoint = createVector(drawing.position.x, drawing.position.y);
                let point0 = createVector(centerPoint.x + (drawing.size/2), centerPoint.y);
                let originPoint0 = this.translate(point0, this.scale(centerPoint, -1));
                let rotatedOriginPoint0 = this.rotate(originPoint0, drawing.rotation + (0*PI/3));
                let rotatedOriginPoint1 = this.rotate(this.scale(rotatedOriginPoint0, 0.5), (2*PI/3));
                let rotatedOriginPoint2 = this.rotate(this.scale(rotatedOriginPoint0, 0.5), (4*PI/3));
                let rotatedPoint0 = this.translate(rotatedOriginPoint0, centerPoint);
                let rotatedPoint1 = this.translate(rotatedOriginPoint1, centerPoint);
                let rotatedPoint2 = this.translate(rotatedOriginPoint2, centerPoint);

                triangle(
                    WINDOW_CENTER_X + rotatedPoint0.x, WINDOW_CENTER_Y - rotatedPoint0.y, 
                    WINDOW_CENTER_X + rotatedPoint1.x, WINDOW_CENTER_Y - rotatedPoint1.y, 
                    WINDOW_CENTER_X + rotatedPoint2.x, WINDOW_CENTER_Y - rotatedPoint2.y);
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
        return createVector(vector.x*magnitude, vector.y*magnitude);
    }

    rotate(vector, radians) {
        return createVector(
            Math.cos(radians)*vector.x - Math.sin(radians)*vector.y, 
            Math.sin(radians)*vector.x + Math.cos(radians)*vector.y);
    }
}

Renderer.SHAPES = Object.freeze({ SQUARE: 0, CIRCLE: 1, TRIANGLE: 2, THIN_TRIANGLE: 3});