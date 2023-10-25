import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

function useMetadataMenu() {
  const { selectedRows: selectedHits } = useSelectableTableStore();
  const { closeMenu } = useDropdownMenuStore();

  return { selectedHits, closeMenu };
}

export { useMetadataMenu };
