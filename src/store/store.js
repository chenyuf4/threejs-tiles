import create from "zustand";

export const useStore = create((set) => ({
  // clicked image
  clicked: -1, // no click = -1
  setClicked: (index) => set(() => ({ clicked: index })),
  scrollable: true,
  setScrollable: (input) => set(() => ({ scrollable: input })),
}));
