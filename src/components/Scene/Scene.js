import ImagePlane from "../ImagePlane/ImagePlane";
import { Suspense, useState } from "react";
import {
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
  DAMP_FACTOR,
  LERP_FACTOR,
  IMAGE_BLOCK_HEIGHT,
} from "../../utils/utilFormat";
import { useFrame, useThree } from "@react-three/fiber";
import { imagesArr } from "../../utils/utilFormat";
import { useStore } from "../../store/store";
import * as THREE from "three";
import produce from "immer";

const { lerp, damp } = THREE.MathUtils;
const Scene = () => {
  const { scrollSpeed, scrollDirection, setScrollDirection, setScrollSpeed } =
    useStore();
  const numImages = imagesArr.length;
  const { width } = useThree((state) => state.viewport);

  const defaultScales = Array.from({ length: numImages }).map((_, index) => [
    IMAGE_BLOCK_WIDTH,
    IMAGE_BLOCK_HEIGHT,
    1,
  ]);

  const defaultPositions = Array.from({ length: numImages }).map((_, index) => [
    defaultScales[index][0] * index + IMAGE_GAP * index,
    0,
    0,
  ]);
  const defaultBoundary = defaultPositions.map((item, index) => [
    item[0] - (numImages - 1) * (defaultScales[index][0] + IMAGE_GAP),
    item[0],
  ]);
  const [positions, setPositions] = useState(defaultPositions);
  const [scales, setScales] = useState(defaultScales);
  const slidingLength = (numImages - 1) * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);

  useFrame((state, delta) => {
    const newPositions = Array.from({ length: numImages }).map((_, index) => {
      const [x, y, z] = positions[index];
      const [leftBoundary, rightBoundary] = defaultBoundary[index];
      let nextPos =
        x +
        (scrollDirection === "L"
          ? -scrollSpeed * DAMP_FACTOR
          : +scrollSpeed * DAMP_FACTOR);

      //auto scroll to the boundary if too close to boundaries
      if (
        (Math.abs(nextPos - leftBoundary) <= IMAGE_BLOCK_WIDTH &&
          scrollDirection === "L") ||
        nextPos <= leftBoundary
      ) {
        nextPos = leftBoundary;
      }
      if (
        (Math.abs(nextPos - rightBoundary) <= IMAGE_BLOCK_WIDTH &&
          scrollDirection === "R") ||
        nextPos >= rightBoundary
      ) {
        nextPos = rightBoundary;
      }
      let lerpVal = damp(x, nextPos, 5, delta);

      //if distance to boundaries are less than 0.1, directly set to the boundaries
      if (Math.abs(lerpVal - leftBoundary) <= 0.1) {
        lerpVal = leftBoundary;
      }
      if (Math.abs(lerpVal - rightBoundary) <= 0.1) {
        lerpVal = rightBoundary;
      }
      // if (index === 0) console.log(lerpVal);

      return [lerpVal, y, z];
    });

    //calculate how many pixels have been moved from very beginning state
    const slidingDis = 0 - newPositions[0][0]; //only need to look at position of first image, between 0 and total sliding length
    const leftScrollBoundary = -(5 * IMAGE_BLOCK_WIDTH + 4 * IMAGE_GAP);
    const rightScrollBoundary = -leftScrollBoundary;

    const newScales = Array.from({ length: numImages }).map((_, index) => {
      const [scaleX, scaleY, scaleZ] = defaultScales[index];
      const [curScaleX, curScaleY, curScaleZ] = scales[index];
      const [oldPosX, oldPosY, oldPosZ] = positions[index];
      const [newPosX, newPosY, newPosZ] = newPositions[index];
      const [leftBoundary, rightBoundary] = defaultBoundary[index];
      const scrollPercentage =
        scrollDirection === "L"
          ? Math.abs(newPosX - leftBoundary) / slidingLength
          : Math.abs(newPosX - rightBoundary) / slidingLength;
      const normalizeSpeed = scrollSpeed / 25;

      let withinRange = 1;
      if (scrollSpeed === 0) {
        withinRange = 0;
      } else {
        if (newPosX <= leftScrollBoundary || newPosX >= rightScrollBoundary) {
          withinRange = 0;
        } else if (
          Math.abs(newPosX - leftBoundary) <= 2 * IMAGE_BLOCK_WIDTH ||
          Math.abs(newPosX - rightBoundary) <= 2 * IMAGE_BLOCK_WIDTH
        ) {
          withinRange = 0;
        } else {
          withinRange = (1 - Math.abs(newPosX) / rightScrollBoundary) * 0.8;
        }
      }

      const lerpValY = damp(
        curScaleY,
        scaleY * (1 + withinRange * normalizeSpeed),
        5,
        delta
      );

      const lerpValX = damp(
        curScaleX,
        scaleX * (1 + withinRange * normalizeSpeed),
        5,
        delta
      );
      // return [scaleX, lerpValY, scaleZ];
      return [lerpValX, lerpValY, scaleZ];
    });
    setPositions(newPositions);
    setScales(newScales);
    setScrollSpeed(0);
  });

  return (
    <group>
      {imagesArr.map((url, index) => {
        // const imagePosition = [
        //   IMAGE_BLOCK_WIDTH * index + IMAGE_GAP * index,
        //   0,
        //   0,
        // ];
        return (
          <ImagePlane
            index={index}
            key={index}
            url={url}
            scale={scales[index]}
            position={positions[index]}
          />
        );
      })}
    </group>
  );
};

export default Scene;
