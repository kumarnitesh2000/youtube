import create from "zustand";

const useStore = create((set) => ({
  timer: 0,
  setTimer: (newTimer) => set({ timer: newTimer }),
  inc: () => set((state) => ({ timer: state.timer + 1 })),
  selectedAction: null,
  setSelectedAction: (newAction) => set({ selectedAction: newAction }),
}));

export default useStore;
