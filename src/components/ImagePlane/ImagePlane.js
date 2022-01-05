import { useState, useRef } from "react";
import { IMAGE_BLOCK_HEIGHT, IMAGE_BLOCK_WIDTH } from "utils/utilFormat";
import { useScroll, Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { imagesArr } from "utils/utilFormat";
import { useStore } from "store/store";
import gsap from "gsap";
import { Power2 } from "gsap";
import useRefMounted from "hooks/useRefMounted";
const { damp } = THREE.MathUtils;
const { easeOut } = Power2;
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
  const { clicked, setClicked, scrollable, setScrollable } = useStore();
  const numImages = imagesArr.length;
  const scroll = useScroll();
  const mounted = useRefMounted();

  const onClickFn = () => {
    if (mounted.current) {
      setClicked(index);
      gsap.to(scroll, {
        offset: (index + 0.5) / numImages,
        duration: 0.7,
        ease: easeOut,
        onComplete: () => setScrollable(false),
      });
    }
  };

  const variance = 0.5;
  const c = 6.5;
  // get rotation angle
  const deriativeFn = (x, speed) => {
    return (
      (c * speed * (-x * Math.exp(-(x ** 2) / (2 * variance ** 2)))) /
      (variance * Math.sqrt(2 * Math.PI))
    );
  };

  // get plane grayscale while sliding
  const grayScaleFn = (y, speed) => {
    return (1 - speed) * Math.cos(((y * Math.PI) / 2) * speed);
  };

  useFrame((state, delta) => {
    if (!imgRef.current) return;
    if (!mounted.current) return;
    //update position
    const curPosition = scroll.offset;
    const speed = Math.min(
      Math.abs((curPosition - prevPosition.current) / delta) * 1.5,
      1.25
    );
    const scrollRight = curPosition < prevPosition.current;
    prevPosition.current = curPosition;

    // calculate useful data
    const y = scroll.curve(index / numImages - 5.5 / numImages, 11 / numImages);
    const percentage = scroll.range(
      index / numImages - 5.5 / numImages,
      11 / numImages
    );
    const x = (percentage - 0.5) * 2;
    const degree = Math.atan(deriativeFn(x, speed));

    if (clicked === -1) {
      // if image is not clicked, first recover from clicked position if necessary
      imgRef.current.position.x = damp(
        imgRef.current.position.x,
        position[0],
        8,
        delta
      );
      imgRef.current.material.scale.x = imgRef.current.scale.x = damp(
        imgRef.current.scale.x,
        IMAGE_BLOCK_WIDTH,
        8,
        delta
      );
      imgRef.current.material.scale.y = imgRef.current.scale.y = damp(
        imgRef.current.scale.y,
        IMAGE_BLOCK_HEIGHT,
        8,
        delta
      );

      //create wave effect
      // update position
      if (percentage > 0 && percentage < 1) {
        imgRef.current.position.z = damp(
          imgRef.current.position.z,
          (c * speed * (Math.exp(-(x ** 2) / (2 * variance ** 2)) - 0.1)) /
            (variance * Math.sqrt(2 * Math.PI)),
          Math.max(8, 13 * speed),
          delta
        );
      } else {
        imgRef.current.position.z = damp(
          imgRef.current.position.z,
          0,
          8,
          delta
        );
      }

      // update rotation
      const rotateAdjustLarge = (Math.PI / 8) * speed;
      const rotateAdjustSmall = (Math.PI / 20) * speed;
      // (Math.PI / 10) * speed;
      if (speed >= 0.2) {
        hover && setHover(false);
        if (percentage > 0 && percentage < 0.5) {
          imgRef.current.rotation.y = damp(
            imgRef.current.rotation.y,
            degree + (scrollRight ? -rotateAdjustSmall : -rotateAdjustLarge),
            20,
            delta
          );
        } else if (percentage >= 0.5 && percentage < 1) {
          imgRef.current.rotation.y = damp(
            imgRef.current.rotation.y,
            degree + (scrollRight ? rotateAdjustLarge : rotateAdjustSmall),
            20,
            delta
          );
        } else {
          imgRef.current.rotation.y = damp(
            imgRef.current.rotation.y,
            scrollRight ? (Math.PI / 5) * speed : (-Math.PI / 5) * speed,
            20,
            delta
          );
        }
      } else {
        imgRef.current.rotation.y = damp(
          imgRef.current.rotation.y,
          0,
          3,
          delta
        );
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
    } else {
      //if image is clicked
      if (!scrollable && clicked === index) {
        scroll.offset = (index + 0.5) / numImages;
      }
      const newImageWidth = clicked === index ? 1.388 * 5.25 : 3.9;
      const newImageHeight = 0.792 * 5.25;
      if (clicked !== index) {
        imgRef.current.position.x = damp(
          imgRef.current.position.x,
          position[0] + 6.2 * (index - clicked),
          7,
          delta
        );
      } else {
        imgRef.current.material.grayscale = damp(
          imgRef.current.material.grayscale,
          0,
          3,
          delta
        );
        imgRef.current.material.color.lerp(color.set("white"), 0.035);
      }
      imgRef.current.rotation.y = damp(imgRef.current.rotation.y, 0, 7, delta);
      if (Math.abs(clicked - index) <= 1) {
        imgRef.current.material.scale.x = imgRef.current.scale.x = damp(
          imgRef.current.scale.x,
          newImageWidth,
          7,
          delta
        );
        imgRef.current.material.scale.y = imgRef.current.scale.y = damp(
          imgRef.current.scale.y,
          newImageHeight,
          7,
          delta
        );
      }
    }
  });
  return (
    <Image
      ref={imgRef}
      url={url}
      position={position}
      scale={scale}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={onClickFn}
      {...props}
    />
  );
};

export default ImagePlane;
