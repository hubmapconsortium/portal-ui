import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InputAdornment from '@mui/material/InputAdornment';
import { Control, FieldValues, Path, PathValue } from 'react-hook-form';

import WorkspaceField from 'js/components/workspaces/WorkspaceField';
import { useHandleCopyClick } from 'js/hooks/useCopyText';
import { generateCommaList } from 'js/helpers/functions';
import { useWorkspacesProtectedDatasetsForm } from '../formHooks';

type Props<FormType extends FieldValues> = {
  control: Control<FormType>;
} & Pick<
  ReturnType<typeof useWorkspacesProtectedDatasetsForm>,
  'inaccessibleHubmapIds' | 'removeInaccessibleDatasets' | 'inaccessibleRows'
>;
function RemoveProtectedDatasetsFormField<FormType extends FieldValues>({
  control,
  inaccessibleHubmapIds,
  removeInaccessibleDatasets,
  inaccessibleRows,
}: Props<FormType>) {
  const handleCopyClick = useHandleCopyClick();

  return (
    inaccessibleHubmapIds.length > 0 && (
      <Box>
        <WorkspaceField
          control={control}
          name={'protected-datasets' as Path<FormType>}
          label="Protected Datasets"
          value={inaccessibleHubmapIds as PathValue<FormType, Path<FormType>>}
          error
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleCopyClick(generateCommaList(inaccessibleHubmapIds))}>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: true,
          }}
        />
        <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={removeInaccessibleDatasets}>
          Remove Protected Datasets ({inaccessibleRows.length})
        </Button>
      </Box>
    )
  );
}

export default RemoveProtectedDatasetsFormField;
