import { create } from 'zustand';

// Store גלובאלי לניהול מצב ההדרכה
export const useWalktourStore = create((set) => ({
  isHelpActive: false,
  toggleHelp: () => set((state) => ({ isHelpActive: !state.isHelpActive })),
  setHelpActive: (value) => set({ isHelpActive: value })
}));
