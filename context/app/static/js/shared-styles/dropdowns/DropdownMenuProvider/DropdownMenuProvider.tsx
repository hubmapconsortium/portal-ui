import { createStoreContextWithRef } from 'js/helpers/zustand';
import { createStore, DropdownMenuStore, CreateDropdownMenuStore } from './store';

const [DropdownMenuProvider, useDropdownMenuStore] = createStoreContextWithRef<
  DropdownMenuStore,
  CreateDropdownMenuStore,
  HTMLDivElement
>(createStore, 'DropdownMenuStore');

export { useDropdownMenuStore };
export default DropdownMenuProvider;
