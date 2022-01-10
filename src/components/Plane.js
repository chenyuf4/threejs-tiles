import * as THREE from "three";
import React, { forwardRef, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import "./CustomMaterial";
import { useBlock } from "../Block";
import state from "../store/store";
import { Image } from "@react-three/drei";
import { IMAGE_BLOCK_WIDTH, IMAGE_GAP } from "utils/utilFormat";
const { lerp, damp } = THREE.MathUtils;
export default forwardRef(
  (
    { color = "white", index, shift = 100, opacity = 1, args, map, ...props },
    ref
  ) => {
    const { viewportWidth, offsetFactor } = useBlock();
    const material = useRef();
    let last = state.top.current;
    const imageRef = useRef();

    const variance = 0.5;
    const c = 6.5;

    const deriativeFn = (x, speed) => {
      return (
        (c * speed * (-x * Math.exp(-(x ** 2) / (2 * variance ** 2)))) /
        (variance * Math.sqrt(2 * Math.PI))
      );
    };

    const updateZValue = (x, speed) => {
      if (x >= 1 || x <= -1) return 0;
      return (
        (c * speed * (Math.exp(-(x ** 2) / (2 * variance ** 2)) - 0.1)) /
        (variance * Math.sqrt(2 * Math.PI))
      );
    };

    const wholeWidth = (IMAGE_BLOCK_WIDTH * 9 + IMAGE_GAP * 8) * 135;
    useFrame((_, delta) => {
      const { pages, top } = state;

      const offsetLength = index * IMAGE_BLOCK_WIDTH + IMAGE_GAP * index;
      const x = (offsetLength - top.current) / (wholeWidth / 2);
      // console.log(top.current);
      // material.current.scale = THREE.MathUtils.lerp(
      //   material.current.scale,
      //   offsetFactor - top.current / ((pages - 1) * viewportWidth),
      //   0.1
      // );
      material.current.shift = index;
      material.current.speed = THREE.MathUtils.lerp(
        material.current.speed || 0,
        Math.abs((top.current - last) / 30),
        0.1
      );
      let newZIndex = updateZValue(x, Math.abs((top.current - last) / 30));
      console.log(newZIndex);
      material.current.zOffset = damp(
        material.current.zOffset || 0,
        newZIndex,
        10,
        delta
      );

      // imageRef.current.position.z += 0.01;

      last = top.current;
    });
    return (
      <mesh ref={imageRef} {...props}>
        <planeGeometry args={args} />
        <customMaterial
          ref={material}
          color={color}
          map={map}
          map-minFilter={THREE.LinearFilter}
          transparent
          opacity={opacity}
        />
      </mesh>
      // <Image {...props}></Image>
    );
  }
);
