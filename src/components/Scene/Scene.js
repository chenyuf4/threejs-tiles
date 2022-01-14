import ImagePlane from "../ImagePlane/ImagePlane";
import React from "react";
import useRefMounted from "utils/useRefMounted";
import {
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
  IMAGE_BLOCK_HEIGHT,
  imagesArr,
} from "../../utils/utilFormat";
import { useFrame } from "@react-three/fiber";
const Scene = ({ scroll }) => {
  const mounted = useRefMounted();
  useFrame((state, delta) => {
    if (!mounted) return;
    setTimeout(() => (scroll.current = null), 200);
  });

  return (
    <group>
      {imagesArr.map((url, index) => {
        return (
          <ImagePlane
            scroll={scroll}
            index={index}
            key={index}
            url={url}
            scale={[IMAGE_BLOCK_WIDTH, IMAGE_BLOCK_HEIGHT, 1]}
            position={[IMAGE_BLOCK_WIDTH * index + IMAGE_GAP * index, 0, 0]}
          />
        );
      })}
    </group>
  );
};

export default Scene;
