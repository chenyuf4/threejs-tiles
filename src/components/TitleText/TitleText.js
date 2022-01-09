import { Text } from "@react-three/drei";
import fontFamily from "assets/font/Regular.otf";
import { useStore } from "store/store";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useRefMounted from "hooks/useRefMounted";
const { damp, lerp } = THREE.MathUtils;
const TitleText = ({ index, fontColor, upperText, lowerText }) => {
  const { clicked } = useStore();
  const textUpperRef = useRef();
  const textLowerRef = useRef();
  const mounted = useRefMounted();

  useFrame((state, delta) => {
    if (!mounted.current) return;
    if (!textLowerRef.current) return;
    if (!textUpperRef.current) return;
    if (clicked === index) {
      textUpperRef.current.children.forEach((item) => {
        item._baseMaterial.opacity = damp(
          item._baseMaterial.opacity,
          1,
          8,
          delta
        );
      });
      textLowerRef.current.children.forEach((item) => {
        item._baseMaterial.opacity = damp(
          item._baseMaterial.opacity,
          1,
          8,
          delta
        );
      });
    } else {
      textUpperRef.current.children.forEach((item) => {
        item._baseMaterial.opacity = damp(
          item._baseMaterial.opacity,
          0,
          10,
          delta
        );
      });
      textLowerRef.current.children.forEach((item) => {
        item._baseMaterial.opacity = damp(
          item._baseMaterial.opacity,
          0,
          10,
          delta
        );
      });
    }
  });
  return (
    <>
      <group ref={textUpperRef} position={[-1, 1.6, 1]}>
        {upperText.split("").map((letter, index) => {
          const position = [index * 0.8 - 3.8, 0, 0];
          return (
            <Text
              key={index}
              // color={fontColor}
              anchorX="center"
              anchorY="middle"
              fontSize={2.9}
              font={fontFamily}
              text={letter}
              // material={<meshBasicMaterial />}
              position={[index * 0.8 - 2.8, 0.3, 0]}
            >
              <meshBasicMaterial color={fontColor} opacity={0} />
            </Text>
          );
        })}
      </group>
      <group position={[0, -0.6, 1]} ref={textLowerRef}>
        {lowerText.split("").map((letter, index) => {
          const position = [index * 0.8 - 3.5, 0, 0];
          return (
            <Text
              key={index}
              // color={fontColor}
              anchorX="center"
              anchorY="middle"
              fontSize={2.9}
              font={fontFamily}
              text={letter}
              position={position}
            >
              <meshBasicMaterial color={fontColor} opacity={0} />
            </Text>
          );
        })}
      </group>
    </>
  );
};

export default TitleText;
