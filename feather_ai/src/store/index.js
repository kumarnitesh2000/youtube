import create from "zustand";

const useStore = create((set) => ({
  template: {},
  setTemplate: (newState) => set({ template: newState }),
  answer_sheet: {},
  setAnswerSheet: (newState) => set({ answer_sheet: newState }),
}));

export default useStore;
