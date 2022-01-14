import React, { useRef } from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.scss";
import Scene from "./components/Scene/Scene";
import Home from "./components/Home/Home";
import normalizeWheel from "normalize-wheel";
import { PerspectiveCamera } from "@react-three/drei";
import { DISTANCE_TO_PLANE } from "utils/utilFormat";

const App = () => {
  // left > 0
  // right < 0
  // top > 0
  //bottom < 0
  const scrollRef = useRef(null);
  const handleOnWheel = (e) => {
    scrollRef.current = normalizeWheel(e);
    // const { pixelX, pixelY } = scrollRef.current;
    // const relativeSpeed = Math.max(Math.abs(pixelX), Math.abs(pixelY));
    // console.log(relativeSpeed);
    // if (relativeSpeed < 10) {
    //   setTimeout(() => (scrollRef.current = null), 200);
    // }
  };
  return (
    <>
      <div
        className="w-100 h-100 position-relative canvas-container remove-canvas-scroll-bar"
        onWheel={handleOnWheel}
      >
        <Suspense fallback={null}>
          <Canvas
            linear
            orthographic
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
            }}
          >
            <PerspectiveCamera
              makeDefault
              fov={50}
              position={[0, 0, DISTANCE_TO_PLANE]}
            />
            <Scene scroll={scrollRef} />
          </Canvas>
        </Suspense>
      </div>
      <Home />
    </>
  );
};

export default App;
