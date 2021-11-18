import React from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import "./App.scss";
import Scene from "./components/Scene/Scene";
import Home from "./components/Home/Home";
const App = () => {
  return (
    <>
      <div className="w-100 h-100 position-relative canvas-container remove-canvas-scroll-bar">
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
