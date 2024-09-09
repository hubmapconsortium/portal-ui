import React from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

import { UseDatasetsAutocompleteReturnType, SearchAheadHit } from './hooks';
import WorkspaceDatasetsTable from '../WorkspaceDatasetsTable';

function DatasetOption(props: React.HTMLAttributes<HTMLLIElement>, option: SearchAheadHit) {
  const {
    _source: { hubmap_id, assay_display_name, origin_samples_unique_mapped_organs },
  } = option;
  return (
    <li {...props}>
      <div>
        <Typography variant="subtitle1">{hubmap_id}</Typography>
        <Typography variant="body2">
          {[origin_samples_unique_mapped_organs, assay_display_name].filter(Boolean).join(' | ')}
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

function AddDatasetsTable({
  inputValue,
  setInputValue,
  autocompleteValue,
  addDataset,
  removeDatasets,
  workspaceDatasets,
  allDatasets,
  searchHits,
}: Omit<UseDatasetsAutocompleteReturnType, 'selectedDatasets' | 'resetAutocompleteState' | 'setSelectedDatasets'>) {
  return (
    // The padding top offsets the textfield label.
    <Stack spacing={3} pt={1}>
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
        disabledIDs={new Set(workspaceDatasets)}
        removeDatasets={removeDatasets}
        copyDatasets
      />
    </Stack>
  );
}

export default AddDatasetsTable;
