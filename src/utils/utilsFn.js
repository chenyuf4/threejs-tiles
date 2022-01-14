import * as THREE from "three";
import { DISTANCE_TO_PLANE } from "./utilFormat";

export function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

export const getCameraViewSize = (camera) => {
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const height = 2 * Math.tan(vFov / 2) * DISTANCE_TO_PLANE;
  const width = height * camera.aspect;
  return { height, width };
};

// eg. f(x) = 1/16 * (x * (4 - x)) ** 2
export const bellFn = (x, a, b, c) => {
  // focus on x range between [0, a]
  // focus on y range between [0, c];
  return ((c * 4 ** b) / a ** (2 * b)) * (x * (a - x)) ** b;
};

export const bellFnDeriative = (x, a, b, c) => {
  return (
    (b * 4 ** b * c * (a - 2 * x) * ((a - x) * x) ** (b - 1)) / a ** (2 * b)
  );
};

export const normalCurveDeriativeFn = (x, speed, variance, c) => {
  return (
    (c * speed * (-x * Math.exp(-(x ** 2) / (2 * variance ** 2)))) /
    (variance * Math.sqrt(2 * Math.PI))
  );
};

export const normalCurveFn = (x, speed, variance, c) => {
  if (x > 1 || x <= 0) return 0;
  return (
    (c * speed * (Math.exp(-(x ** 2) / (2 * variance ** 2)) - 0.1)) /
    (variance * Math.sqrt(2 * Math.PI))
  );
};
