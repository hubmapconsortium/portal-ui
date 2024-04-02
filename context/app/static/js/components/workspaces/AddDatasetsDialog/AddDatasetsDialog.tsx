import React, { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import Step from 'js/shared-styles/surfaces/Step';
import { useSelectItems } from 'js/hooks/useSelectItems';
import { Typography } from '@mui/material';
import { InternalLink } from 'js/shared-styles/Links';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';
import { SearchAheadHit, useAddWorkspaceDatasets, useSearchAhead } from './hooks';
import WorkspaceDatasetsTable from '../WorkspaceDatasetsTable';
import { useWorkspaceDetail } from '../hooks';

const searchPageRoute = '/search?entity_type[0]=Dataset';

function SearchPagePrompt() {
  return (
    <Stack component={Paper} spacing={2} padding={2}>
      <Typography>
        Enter HuBMAP IDs below to add to a workspace. Datasets that already exist in the workspace cannot be selected
        for deletion.
      </Typography>
      <Typography>
        To search for more HuBMAP datasets to be added, navigate to the{' '}
        <InternalLink href={searchPageRoute}>datasets search page</InternalLink>.
      </Typography>
      <div>
        <Button href={searchPageRoute} variant="contained" color="primary">
          Navigate To Search Page
        </Button>
      </div>
    </Stack>
  );
}

const title = 'Add Datasets';

function AddDatasetsDialog({ workspace }: { workspace: Workspace }) {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = React.useState<SearchAheadHit | null>(null);
  const { selectedItems, addItem } = useSelectItems([]);

  const workspaceId = workspace.id;

  const { onSubmit, handleSubmit, isSubmitting, errors, reset } = useAddWorkspaceDatasets({
    workspaceId,
  });

  const submit = useCallback(async () => {
    await onSubmit({
      datasetUUIDs: [...selectedItems],
    });
  }, [onSubmit, selectedItems]);

  const { searchHits } = useSearchAhead({ value: inputValue, valuePrefix: 'HBM' });

  const { workspaceDatasets } = useWorkspaceDetail({ workspaceId });

  return (
    <EditWorkspaceDialogContent
      title={title}
      reset={reset}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
    >
      <input type="hidden" name="topic" value="something" />
      <Step title={title}>
        <Stack spacing={3}>
          <SearchPagePrompt />
          <Autocomplete
            value={value}
            onChange={(event: React.SyntheticEvent<Element, Event>, newValue: SearchAheadHit | null) => {
              if (newValue?._source?.uuid) {
                addItem(newValue?._source?.uuid);
                setValue(newValue);
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            filterOptions={(x) => x}
            options={searchHits}
            getOptionLabel={(hit: SearchAheadHit) => hit?._source?.hubmap_id}
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter HuBMAP ID"
                helperText="HuBMAP IDs follow the pattern HBM123.ABCD.456. Only one dataset can be added at a time."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">HBM</InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <WorkspaceDatasetsTable
            datasetsUUIDs={[...workspaceDatasets, ...selectedItems]}
            label="Datasets"
            disabledIDs={new Set(workspaceDatasets)}
          />
        </Stack>
      </Step>
    </EditWorkspaceDialogContent>
  );
}

export default AddDatasetsDialog;
