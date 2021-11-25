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
import { animated } from "@react-spring/three";
const { lerp, damp } = THREE.MathUtils;
const AnimatedImage = animated(Image);
const ImagePlane = ({
  index,
  position = [0, 0, 0],
  scale = [IMAGE_BLOCK_WIDTH, IMAGE_BLOCK_HEIGHT, 1],
  rotation = [0, 0, 0],
  color = new THREE.Color(),
  url,
  ...props
}) => {
  console.log("rerender");
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
  const normalizeSpeed = scrollSpeed / 100;
  const leftScrollBoundary = -(4 * IMAGE_BLOCK_WIDTH + 3 * IMAGE_GAP);
  const rightScrollBoundary = -leftScrollBoundary;

  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.material.grayscale = 1;
    }
  });
  // useFrame((state, delta) => {
  //   if (!imgRef.current) return;
  //   //   // image hover effect
  //   imgRef.current.material.grayscale = damp(
  //     imgRef.current.material.grayscale,
  //     hover ? 0 : 1,
  //     6,
  //     delta
  //   );
  //   imgRef.current.material.color.lerp(
  //     color.set(hover ? "white" : "#aaa"),
  //     hover ? 0.3 : 0.1
  //   );
  // });

  return (
    <AnimatedImage
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
