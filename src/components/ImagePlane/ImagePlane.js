import { useTexture } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import {
  DAMP_FACTOR,
  imagesArr,
  IMAGE_BLOCK_HEIGHT,
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
} from "../../utils/utilFormat";
import { Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useStore } from "store/store";
import * as THREE from "three";
import normalizeWheel from "normalize-wheel";
import useRefMounted from "utils/useRefMounted";
import { normalCurveDeriativeFn, normalCurveFn } from "utils/utilsFn";
import "./CustomMaterial";
const { lerp, damp } = THREE.MathUtils;
const ImagePlane = ({
  index,
  position = [0, 0, 0],
  scale = [IMAGE_BLOCK_WIDTH, IMAGE_BLOCK_HEIGHT, 1],
  rotation = [0, 0, 0],
  color = new THREE.Color(),
  url,
  scroll,
  ...props
}) => {
  const imgRef = useRef();
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);
  const { scrollSpeed, scrollDirection } = useStore();
  const [imgTexture] = useTexture([url]);
  const prevDirection = useRef("L");
  const prevPosition = useRef(position[0]);
  const mounted = useRefMounted();
  const material = useRef();

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.material.grayscale = 1;
      imgRef.current.material.side = THREE.DoubleSide;
    }
  });
  const leftScrollBoundary = -(4.5 * IMAGE_BLOCK_WIDTH + 3.5 * IMAGE_GAP);
  const rightScrollBoundary = -leftScrollBoundary;
  const numImages = imagesArr.length;
  const slidingLength = numImages * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);
  function parseOnWheel() {
    let direction = "L";
    let speedVal = 0;
    if (!scroll.current) {
      return [prevDirection.current, speedVal];
    }
    const { pixelX, pixelY } = scroll.current;
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

  useFrame((state, delta) => {
    if (!mounted.current) return;
    const [direction, speedVal] = parseOnWheel();
    let { x, y, z } = imgRef.current.position;

    let nextPosX =
      x +
      (direction === "L" ? -speedVal * DAMP_FACTOR : +speedVal * DAMP_FACTOR);
    if (nextPosX < position[0] - slidingLength) {
      nextPosX = position[0] - slidingLength;
    } else if (nextPosX > position[0]) {
      nextPosX = position[0];
    }

    nextPosX = x + (nextPosX - x) * 0.1;
    const currentSpeed = nextPosX - prevPosition.current;
    prevPosition.current = nextPosX;

    const percentage =
      nextPosX >= leftScrollBoundary && nextPosX <= rightScrollBoundary
        ? Math.abs(nextPosX) / Math.abs(rightScrollBoundary)
        : 1;
    material.current.percentage = percentage;

    // material.current.speed = damp(
    //   material.current.speed,
    //   Math.min(Math.abs(currentSpeed), 0.34),
    //   4,
    //   delta
    // );
    imgRef.current.position.x = nextPosX;
  });

  return (
    <Image
      ref={imgRef}
      url={url}
      position={position}
      scale={scale}
      rotation={rotation}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      {...props}
    >
      <customMaterial
        ref={material}
        map={imgTexture}
        map-minFilter={THREE.LinearFilter}
        transparent
      />
    </Image>
  );
};

export default ImagePlane;
