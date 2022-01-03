import React from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.scss";
import Scene from "./components/Scene/Scene";
import Home from "./components/Home/Home";
import { PerspectiveCamera } from "@react-three/drei";
const App = () => {
  return (
    <>
      <div className="w-100 h-100 position-relative canvas-container remove-canvas-scroll-bar">
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
