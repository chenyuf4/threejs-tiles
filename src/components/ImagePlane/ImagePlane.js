import { useTexture } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import {
  IMAGE_BLOCK_HEIGHT,
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
} from "utils/utilFormat";
import { useScroll, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { imagesArr } from "utils/utilFormat";
const damp = THREE.MathUtils.damp;
const ImagePlane = ({
  index,
  position = [0, 0, 0],
  scale = [IMAGE_BLOCK_WIDTH, IMAGE_BLOCK_HEIGHT, 1],
  color = new THREE.Color(),
  url,
  ...props
}) => {
  const imgRef = useRef();
  const prevPosition = useRef(0);
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);
  const [imgTexture] = useTexture([url]);
  imgTexture.repeat.set(
    (IMAGE_BLOCK_WIDTH * imgTexture.image.height) /
      (IMAGE_BLOCK_HEIGHT * imgTexture.image.width),
    1
  );
  imgTexture.offset.set(0.42, 0);
  const numImages = imagesArr.length;
  const scroll = useScroll();
  const WHOLE_WIDTH = 9 * IMAGE_BLOCK_WIDTH + 8 * IMAGE_GAP;

  // get rotation angle
  const deriativeFn = (x, speed) => {
    return (
      (speed *
        (-1.25 * Math.sin((2 * Math.PI * x) / WHOLE_WIDTH) * 2 * Math.PI)) /
      WHOLE_WIDTH
    );
  };

  // get plane grayscale while sliding
  const grayScaleFn = (y, speed) => {
    return (1 - speed) * Math.cos(((y * Math.PI) / 2) * speed);
  };

  useFrame((state, delta) => {
    if (!imgRef.current) return;
    //update position
    const curPosition = scroll.offset;
    const speed = Math.min(
      Math.abs((curPosition - prevPosition.current) / delta) * 1.5,
      1.25
    );
    const scrollLeft = curPosition < prevPosition.current;
    prevPosition.current = curPosition;

    // calculate useful data
    const y = scroll.curve(index / numImages - 4.5 / numImages, 9 / numImages);
    const percentage = scroll.range(
      index / numImages - 4.5 / numImages,
      9 / numImages
    );
    const x = (WHOLE_WIDTH / 2) * (1 - y);
    const degree = Math.atan(deriativeFn(x, speed));

    // update position
    imgRef.current.position.z = damp(
      imgRef.current.position.z,
      2.25 * speed * (Math.cos((2 * Math.PI * x) / WHOLE_WIDTH) + 1),
      12,
      delta
    );

    // update rotation
    const rotateAdjust = Math.PI / 10;
    if (speed >= 0.2) {
      if (percentage > 0 && percentage < 0.5) {
        imgRef.current.rotation.y = damp(
          imgRef.current.rotation.y,
          -degree + (scrollLeft ? rotateAdjust : -rotateAdjust),
          20,
          delta
        );
      } else if (percentage >= 0.5 && percentage < 1) {
        imgRef.current.rotation.y = damp(
          imgRef.current.rotation.y,
          degree + (scrollLeft ? rotateAdjust : -rotateAdjust),
          20,
          delta
        );
      } else {
        imgRef.current.rotation.y = damp(
          imgRef.current.rotation.y,
          scrollLeft ? (Math.PI / 5) * speed : (-Math.PI / 5) * speed,
          20,
          delta
        );
      }
    } else {
      imgRef.current.rotation.y = damp(imgRef.current.rotation.y, 0, 3, delta);
    }

    // update color
    if (hover) {
      imgRef.current.material.grayscale = damp(
        imgRef.current.material.grayscale,
        hover ? 0 : 1,
        10,
        delta
      );
    } else if (
      speed > 0.2 &&
      y > Math.min(0.75, Math.cos((speed * Math.PI) / 3))
    ) {
      imgRef.current.material.grayscale = damp(
        imgRef.current.material.grayscale,
        Math.min(1, grayScaleFn(y, speed)),
        3,
        delta
      );
    } else {
      imgRef.current.material.grayscale = damp(
        imgRef.current.material.grayscale,
        1,
        3,
        delta
      );
    }

    imgRef.current.material.color.lerp(
      color.set(
        hover ||
          (speed > 0.2 && y > Math.min(0.75, Math.cos((speed * Math.PI) / 3)))
          ? "white"
          : "#808080"
      ),
      hover
        ? 0.3
        : speed > 0.2 && y > Math.min(0.75, Math.cos((speed * Math.PI) / 3))
        ? Math.min(1, Math.sin((Math.PI * y) / 2) * y * 0.085)
        : 0.035
    );
  });
  return (
    <Image
      ref={imgRef}
      url={url}
      position={position}
      scale={scale}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      {...props}
    />
  );
};

export default ImagePlane;
