import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import useProtectedDatasetsForm from 'js/components/workspaces/NewWorkspaceDialog/useProtectedDatasetsForm';
import { useCreateWorkspace } from './copiedHooks';

interface ProtectedDatasetsTypes {
  errorMessages: string[];
  protectedHubmapIds: string[];
  removeProtectedDatasets: () => void;
  protectedRows: string[];
  selectedRows: Set<string>;
}

function NewWorkspaceDialogFromSelections() {
  const { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows } =
    useProtectedDatasetsForm() as ProtectedDatasetsTypes;

  const { control, errors, ...rest } = useCreateWorkspace({});

  return (
    <NewWorkspaceDialog datasetUUIDs={selectedRows} control={control} errors={errors} {...rest}>
      {protectedHubmapIds.length > 0 && (
        <Box>
          <ErrorMessages errorMessages={errorMessages} />
          <WorkspaceField
            control={control}
            name="Protected Datasets"
            errors={errors}
            value={protectedHubmapIds}
            error
          />
          <Button sx={{ marginTop: 1 }} variant="contained" color="primary" onClick={removeProtectedDatasets}>
            Remove Protected Datasets ({protectedRows.length})
          </Button>
        </Box>
      )}
    </NewWorkspaceDialog>
  );
}

export default NewWorkspaceDialogFromSelections;
