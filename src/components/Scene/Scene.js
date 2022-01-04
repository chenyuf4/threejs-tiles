import ImagePlane from "../ImagePlane/ImagePlane";
import { Suspense } from "react";
import { IMAGE_BLOCK_WIDTH, IMAGE_GAP } from "utils/utilFormat";
import { useThree } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import { imagesArr } from "utils/utilFormat";
import Minimap from "components/Minimap/Minimap";
import { useStore } from "store/store";
const Scene = () => {
  const numImages = imagesArr.length;
  const { width } = useThree((state) => state.viewport);
  const { clicked } = useStore();
  const newImageWidth = 1.388 * 4.5;
  // const itemsLength =
  //   clicked === -1
  //     ? width + (numImages - 1) * (IMAGE_BLOCK_WIDTH + IMAGE_GAP)
  //     : width + (numImages - 1) * (newImageWidth + 1.3);
  const itemsLength = width + (numImages - 1) * (IMAGE_BLOCK_WIDTH + IMAGE_GAP);
  return (
    <ScrollControls
      horizontal
      damping={5}
      pages={itemsLength / width}
      infinite={false}
    >
      <Minimap />
      <Scroll>
        {imagesArr.map((url, index) => {
          const imagePosition = [
            IMAGE_BLOCK_WIDTH * index + IMAGE_GAP * index,
            0,
            0,
          ];
          return (
            <ImagePlane
              index={index}
              key={url + index}
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
