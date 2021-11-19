import React, { useRef } from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.scss";
import Scene from "./components/Scene/Scene";
import Home from "./components/Home/Home";
import normalizeWheel from "normalize-wheel";
import { useStore } from "./store/store";
const App = () => {
  // left > 0
  // right < 0
  // top > 0
  //bottom < 0
  const { scrollSpeed, setScrollDirection, setScrollSpeed } = useStore();
  const tilesOnWheel = (mouse) => {
    const { pixelX, pixelY } = normalizeWheel(mouse);
    let horizonal = true;
    if (Math.abs(pixelY) > Math.abs(pixelX)) {
      horizonal = false;
    }
    if (horizonal) {
      if (pixelX < 0) {
        setScrollDirection("R");
      } else {
        setScrollDirection("L");
      }
    } else {
      if (pixelY < 0) {
        setScrollDirection("R");
      } else {
        setScrollDirection("L");
      }
    }
    const speedVal = Math.max(Math.abs(pixelX), Math.abs(pixelY));
    setScrollSpeed(speedVal);
  };
  const refContainer = useRef();
  return (
    <>
      <div
        className="w-100 h-100 position-relative canvas-container remove-canvas-scroll-bar"
        onWheel={tilesOnWheel}
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
            <Scene />
          </Canvas>
        </Suspense>
      </div>
      <Home />
    </>
  );
};

export default App;
