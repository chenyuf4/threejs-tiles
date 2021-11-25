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
