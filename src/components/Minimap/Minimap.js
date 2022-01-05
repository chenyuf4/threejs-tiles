import * as THREE from "three";
import { useScroll } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { imagesArr } from "utils/utilFormat";
import useRefMounted from "hooks/useRefMounted";

const material = new THREE.LineBasicMaterial({ color: "#414141" });
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -0.08, 0),
  new THREE.Vector3(0, 0.08, 0),
]);
const { damp } = THREE.MathUtils;

const MinimapLine = ({ index, position }) => {
  const mounted = useRefMounted();
  const numImages = imagesArr.length;
  const scroll = useScroll();
  const prevPosition = useRef(0);
  const lineRef = useRef();
  const WHOLE_WIDTH = 9 * 0.09;
  useFrame((state, delta) => {
    if (!mounted.current) return;
    const curPosition = scroll.offset;
    const speed = Math.min(
      Math.abs((curPosition - prevPosition.current) / delta) * 1.5,
      1.25
    );
    prevPosition.current = curPosition;
    const y = scroll.curve(index / numImages - 4.5 / numImages, 9 / numImages);
    const x = (WHOLE_WIDTH / 2) * (1 - y);
    lineRef.current.scale.y = damp(
      lineRef.current.scale.y,
      1 + 0.5 * speed * (Math.cos((2 * Math.PI * x) / WHOLE_WIDTH) + 1),
      12,
      delta
    );
  });
  return (
    <line
      ref={lineRef}
      geometry={geometry}
      material={material}
      scale={[1, 1, 1]}
      position={position}
    />
  );
};
const Minimap = () => {
  const { height } = useThree((state) => state.viewport);

  return (
    <group>
      {imagesArr.map((_, i) => (
        <MinimapLine
          key={i}
          index={i}
          position={[i * 0.09 - imagesArr.length * 0.03, height / 2 - 0.4, 0]}
        />
      ))}
    </group>
  );
};

export default Minimap;
