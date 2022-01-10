import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree, createPortal } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Text,
  Loader,
  Line,
  Shadow,
  useTexture,
  meshBounds,
  PerspectiveCamera,
} from "@react-three/drei";
import Home from "components/Home/Home";
import { useDrag } from "@use-gesture/react";
import Plane from "./components/Plane";
import Effects from "./components/Effects";
import { Block, useBlock } from "./Block";
import state from "./store/store";
import {
  imagesArr,
  IMAGE_BLOCK_HEIGHT,
  IMAGE_BLOCK_WIDTH,
  IMAGE_GAP,
} from "utils/utilFormat";

function HeadsUpDisplay({ children }) {
  const [scene] = useState(() => new THREE.Scene());
  const { gl, camera } = useThree();
  useFrame(
    () => ((gl.autoClear = false), gl.clearDepth(), gl.render(scene, camera)),
    2
  );
  return createPortal(children, scene);
}

function Marker() {
  const ref = useRef();
  const [active, setActive] = useState(false);
  const [hovered, set] = useState(false);
  const { sectionWidth } = useBlock();
  useEffect(
    () => void (document.body.style.cursor = hovered ? "grab" : "auto"),
    [hovered]
  );
  useFrame(({ camera }) => {
    // ref.current.rotation.z = THREE.MathUtils.lerp(
    //   ref.current.rotation.z,
    //   (state.top.current / state.zoom / sectionWidth / state.pages) *
    //     -Math.PI *
    //     2,
    //   0.1
    // );
    // const s = THREE.MathUtils.lerp(
    //   ref.current.scale.x,
    //   active || hovered ? 2 : 0.75,
    //   0.1
    // );
    // ref.current.scale.set(s, s, s);
    camera.zoom = 40;
    camera.updateProjectionMatrix();
  });
  const bind = useDrag(
    ({ movement: [x], first, last }) => (
      setActive(!last), (state.ref.scrollLeft = x * 2 * state.pages)
    ),
    {
      from: () => [(state.ref.scrollLeft * 0.5) / state.pages],
    }
  );
  return (
    <group ref={ref} position={[0, 0, 2]}>
      {/* <Rect
        {...bind()}
        onPointerOver={(e) => (e.stopPropagation(), set(true))}
        onPointerOut={() => set(false)}
      /> */}
    </group>
  );
}

function Rect({ scale, ...props }) {
  return (
    <group scale={scale}>
      <Line
        points={[
          -0.5, 0.5, 0, 0.5, 0.5, 0, 0.5, -0.5, 0, -0.5, -0.5, 0, -0.5, 0.5, 0,
        ]}
        color="white"
        linewidth={1}
        position={[0, 0, 0]}
      />
      <mesh {...props} raycast={meshBounds}>
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function Image({ img, index }) {
  const ref = useRef();
  const { contentMaxWidth: w, viewportWidth, offsetFactor } = useBlock();
  useFrame(() => {
    // const scrollOffset =
    //   state.top.current / (viewportWidth * state.pages - viewportWidth) +
    //   1 / state.pages / 2;
    // const scale =
    //   1 -
    //   (offsetFactor - scrollOffset) * (offsetFactor > scrollOffset ? 1 : -1);
    ref.current.scale.setScalar(1);
  });
  return (
    <group ref={ref}>
      <Plane
        map={img}
        index={index}
        args={[1, 1, 32, 32]}
        shift={100}
        aspect={1219 / 696}
        scale={[IMAGE_BLOCK_WIDTH, IMAGE_BLOCK_HEIGHT, 1]}
        frustumCulled={false}
        url={imagesArr[index]}
      />
    </group>
  );
}

function Content() {
  const images = useTexture(imagesArr);
  return images.map((img, index) => {
    return (
      <Block key={index} factor={1} offset={index}>
        <Image key={index} index={index} img={img} />
      </Block>
    );
  });
}

export default function App() {
  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollLeft);
  useEffect(
    () => void onScroll({ target: (state.ref = scrollArea.current) }),
    []
  );

  return (
    <>
      <Home />
      <Canvas
        dpr={[1, 1.5]}
        mode="concurrent"
        flat
        linear
        // camera={{ position: [0, 0, 5] }}
        raycaster={{
          computeOffsets: ({ offsetX, offsetY }) => {
            return {
              offsetX: offsetX - scrollArea.current.scrollLeft,
              offsetY,
            };
          },
        }}
        onCreated={(state) => {
          state.events.connect(scrollArea.current);
        }}
      >
        <PerspectiveCamera position={[0, 0, 9]} makeDefault />
        {/* <Effects> */}
        <Suspense fallback={null}>
          <Content />
          {/* <HeadsUpDisplay>
            <Marker />
          </HeadsUpDisplay> */}
        </Suspense>
        {/* </Effects> */}
      </Canvas>
      <div
        className="scrollArea remove-canvas-scroll-bar"
        ref={scrollArea}
        onScroll={onScroll}
      >
        <div
          style={{
            height: "100vh",
            width: `${
              (imagesArr.length * IMAGE_BLOCK_WIDTH +
                (imagesArr.length - 1) * IMAGE_GAP) *
              137
            }px`,
          }}
        />
      </div>
    </>
  );
}
