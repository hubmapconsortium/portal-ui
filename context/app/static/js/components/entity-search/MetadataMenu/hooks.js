import { useCallback } from 'react';

import { useStore as useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import { useStore as useSelectedTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';
import { useCreateAndLaunchWorkspace } from 'js/components/workspaces/hooks';

function useMetadataMenu(lcPluralType) {
  const { selectedRows: selectedHits } = useSelectedTableStore();
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
