import { createStoreContext } from 'js/helpers/zustand';
import { createStore, DropdownMenuStore, CreateDropdownMenuStore } from './store';

const [DropdownMenuProvider, useDropdownMenuStore] = createStoreContext<DropdownMenuStore, CreateDropdownMenuStore>(
  createStore,
  'DropdownMenuStore',
);

export { useDropdownMenuStore };
export default DropdownMenuProvider;
