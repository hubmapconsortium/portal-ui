import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { queryTypes } from 'js/components/cells/queryTypes';
import { useMolecularDataQueryFormState } from './hooks';
import { FormFieldContainer, FormFieldSubtitle } from './FormField';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';

function QueryType() {
  const { register, watch } = useMolecularDataQueryFormState();
  const { track } = useMolecularDataQueryFormTracking();
  return (
    <FormFieldContainer title="Query Type">
      <FormFieldSubtitle>
        Choose to retrieve gene or cell type data. Each has a selection of query methods to choose from.
      </FormFieldSubtitle>
      <TextField
        id="query-select"
        label="Query Type"
        variant="outlined"
        select
        fullWidth
        {...register('queryType', {
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            track('Parameters / Select Query Type', event.target.value);
          },
        })}
        value={watch('queryType')}
      >
        {Object.values(queryTypes).map((type) => (
          <MenuItem value={type.value} key={type.value}>
            {type.label}
          </MenuItem>
        ))}
        {/* Protein queries were retired with the Cells Cross-Modality API. */}
        <MenuItem value="protein" disabled>
          Protein (Deprecated)
        </MenuItem>
      </TextField>
    </FormFieldContainer>
  );
}

export default QueryType;
