import ImagePlane from "../ImagePlane/ImagePlane";
import { Suspense, useEffect, useRef, useState } from "react";
import React from "react";
import useRefMounted from "utils/useRefMounted";
import {
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
  DAMP_FACTOR,
  LERP_FACTOR,
  IMAGE_BLOCK_HEIGHT,
  imagesArr,
} from "../../utils/utilFormat";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import produce from "immer";
import { getCameraViewSize, bellFn, bellFnDeriative } from "utils/utilsFn";
import normalizeWheel from "normalize-wheel";
const { lerp, damp } = THREE.MathUtils;
const Scene = ({ scroll }) => {
  const mounted = useRefMounted();
  const camera = useThree((state) => state.camera);
  const imgGroupRef = useRef();
  const prevDirection = useRef("L");
  const numImages = imagesArr.length;
  const { width, height } = getCameraViewSize(camera);
  const leftScreenBoundary = -width / 2;
  const rightScreenBoundary = width / 2;
  const defaultScales = Array.from({ length: numImages }).map((_, index) => [
    IMAGE_BLOCK_WIDTH,
    IMAGE_BLOCK_HEIGHT,
    1,
  ]);

  // \frac{1}{16}\cdot\left(x\ \cdot\left(4-x\right)\right)^{2}
  const slidingLength = numImages * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);
  const leftScrollBoundary = -(4 * IMAGE_BLOCK_WIDTH + 3 * IMAGE_GAP);

  const rightScrollBoundary = -leftScrollBoundary;
  const defaultPositions = Array.from({ length: numImages }).map((_, index) => [
    imgPositionCorrection(IMAGE_BLOCK_WIDTH * index + IMAGE_GAP * index),
    0,
    0,
  ]);
  function imgPositionCorrection(curPosX) {
    let leftImgBoundary = curPosX - IMAGE_BLOCK_WIDTH / 2;
    let rightImgBoundary = curPosX + IMAGE_BLOCK_WIDTH / 2;
    const [direction, speedVal] = parseOnWheel();
    if (
      (leftImgBoundary - slidingLength >= leftScreenBoundary &&
        leftImgBoundary - slidingLength <= rightScreenBoundary) ||
      (rightImgBoundary - slidingLength >= leftScreenBoundary &&
        rightImgBoundary - slidingLength <= rightScreenBoundary)
    ) {
      curPosX -= slidingLength;
    } else if (
      (leftImgBoundary + slidingLength >= leftScreenBoundary &&
        leftImgBoundary + slidingLength <= rightScreenBoundary) ||
      (rightImgBoundary + slidingLength >= leftScreenBoundary &&
        rightImgBoundary + slidingLength <= rightScreenBoundary)
    ) {
      curPosX += slidingLength;
    }
    if (direction === "L" && rightImgBoundary <= leftScreenBoundary) {
      curPosX += slidingLength;
    }
    if (direction === "R" && leftImgBoundary >= rightScreenBoundary) {
      curPosX -= slidingLength;
    }
    return curPosX;
  }
  const a = 2 * rightScrollBoundary;
  const b = 1.1;
  useFrame((state, delta) => {
    //positions
    if (!mounted) return;
    const imgsRefArr = imgGroupRef.current.children;
    const [direction, speedVal] = parseOnWheel();
    const c = 2;
    const normalizeSpeed = speedVal / 100;
    const newPositions = Array.from({ length: numImages }).forEach(
      (_, index) => {
        let [x, y, z] = imgsRefArr[index].position;
        const rotY = imgsRefArr[index].rotation.y;
        //update x
        x = imgPositionCorrection(x);
        let nextPosX =
          x + (direction === "L" ? -speedVal * 0.01 : +speedVal * 0.01);

        nextPosX = damp(x, nextPosX, 15, delta);
        // imgsRefArr[index].position.x = nextPosX;

        const nextPosZ =
          (bellFn(nextPosX + rightScrollBoundary, a, b, c) * speedVal) / 100;
        const newPosZ = damp(
          z,
          nextPosX >= leftScrollBoundary && nextPosX <= rightScrollBoundary
            ? nextPosZ
            : 0,
          15,
          delta
        );
        imgsRefArr[index].position.x = nextPosX;
        imgsRefArr[index].position.z = newPosZ;
        let degree = 0;
        const derivative = Math.atan(
          bellFnDeriative(nextPosX + rightScrollBoundary, a, b, c)
        );

        if (leftScrollBoundary <= nextPosX && nextPosX <= rightScrollBoundary) {
          degree = derivative;
          if (direction === "L") {
            const percentage =
              (nextPosX - leftScrollBoundary) / (2 * rightScrollBoundary);
            degree += (Math.PI / 5) * percentage;
          } else {
            const percentage =
              1 - (nextPosX - leftScrollBoundary) / (2 * rightScrollBoundary);
            degree -= (Math.PI / 5) * percentage;
          }
        } else if (direction === "L") {
          degree = Math.PI / 5;
        } else {
          degree = -Math.PI / 5;
        }

        if (direction === "L") {
          imgsRefArr[index].rotation.y = damp(rotY, -degree, 5, delta);
        } else if (direction === "R") {
          imgsRefArr[index].rotation.y = damp(rotY, -degree, 5, delta);
        }
      }
    );
    scroll.current = null;
  });

  function parseOnWheel() {
    let direction = "L";
    let speedVal = 0;
    if (!scroll.current) {
      return [prevDirection.current, speedVal];
    }
    const { pixelX, pixelY } = normalizeWheel(scroll.current);
    let horizonal = true;
    if (Math.abs(pixelY) > Math.abs(pixelX)) {
      horizonal = false;
    }
    if (horizonal) {
      if (pixelX < 0) {
        direction = "R";
      } else {
        direction = "L";
      }
    } else {
      if (pixelY < 0) {
        direction = "R";
      } else {
        direction = "L";
      }
    }
    prevDirection.current = direction;
    speedVal = Math.min(Math.max(Math.abs(pixelX), Math.abs(pixelY)), 100);
    return [direction, speedVal];
  }
  return (
    <group ref={imgGroupRef}>
      {imagesArr.map((url, index) => {
        return (
          <ImagePlane
            index={index}
            key={index}
            url={url}
            scale={defaultScales[index]}
            position={defaultPositions[index]}
          />
        );
      })}
    </group>
  );
};

export default Scene;

// useFrame((state, delta) => {
//   if (!imgGroupRef.current) return;
//   const imgsRefArr = imgGroupRef.current.children;
//   imgsRefArr.forEach((imgMesh, index) => {
//     const [x, y, z] = imgMesh.position;

//     let withinRange = 1;
//     if (x <= leftScrollBoundary || x >= rightScrollBoundary) {
//       withinRange = 0;
//     } else if (scrollSpeed === 0) {
//       withinRange = 0;
//     } else {
//       withinRange = 1 - Math.abs(x) / rightScrollBoundary;
//     }
//     const nextPosZ = damp(z, withinRange * normalizeSpeed * 6, 5, delta);
//     imgsRefArr[index].position.z = nextPosZ;
//   });
//   // setScrollSpeed(0);
// });
