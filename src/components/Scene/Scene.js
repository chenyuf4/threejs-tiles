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
import { getCameraViewSize } from "utils/utilsFn";
import normalizeWheel from "normalize-wheel";
const { lerp, damp } = THREE.MathUtils;
const Scene = ({ scroll }) => {
  const mounted = useRefMounted();
  const camera = useThree((state) => state.camera);
  const imgGroupRef = useRef();
  const numImages = imagesArr.length;
  const { width, height } = getCameraViewSize(camera);
  const leftScreenBoundary = -width / 2;
  const rightScreenBoundary = width / 2;
  const defaultScales = Array.from({ length: numImages }).map((_, index) => [
    IMAGE_BLOCK_WIDTH,
    IMAGE_BLOCK_HEIGHT,
    1,
  ]);
  const slidingLength = numImages * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);

  const leftScrollBoundary = -(3 * IMAGE_BLOCK_WIDTH + 2 * IMAGE_GAP);
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
  useFrame((state, delta) => {
    //positions
    if (!mounted) return;
    const imgsRefArr = imgGroupRef.current.children;
    const [direction, speedVal] = parseOnWheel();
    const normalizeSpeed = speedVal / 100;
    const newPositions = Array.from({ length: numImages }).forEach(
      (_, index) => {
        let [x, y, z] = imgsRefArr[index].position;
        //update x
        x = imgPositionCorrection(x);
        let nextPosX =
          x + (direction === "L" ? -speedVal * 0.05 : +speedVal * 0.05);

        nextPosX = damp(x, nextPosX, 3, delta);
        imgsRefArr[index].position.x = nextPosX;

        const nextPosZ = calculateNewPosZ(nextPosX, normalizeSpeed) * 6;
        imgsRefArr[index].position.z = lerp(z, nextPosZ, 0.05);
      }
    );
    scroll.current = null;
  });
  //ax^2 + c
  //c = speedval
  //ax^2 + c = 0
  //a = -c / x ^ 2
  //
  function calculateNewPosZ(x, speed) {
    if (x <= leftScrollBoundary || x >= rightScrollBoundary) return 0;
    const c = speed;
    const a = -c / Math.abs(rightScrollBoundary ** 2);
    return a * x ** 2 + c;
  }

  function parseOnWheel() {
    let direction = "L";
    let speedVal = 0;
    if (!scroll.current) return [direction, speedVal];
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
