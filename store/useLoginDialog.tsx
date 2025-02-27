import { create } from 'zustand';

interface LoginDialogStore {
  isOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const useLoginDialogStore = create<LoginDialogStore>((set) => ({
  isOpen: false,
  user: null,
  openLogin: () => set({ isOpen: true }),
  closeLogin: () => set({ isOpen: false }),
}));

export default useLoginDialogStore;
