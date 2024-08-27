import { createStoreContext, createStoreImmer } from 'js/helpers/zustand';
import { Version } from './types';

interface SelectedVersionData {
  initialVersionUUIDs: string[];
  versions: Map<string, Version[]>;
  selectedVersions: Map<string, Version | null>;
  currentSelectedUUIDs: string[];
}

interface SelectedVersionAction {
  setVersions: (uuid: string, versions: Version[]) => void;
  setSelectedVersion: (uuid: string, version: Version | string) => void;
}

export type SelectedVersionStoreType = SelectedVersionData & SelectedVersionAction;

interface SelectedVersionStoreInput {
  initialVersionUUIDs: string[];
}

export const createSelectedVersionStore = ({ initialVersionUUIDs }: SelectedVersionStoreInput) =>
  createStoreImmer<SelectedVersionStoreType>((set) => ({
    versions: new Map(),
    selectedVersions: new Map(),
    initialVersionUUIDs,
    currentSelectedUUIDs: initialVersionUUIDs,
    setVersions: (uuid, versions) =>
      set((state) => {
        state.versions.set(uuid, versions);
        state.selectedVersions.set(uuid, versions.find((v) => v.uuid === uuid) ?? null);
      }),
    setSelectedVersion: (uuid, newVersion) =>
      set((state) => {
        const versionObject =
          typeof newVersion === 'string' ? state.versions.get(uuid)?.find((v) => v.uuid === newVersion) : newVersion;
        if (!versionObject) return;
        state.selectedVersions.set(uuid, versionObject);
        state.currentSelectedUUIDs = [...state.selectedVersions.values()].map(
          (v, idx) => v?.uuid ?? state.initialVersionUUIDs[idx],
        );
      }),
  }));

const [SelectedVersionStoreProvider, useSelectedVersionStore] = createStoreContext<
  SelectedVersionStoreType,
  SelectedVersionStoreInput
>(createSelectedVersionStore, 'Selected Version Store');

export { SelectedVersionStoreProvider, useSelectedVersionStore };
