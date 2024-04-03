import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';

import Step from 'js/shared-styles/surfaces/Step';
import { Typography } from '@mui/material';
import { InternalLink } from 'js/shared-styles/Links';
import ErrorMessages from 'js/shared-styles/alerts/ErrorMessages';
import { EditWorkspaceDialogContent } from '../EditWorkspaceDialog';
import { Workspace } from '../types';
import { SearchAheadHit, useAddDatasetsDialog } from './hooks';
import WorkspaceDatasetsTable from '../WorkspaceDatasetsTable';

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

function AddDatasetsDialog({ workspace }: { workspace: Workspace }) {
  const {
    autocompleteValue,
    inputValue,
    setInputValue,
    submit,
    handleSubmit,
    isSubmitting,
    errors,
    reset,
    resetState,
    addDataset,
    removeDatasets,
    searchHits,
    workspaceDatasets,
    allDatasets,
    errorMessages,
  } = useAddDatasetsDialog({ workspace });

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
            value={autocompleteValue}
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
            datasetsUUIDs={allDatasets}
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
