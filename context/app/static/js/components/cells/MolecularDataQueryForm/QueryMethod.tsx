import React, { ChangeEvent } from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import OutboundIconLink from 'js/shared-styles/Links/iconLinks/OutboundIconLink';
import { useMolecularDataQueryFormState } from './hooks';
import { FormFieldContainer, FormFieldSubtitle } from './FormField';
import { useMolecularDataQueryFormTracking } from './MolecularDataQueryFormTrackingProvider';

const queryMethods = {
  gene: [
    { value: 'scFind', label: 'scFind - RNAseq experiments (gene expression)', disabled: false },
    {
      value: 'crossModalityRNA',
      label: 'Cells Cross-Modality - RNAseq experiments (gene expression)',
      disabled: false,
    },
    {
      value: 'crossModalityATAC',
      label: 'Cells Cross-Modality - ATACseq experiments (DNA accessibility)',
      disabled: false,
    },
  ],
  'cell-type': [
    { value: 'scFind', label: 'scFind (RNASeq)', disabled: false },
    { value: 'crossModality', label: 'Cells Cross-Modality', disabled: false },
  ],
  protein: undefined,
};

const scFindLink = <OutboundIconLink href="https://doi.org/10.1038/s41592-021-01076-9">scFind</OutboundIconLink>;

const description = {
  gene: (
    <>
      Choose the query method to retrieve data. {scFindLink} is tailored for RNAseq analyses, while Cells Cross-Modality
      supports RNAseq and ATACseq datasets.
    </>
  ),
  'cell-type': (
    <>
      Choose the query method to retrieve data. {scFindLink} is tailored for RNAseq analyses, while Cells Cross-Modality
      supports RNAseq, ATACseq and proteomic datasets.
    </>
  ),
  protein: undefined,
};

function ProteinQueryMethod() {
  return (
    <FormFieldContainer title="Query Method">
      <FormFieldSubtitle>Protein queries currently only support the Cells Cross-Modality method.</FormFieldSubtitle>
    </FormFieldContainer>
  );
}

export default function QueryMethod() {
  const { watch, register } = useMolecularDataQueryFormState();

  const queryType = watch('queryType');

  const { track } = useMolecularDataQueryFormTracking();

  if (queryType === 'protein') {
    return <ProteinQueryMethod />;
  }

  const currentQueryMethods = queryMethods[queryType];
  const currentDescription = description[queryType];

  if (!currentQueryMethods || !currentDescription) {
    return null;
  }

  return (
    <FormFieldContainer title="Query Method">
      <FormFieldSubtitle>{currentDescription}</FormFieldSubtitle>
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
        {currentQueryMethods.map((method) => (
          <MenuItem value={method.value} key={method.value} disabled={method.disabled}>
            {method.label} {method.disabled && '(coming soon)'}
          </MenuItem>
        ))}
      </TextField>
    </FormFieldContainer>
  );
}
