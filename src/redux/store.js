import { configureStore } from "@reduxjs/toolkit";
import project from "./project.slice";
const store = configureStore({
  reducer: {
    project,
  },
});

export default store;
