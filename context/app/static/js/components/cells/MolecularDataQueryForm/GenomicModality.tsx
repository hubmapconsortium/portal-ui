import React from 'react';

import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useFormContext } from 'react-hook-form';
import { MolecularDataQueryFormState } from './types';

export default function GenomicModality() {
  const { watch, register } = useFormContext<MolecularDataQueryFormState>();

  const queryType = watch('queryType');

  if (queryType !== 'gene') {
    return null;
  }

  return (
    <TextField
      id="modality-select"
      label="Query Type"
      variant="outlined"
      select
      fullWidth
      {...register('queryMethod')}
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
      helperText="Genomic modality refers to Gene Expression (RNA) or DNA Accessibility (ATAC)."
    >
      <MenuItem value="scFind">scFind - RNAseq experiments (gene expression)</MenuItem>
      <MenuItem value="crossModalityRNA">Cells Cross-Modality - RNAseq experiments (gene expression)</MenuItem>
      <MenuItem value="crossModalityATAC">Cells Cross-Modality - ATACseq experiments (DNA accessibility)</MenuItem>
    </TextField>
  );
}
