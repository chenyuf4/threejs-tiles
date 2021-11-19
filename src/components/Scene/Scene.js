import ImagePlane from "../ImagePlane/ImagePlane";
import { Suspense, useState } from "react";
import {
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
  DAMP_FACTOR,
  LERP_FACTOR,
} from "../../utils/utilFormat";
import { useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { imagesArr } from "../../utils/utilFormat";
import { useStore } from "../../store/store";
import { lerp } from "../../utils/utilsFn";
import produce from "immer";
const Scene = () => {
  const { scrollSpeed, scrollDirection, setScrollDirection, setScrollSpeed } =
    useStore();
  const numImages = imagesArr.length;
  const { width } = useThree((state) => state.viewport);
  const itemsLength = width + (numImages - 1) * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);
  const defaultPositions = Array.from({ length: numImages }).map((_, index) => [
    IMAGE_BLOCK_WIDTH * index + IMAGE_GAP * index,
    0,
    0,
  ]);
  const defaultBoundary = defaultPositions.map((item) => [
    item[0] - (numImages - 1) * (IMAGE_BLOCK_WIDTH + IMAGE_GAP),
    item[0],
  ]);
  const [positions, setPositions] = useState(defaultPositions);
  // const { scrollSpeed, setScrollSpeed, scrollDirection, setScrollDirection } =
  //   useStore();
  useFrame((state, delta) => {
    const newPositions = Array.from({ length: numImages }).map((_, index) => {
      const [x, y, z] = positions[index];
      let nextPos =
        x +
        (scrollDirection === "L"
          ? -scrollSpeed * DAMP_FACTOR
          : +scrollSpeed * DAMP_FACTOR);
      const [leftBoundary, rigthBoundary] = defaultBoundary[index];
      if (nextPos < leftBoundary) {
        nextPos = leftBoundary;
      }
      if (nextPos > rigthBoundary) {
        nextPos = rigthBoundary;
      }

      const lerpVal = lerp(x, nextPos, LERP_FACTOR);
      return [lerpVal, y, z];
    });
    setPositions(newPositions);
    setScrollSpeed(0);
  });
  return (
    <group>
      {imagesArr.map((url, index) => {
        // const imagePosition = [
        //   IMAGE_BLOCK_WIDTH * index + IMAGE_GAP * index,
        //   0,
        //   0,
        // ];
        return (
          <ImagePlane
            index={index}
            key={index}
            url={url}
            position={positions[index]}
          />
        );
      })}
    </group>
  );
};

export default Scene;
