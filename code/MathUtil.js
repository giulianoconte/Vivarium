class MathUtil {
  static rotateVector(vector, theta) {
    return createVector(
      vector.x * cos(theta) - vector.y * sin(theta),
      vector.y * cos(theta) + vector.x * sin(theta)
    );
  }

  static getTheta(vector) {
    return atan2(vector.y, vector.x);
  }
}
