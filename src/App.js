import React from "react";
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
  const { setScrollDirection, setScrollSpeed } = useStore();
  const tilesOnWheel = (mouse) => {
    const { pixelX, pixelY } = normalizeWheel(mouse);
    if (pixelX < 0) {
      setScrollDirection("R");
    } else {
      setScrollDirection("L");
    }
    setScrollSpeed(Math.abs(pixelX));
  };
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
            colorManagement
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
