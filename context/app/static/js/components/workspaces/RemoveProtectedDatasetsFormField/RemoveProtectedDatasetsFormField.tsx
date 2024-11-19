import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';
import { Control, FieldValues, Path, PathValue } from 'react-hook-form';

import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { useWorkspacesProtectedDatasetsForm } from '../formHooks';

type Props<FormType extends FieldValues> = {
  control: Control<FormType>;
} & Pick<
  ReturnType<typeof useWorkspacesProtectedDatasetsForm>,
  'protectedHubmapIds' | 'removeProtectedDatasets' | 'protectedRows'
>;
function RemoveProtectedDatasetsFormField<FormType extends FieldValues>({
  control,
  protectedHubmapIds,
  removeProtectedDatasets,
  protectedRows,
}: Props<FormType>) {
  const handleCopyClick = useHandleCopyClick();

  return (
    protectedHubmapIds.length > 0 && (
      <Box>
        <WorkspaceField
          control={control}
          name={'protected-datasets' as Path<FormType>}
          label="Protected Datasets"
          value={protectedHubmapIds as PathValue<FormType, Path<FormType>>}
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
    )
  );
}

export default RemoveProtectedDatasetsFormField;
