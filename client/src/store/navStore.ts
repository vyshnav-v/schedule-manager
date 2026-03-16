import { create } from 'zustand';

interface NavState {
  navigating: boolean;
  setNavigating: (v: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  navigating: false,
  setNavigating: (v) => set({ navigating: v }),
}));
