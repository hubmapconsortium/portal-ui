import React, { ChangeEvent } from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useMolecularDataQueryFormState } from './hooks';
import { FormFieldContainer, FormFieldSubtitle } from './FormField';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';

const queryMethods = [
  { value: 'scFind', label: 'RNAseq (gene expression)', disabled: false },
  { value: 'scFindATAC', label: 'ATACseq (DNA accessibility)', disabled: false },
];

const scFindLink = <OutboundIconLink href="https://doi.org/10.1038/s41592-021-01076-9">scFind</OutboundIconLink>;

const description = (
  <>
    Choose between RNAseq (gene expression) and ATACseq (DNA accessibility) experiments to retrieve data. Methodology
    Source: {scFindLink}.
  </>
);

export default function QueryMethod() {
  const { watch, register } = useMolecularDataQueryFormState();

  const { track } = useMolecularDataQueryFormTracking();

  return (
    <FormFieldContainer title="Query Method">
      <FormFieldSubtitle>{description}</FormFieldSubtitle>
      <TextField
        id="query-method-select"
        label="Query Method"
        variant="outlined"
        select
        fullWidth
        value={watch('queryMethod')}
        {...register('queryMethod', {
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            track('Parameters Select Query Method', event.target.value);
          },
        })}
        slotProps={{
          select: {
            MenuProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
              },
            },
          },
        }}
      >
        {queryMethods.map((method) => (
          <MenuItem value={method.value} key={method.value} disabled={method.disabled}>
            {method.label} {method.disabled && '(coming soon)'}
          </MenuItem>
        ))}
      </TextField>
    </FormFieldContainer>
  );
}
