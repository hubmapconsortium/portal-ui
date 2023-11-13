import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';

import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import useProtectedDatasetsForm from 'js/components/workspaces/NewWorkspaceDialog/useProtectedDatasetsForm';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';
import { useCreateWorkspaceForm, CreateWorkspaceFormTypes } from './useCreateWorkspaceForm';

function NewWorkspaceDialogFromSelections() {
  const { errorMessages, protectedHubmapIds, removeProtectedDatasets, protectedRows, selectedRows } =
    useProtectedDatasetsForm();
  const { deselectRows } = useSelectableTableStore();

  const { control, errors, setDialogIsOpen, ...rest } = useCreateWorkspaceForm({});
  const handleCopyClick = useHandleCopyClick();

  return (
    <>
      <MenuItem onClick={() => setDialogIsOpen(true)}>Create New Workspace</MenuItem>
      <NewWorkspaceDialog
        datasetUUIDs={selectedRows}
        control={control}
        errors={errors}
        errorMessages={errorMessages}
        removeDatasets={deselectRows}
        {...rest}
      >
        {protectedHubmapIds.length > 0 && (
          <Box>
            <ErrorMessages errorMessages={errorMessages} />
            <WorkspaceField<CreateWorkspaceFormTypes>
              control={control}
              name="protected-datasets"
              label="Protected Datasets"
              value={protectedHubmapIds}
              error
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleCopyClick(protectedHubmapIds)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                readOnly: true,
              }}
            />
            <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={removeProtectedDatasets}>
              Remove Protected Datasets ({protectedRows.length})
            </Button>
          </Box>
        )}
      </NewWorkspaceDialog>
    </>
  );
}

export default NewWorkspaceDialogFromSelections;
