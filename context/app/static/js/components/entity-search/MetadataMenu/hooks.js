import { useCallback } from 'react';

import { useStore as useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useCreateAndLaunchWorkspace } from 'js/components/workspaces/hooks';

function useMetadataMenu(lcPluralType) {
  const { selectedRows: selectedHits } = useSelectableTableStore();
  const { closeMenu } = useDropdownMenuStore();

  const createAndLaunchWorkspace = useCreateAndLaunchWorkspace();

  const createNotebook = useCallback(
    async ({ workspaceName }) => {
      await createAndLaunchWorkspace({
        path: `entities/${lcPluralType}.ipynb`,
        body: { uuids: [...selectedHits], workspace_name: workspaceName },
      });
      closeMenu();
    },
    [closeMenu, createAndLaunchWorkspace, lcPluralType, selectedHits],
  );
  return { createNotebook, selectedHits, closeMenu };
}

export { useMetadataMenu };
