import React from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.scss";
import Scene from "./components/Scene/Scene";
import Home from "./components/Home/Home";
import { PerspectiveCamera } from "@react-three/drei";
import { useStore } from "store/store";
import normalizeWheel from "normalize-wheel";
const App = () => {
  const { clicked, setClicked, setScrollable } = useStore();
  const onWheelFn = (e) => {
    const { pixelX, pixelY } = normalizeWheel(e);
    if (Math.abs(pixelX) > 15 || Math.abs(pixelY) > 15) {
      if (clicked !== -1) {
        setClicked(-1);
        setScrollable(true);
        document.body.style.backgroundColor = "#151515";
        document.querySelectorAll(".font-animate").forEach((item) => {
          item.style.color = "#bac4b8";
        });
      }
    }
  };
  return (
    <>
      <div
        className="w-100 h-100 position-relative canvas-container remove-canvas-scroll-bar"
        onWheel={onWheelFn}
      >
        <Suspense fallback={null}>
          <Canvas
            linear
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
            }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={50} />
            <Scene />
          </Canvas>
        </Suspense>
      </div>

      <Home />
    </>
  );
};

export default App;
