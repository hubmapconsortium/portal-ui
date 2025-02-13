import React from 'react';

import MenuItem from '@mui/material/MenuItem';

import { StyledTextField } from './style';
import { useDatasetsSelectedByExpression } from './hooks';

export default function GenomicModality() {
  const { genomicModality, handleSelectModality, queryType } = useDatasetsSelectedByExpression();
  if (queryType !== 'gene') {
    return null;
  }
  return (
    <StyledTextField
      id="modality-select"
      label="Genomic Modality"
      value={genomicModality}
      onChange={handleSelectModality}
      variant="outlined"
      select
      fullWidth
      SelectProps={{
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        },
      }}
      helperText="Genomic modality refers to Gene Expression (RNA) or DNA Accessibility (ATAC)."
    >
      <MenuItem value="rna">Gene Expression (RNA)</MenuItem>
      <MenuItem value="atac">DNA Accessibility (ATAC)</MenuItem>
    </StyledTextField>
  );
}
