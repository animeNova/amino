import { create } from 'zustand';

interface CreatePostDialogStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const useCreatePostDialogStore = create<CreatePostDialogStore>((set) => ({
  isOpen: false,
  user: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

export default useCreatePostDialogStore;
