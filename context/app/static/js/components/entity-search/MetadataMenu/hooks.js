import { useCallback } from 'react';

import { useStore as useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import { useStore as useSelectedTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

function useMetadataMenu(lcPluralType) {
  const { selectedRows: selectedHits } = useSelectedTableStore();
  const { closeMenu } = useDropdownMenuStore();
  const createNotebook = useCallback(
    async ({ workspaceName }) => {
      const response = await fetch(`/notebooks/${lcPluralType}.ipynb`, {
        method: 'POST',
        body: JSON.stringify({ uuids: [...selectedHits], workspace_name: workspaceName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Create workspace failed', response);
        closeMenu();
        return;
      }

      const json = await response.json();
      const { workspace_id, notebook_path } = json;
      document.location = `/workspaces/${workspace_id}?notebook_path=${encodeURIComponent(notebook_path)}`;
    },
    [closeMenu, lcPluralType, selectedHits],
  );
  return { createNotebook, selectedHits, closeMenu };
}

export { useMetadataMenu };
