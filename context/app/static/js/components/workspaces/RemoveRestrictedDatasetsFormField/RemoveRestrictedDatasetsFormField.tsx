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
import { useWorkspacesRestrictedDatasetsForm } from '../formHooks';

type Props<FormType extends FieldValues> = {
  control: Control<FormType>;
} & Pick<
  ReturnType<typeof useWorkspacesRestrictedDatasetsForm>,
  'restrictedHubmapIds' | 'removeRestrictedDatasets' | 'restrictedRows'
>;
function RemoveRestrictedDatasetsFormField<FormType extends FieldValues>({
  control,
  restrictedHubmapIds,
  removeRestrictedDatasets,
  restrictedRows,
}: Props<FormType>) {
  const handleCopyClick = useHandleCopyClick();
  const hubmapIdsString = generateCommaList(restrictedHubmapIds);

  return (
    restrictedHubmapIds.length > 0 && (
      <Box>
        <WorkspaceField
          control={control}
          name={'restricted-datasets' as Path<FormType>}
          label="Restricted Datasets"
          value={restrictedHubmapIds as PathValue<FormType, Path<FormType>>}
          error
          hideCharCount
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => handleCopyClick(hubmapIdsString)}>
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: true,
          }}
        />
        <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={removeRestrictedDatasets}>
          Remove Restricted Datasets ({restrictedRows.length})
        </Button>
      </Box>
    )
  );
}

export default RemoveRestrictedDatasetsFormField;
