import { useCallback } from 'react';
import { useCreateAndLaunchWorkspace } from 'js/components/workspaces/api';

function useDatasetWorkspace({ entity_type, uuid }) {
  const { createAndLaunchWorkspace } = useCreateAndLaunchWorkspace();

  return useCallback(
    async ({ workspaceName }) => {
      await createAndLaunchWorkspace({
        path: `/entities/${entity_type.toLowerCase()}/${uuid}.ws.ipynb`,
        body: { workspace_name: workspaceName },
      });
    },
    [createAndLaunchWorkspace, entity_type, uuid],
  );
}

export { useDatasetWorkspace };
