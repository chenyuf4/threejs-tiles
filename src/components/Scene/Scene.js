import ImagePlane from "../ImagePlane/ImagePlane";
import { Suspense } from "react";
import {
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
  IMAGE_BLOCK_HEIGHT,
} from "../../utils/utilFormat";
import { useThree } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { imagesArr } from "../../utils/utilFormat";
const Scene = () => {
  const numImages = imagesArr.length;
  const { width, height } = useThree((state) => state.viewport);
  const itemsLength =
    height + (numImages - 1) * (IMAGE_BLOCK_HEIGHT + IMAGE_GAP);
  return (
    <ScrollControls damping={6} pages={itemsLength / height} infinite={false}>
      <Scroll>
        {imagesArr.map((url, index) => {
          const imagePosition = [
            0,
            -(IMAGE_BLOCK_HEIGHT * index + IMAGE_GAP * index),
            0,
          ];
          return (
            <ImagePlane
              index={index}
              key={index}
              url={url}
              position={imagePosition}
            />
          );
        })}
      </Scroll>
    </ScrollControls>
  );
};

export default Scene;
