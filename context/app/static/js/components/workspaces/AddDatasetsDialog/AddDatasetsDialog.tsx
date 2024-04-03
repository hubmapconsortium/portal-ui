import React, { useCallback, useState } from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { useController } from 'react-hook-form';

import Step from 'js/shared-styles/surfaces/Step';
import { useSelectItems } from 'js/hooks/useSelectItems';
import { Typography } from '@mui/material';
import { InternalLink } from 'js/shared-styles/Links';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';
import { SearchAheadHit, useAddWorkspaceDatasets, useSearchAhead } from './hooks';
import WorkspaceDatasetsTable from '../WorkspaceDatasetsTable';
import { useWorkspaceDetail } from '../hooks';
import { MAX_NUMBER_OF_WORKSPACE_DATASETS } from '../api';

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

function DatasetOption(props: React.HTMLAttributes<HTMLLIElement>, option: SearchAheadHit) {
  const {
    _source: { hubmap_id, assay_display_name, origin_samples_unique_mapped_organs },
  } = option;
  return (
    <li {...props}>
      <div>
        <Typography variant="subtitle1">{hubmap_id}</Typography>
        <Typography variant="body2">
          {[origin_samples_unique_mapped_organs, assay_display_name].filter((f) => f !== undefined).join(' | ')}
        </Typography>
      </div>
    </li>
  );
}

function HubmapIDTextField(params: AutocompleteRenderInputParams) {
  const { InputProps } = params;
  return (
    <TextField
      {...params}
      label="Enter HuBMAP ID"
      helperText="HuBMAP IDs follow the pattern HBM123.ABCD.456. Only one dataset can be added at a time."
      InputProps={{
        ...InputProps,
        startAdornment: (
          <>
            <InputAdornment position="start">HBM</InputAdornment>
            {InputProps.startAdornment}
          </>
        ),
      }}
    />
  );
}

const title = 'Add Datasets';
const tooManyDatasetsMessage =
  'Workspaces can currently only contain 10 datasets. Datasets can no longer be added to this workspace unless datasets are removed.';

function AddDatasetsDialog({ workspace }: { workspace: Workspace }) {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = React.useState<SearchAheadHit | null>(null);

  const workspaceId = workspace.id;

  const { onSubmit, handleSubmit, isSubmitting, control, errors, reset } = useAddWorkspaceDatasets({
    workspaceId,
  });

  const { field, fieldState } = useController({
    control,
    name: 'datasets',
  });

  const { selectedItems, addItem, setSelectedItems } = useSelectItems(field.value);

  const resetState = useCallback(() => {
    setInputValue('');
    setValue(null);
    setSelectedItems([]);
  }, [setSelectedItems, setInputValue]);

  const addDataset = useCallback(
    (e: React.SyntheticEvent<Element, Event>, newValue: SearchAheadHit | null) => {
      const datasetsCopy = selectedItems;
      const uuid = newValue?._source?.uuid;
      if (uuid) {
        setValue(newValue);
        addItem(uuid);
        field.onChange([...datasetsCopy, uuid]);
      }
    },
    [field, addItem, selectedItems],
  );

  const submit = useCallback(
    async ({ datasets }: { datasets: string[] }) => {
      await onSubmit({
        datasetUUIDs: datasets,
      });
    },
    [onSubmit],
  );

  const { workspaceDatasets } = useWorkspaceDetail({ workspaceId });

  const { searchHits } = useSearchAhead({ value: inputValue, valuePrefix: 'HBM', uuidsToExclude: workspaceDatasets });

  const errorMessage = fieldState?.error?.message;
  const tooManyDatasetsSelected = selectedItems.size + workspaceDatasets.length > MAX_NUMBER_OF_WORKSPACE_DATASETS;

  const errorMessages = [];

  if (tooManyDatasetsSelected) {
    errorMessages.push(tooManyDatasetsMessage);
  }
  if (errorMessage) {
    errorMessages.push(errorMessage);
  }

  const removeDatasets = useCallback(
    (uuids: string[]) => {
      const datasetsCopy = selectedItems;
      uuids.forEach((uuid) => datasetsCopy.delete(uuid));

      const updatedDatasetsArray = [...datasetsCopy];
      setSelectedItems(updatedDatasetsArray);
      field.onChange(updatedDatasetsArray);
    },
    [setSelectedItems, field, selectedItems],
  );

  return (
    <EditWorkspaceDialogContent
      title={title}
      reset={reset}
      resetState={resetState}
      handleSubmit={handleSubmit}
      onSubmit={submit}
      errors={errors}
      isSubmitting={isSubmitting}
      disabled={errorMessages.length > 0}
    >
      <Step title={title}>
        <Stack spacing={3}>
          {errorMessages.length > 0 && <ErrorMessages errorMessages={errorMessages} />}
          <SearchPagePrompt />
          <Autocomplete
            value={value}
            onChange={addDataset}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            filterOptions={(x) => x}
            options={searchHits}
            getOptionLabel={(hit: SearchAheadHit) => hit?._source?.hubmap_id}
            renderOption={DatasetOption}
            fullWidth
            renderInput={HubmapIDTextField}
          />
          <WorkspaceDatasetsTable
            datasetsUUIDs={[...workspaceDatasets, ...selectedItems]}
            label="Datasets"
            disabledIDs={new Set(workspaceDatasets)}
            removeDatasets={removeDatasets}
          />
        </Stack>
      </Step>
    </EditWorkspaceDialogContent>
  );
}

export default AddDatasetsDialog;
