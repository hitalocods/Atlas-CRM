import { create } from "zustand";

type UiState = {
  commandOpen: boolean;
  sidebarOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  commandOpen: false,
  sidebarOpen: false,
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((state) => ({ commandOpen: !state.commandOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
