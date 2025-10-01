import React, { useEffect, useRef } from 'react';
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

// set to dedupe for StrictMode remounts in dev
const trackedSignatures = new Set<string>();

type Props<FormType extends FieldValues> = {
  control: Control<FormType>;
  trackEventHelper: (numRestrictedDatasets: number) => void;
} & Pick<
  ReturnType<typeof useWorkspacesRestrictedDatasetsForm>,
  'restrictedHubmapIds' | 'removeRestrictedDatasets' | 'restrictedRows'
>;
function RemoveRestrictedDatasetsFormField<FormType extends FieldValues>({
  control,
  restrictedHubmapIds,
  removeRestrictedDatasets,
  restrictedRows,
  trackEventHelper,
}: Props<FormType>) {
  const handleCopyClick = useHandleCopyClick();
  const didTrack = useRef(false);

  // Needed to ensure we only track once per unique set of restricted IDs
  useEffect(() => {
    if (!restrictedHubmapIds || restrictedHubmapIds.length === 0) return;
    if (didTrack.current) return;

    // stable signature of what's being tracked
    const signature = restrictedHubmapIds.slice().sort().join(',');
    if (trackedSignatures.has(signature)) {
      didTrack.current = true;
      return;
    }

    trackedSignatures.add(signature);
    didTrack.current = true;
    trackEventHelper(restrictedHubmapIds.length);
  }, [restrictedHubmapIds, trackEventHelper]);

  if (restrictedHubmapIds.length < 1) return null;

  const hubmapIdsString = generateCommaList(restrictedHubmapIds);

  return (
    <Box>
      <WorkspaceField
        control={control}
        name={'restricted-datasets' as Path<FormType>}
        label="Restricted Datasets"
        value={restrictedHubmapIds.join(', ') as PathValue<FormType, Path<FormType>>}
        error
        hideCharCount
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    handleCopyClick(hubmapIdsString);
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </InputAdornment>
            ),
            readOnly: true,
          },
        }}
      />
      <Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={removeRestrictedDatasets}>
        Remove Restricted Datasets ({restrictedRows.length})
      </Button>
    </Box>
  );
}

export default RemoveRestrictedDatasetsFormField;
