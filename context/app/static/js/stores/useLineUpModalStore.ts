import { create } from 'zustand';
import { ESEntityType } from 'js/components/types';

interface LineUpModalStore {
  isOpen: boolean;
  uuids?: string[];
  entityType?: ESEntityType;
  filters?: Record<string, unknown>;
  open: (params: { uuids?: string[]; entityType?: ESEntityType; filters?: Record<string, unknown> }) => void;
  close: () => void;
}

export const useLineUpModalStore = create<LineUpModalStore>((set) => ({
  isOpen: false,
  uuids: undefined,
  entityType: undefined,
  filters: undefined,
  open: ({ uuids, entityType, filters }) => {
    set({ isOpen: true, uuids, entityType, filters });
  },
  close: () => {
    set({ isOpen: false, uuids: undefined, entityType: undefined, filters: undefined });
  },
}));
