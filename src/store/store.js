import create from "zustand";

export const useStore = create((set) => ({
  // scrollSpeed of image blocks
  scrollSpeed: 0, // always >= 0
  setScrollSpeed: (speed) => set(() => ({ scrollSpeed: speed })),
  // scrollDirection of image blocks
  scrollDirection: "L", //can only be "L" or "R"
  setScrollDirection: (dir) => set(() => ({ scrollDirection: dir })),
}));
