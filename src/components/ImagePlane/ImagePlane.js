import { useTexture } from "@react-three/drei";
import { Suspense, useState, useRef, useEffect } from "react";
import {
  IMAGE_BLOCK_HEIGHT,
  IMAGE_BLOCK_WIDTH,
  imagesArr,
  IMAGE_GAP,
} from "../../utils/utilFormat";
import { useScroll, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { lerp } from "../../utils/utilsFn";
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

  const rigthBoundary = position[0];
  const leftBoundary =
    position[0] - (numImages - 1) * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);
  useFrame((state, delta) => {
    if (!imgRef.current) return;
    // const y = scroll.curve(index / numImages - 1.5 / numImages, 4 / numImages);
    // imgRef.current.material.scale[1] = imgRef.current.scale.y = damp(
    //   imgRef.current.scale.y,
    //   4 + y,
    //   8,
    //   delta
    // );
    // imgRef.current.material.scale[0] = imgRef.current.scale.x = damp(
    //   imgRef.current.scale.x,
    //   1,
    //   6,
    //   delta
    // );
    imgRef.current.material.grayscale = damp(
      imgRef.current.material.grayscale,
      hover ? 0 : 1,
      6,
      delta
    );

    imgRef.current.material.color.lerp(
      color.set(hover ? "white" : "#aaa"),
      hover ? 0.3 : 0.1
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
