import { useTexture } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import {
  IMAGE_BLOCK_HEIGHT,
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
} from "../../utils/utilFormat";
import { Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useStore } from "store/store";
import * as THREE from "three";
const { lerp, damp } = THREE.MathUtils;
const ImagePlane = ({
  index,
  position = [0, 0, 0],
  scale = [IMAGE_BLOCK_WIDTH, IMAGE_BLOCK_HEIGHT, 1],
  rotation = [0, 0, 0],
  color = new THREE.Color(),
  url,
  ...props
}) => {
  const imgRef = useRef();
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);
  const [imgTexture] = useTexture([url]);
  const { scrollSpeed, scrollDirection } = useStore();
  imgTexture.repeat.set(
    (IMAGE_BLOCK_WIDTH * imgTexture.image.height) /
      (IMAGE_BLOCK_HEIGHT * imgTexture.image.width),
    1
  );
  imgTexture.offset.set(0.42, 0);

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.material.grayscale = 1;
      imgRef.current.material.side = THREE.DoubleSide;
    }
  });
  const leftScrollBoundary = -(4 * IMAGE_BLOCK_WIDTH + 3 * IMAGE_GAP);
  const rightScrollBoundary = -leftScrollBoundary;
  function calculateNewPosZ(x, speed) {
    if (x <= leftScrollBoundary || x >= rightScrollBoundary) return 0;
    const c = speed;
    const a = -c / Math.abs(rightScrollBoundary ** 2);
    return a * x ** 2 + c;
  }
  // useFrame((state, delta) => {
  //   if (!imgRef.current) return;
  //   const [x, y, z] = imgRef.current.position;
  //   const nextPosZ = calculateNewPosZ(x, 2.2);
  //   imgRef.current.position.z = damp(z, nextPosZ, 10, delta);

  //   // const degree =
  // });
  // //ax^2 + c, deriative = 2ax
  // useFrame((state, delta) => {
  //   if (!imgRef.current) return;
  //   // image hover effect
  // imgRef.current.material.grayscale = damp(
  //   imgRef.current.material.grayscale,
  //   hover ? 0 : 1,
  //   6,
  //   delta
  // );
  // imgRef.current.material.color.lerp(
  //   color.set(hover ? "white" : "#aaa"),
  //   hover ? 0.3 : 0.1
  // );
  // });

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
    />
  );
};

export default ImagePlane;
