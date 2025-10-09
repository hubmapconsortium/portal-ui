import { create } from 'zustand';
import { ESEntityType } from 'js/components/types';

interface LineUpModalStore {
  isOpen: boolean;
  uuids?: string[];
  entityType?: ESEntityType;
  open: (params: { uuids?: string[]; entityType?: ESEntityType }) => void;
  close: () => void;
}

export const useLineUpModalStore = create<LineUpModalStore>((set) => ({
  isOpen: false,
  uuids: undefined,
  entityType: undefined,
  open: ({ uuids, entityType }) => {
    set({ isOpen: true, uuids, entityType });
  },
  close: () => {
    set({ isOpen: false, uuids: undefined, entityType: undefined });
  },
}));
