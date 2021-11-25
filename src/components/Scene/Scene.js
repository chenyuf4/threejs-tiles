import ImagePlane from "../ImagePlane/ImagePlane";
import { Suspense, useEffect, useRef, useState } from "react";
import React from "react";
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
const Scene = () => {
  const speedRef = useRef(0);
  const directionRef = useRef("L");
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
    if (
      directionRef.current === "L" &&
      rightImgBoundary <= leftScreenBoundary
    ) {
      curPosX += slidingLength;
    }
    if (
      directionRef.current === "R" &&
      leftImgBoundary >= rightScreenBoundary
    ) {
      curPosX -= slidingLength;
    }
    return curPosX;
  }
  useFrame((state, delta) => {
    //positions
    if (!imgGroupRef.current) return;
    const imgsRefArr = imgGroupRef.current.children;

    const newPositions = Array.from({ length: numImages }).forEach(
      (_, index) => {
        let [x, y, z] = imgsRefArr[index].position;
        x = imgPositionCorrection(x);
        let nextPosX =
          x +
          (directionRef.current === "L"
            ? -speedRef.current * 0.05
            : +speedRef.current * 0.05);

        nextPosX = lerp(x, nextPosX, 0.045);
        imgsRefArr[index].position.x = nextPosX;
      }
    );

    //   //   //rotation
    //   //   //right, rotation > 0
    //   //   //left, rotation < 0
    //   //   // const rotationRatio = scrollSpeed > 0 ? (Math.PI / 4) * normalizeSpeed : 0;
    //   //   // const rotationVal = damp(
    //   //   //   rotation[1],
    //   //   //   scrollDirection === "R" ? rotationRatio : -rotationRatio,
    //   //   //   20,
    //   //   //   delta
    //   //   // );
    speedRef.current = 0;
  });

  const handleOnWheel = (e) => {
    const { pixelX, pixelY } = normalizeWheel(e);
    let horizonal = true;
    if (Math.abs(pixelY) > Math.abs(pixelX)) {
      horizonal = false;
    }
    if (horizonal) {
      if (pixelX < 0) {
        directionRef.current = "R";
      } else {
        directionRef.current = "L";
      }
    } else {
      if (pixelY < 0) {
        directionRef.current = "R";
      } else {
        directionRef.current = "L";
      }
    }
    const speedVal = Math.min(
      Math.max(Math.abs(pixelX), Math.abs(pixelY)),
      100
    );
    speedRef.current = speedVal;
  };
  useEffect(() => {
    document.body.addEventListener("wheel", handleOnWheel);

    return function cleanup() {
      document.body.removeEventListener("wheel", handleOnWheel);
    };
  }, []);
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
