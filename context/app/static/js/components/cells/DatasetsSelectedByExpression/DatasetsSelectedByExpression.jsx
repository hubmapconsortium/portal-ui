import React from 'react';

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import LogSlider from 'js/shared-styles/inputs/LogSlider';
import AutocompleteEntity from 'js/components/cells/AutocompleteEntity';

import MarkedSlider from 'js/shared-styles/inputs/MarkedSlider';
import { StyledDiv, StyledTextField } from './style';
import { useDatasetsSelectedByExpression } from './hooks';

function DatasetsSelectedByExpression({
  completeStep,
  setResults,
  minExpressionLog,
  setMinExpressionLog,
  minCellPercentage,
  setMinCellPercentage,
  cellVariableNames,
  setCellVariableNames,
  queryType,
  setIsLoading,
}) {
  const { genomicModality, handleSelectModality, handleSubmit, message } = useDatasetsSelectedByExpression({
    completeStep,
    setResults,
    minExpressionLog,
    minCellPercentage,
    cellVariableNames,
    queryType,
    setIsLoading,
  });

  return (
    <StyledDiv>
      <AutocompleteEntity
        targetEntity={`${queryType}s`}
        setter={setCellVariableNames}
        cellVariableNames={cellVariableNames}
        setCellVariableNames={setCellVariableNames}
      />
      {queryType === 'gene' && (
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
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            },
          }}
          helperText="Genomic modality refers to Gene Expression (RNA) or DNA Accessibility (ATAC)."
        >
          <MenuItem value="rna">Gene Expression (RNA)</MenuItem>
          <MenuItem value="atac">DNA Accessibility (ATAC)</MenuItem>
        </StyledTextField>
      )}
      <div>
        <LogSlider
          label="Minimum Expression Level"
          helperText="Set the minimum gene expression level to refine your dataset selections."
          value={minExpressionLog}
          minLog={-4}
          maxLog={5}
          onChange={(e, val) => setMinExpressionLog(val)}
          id="min-expression"
        />
      </div>
      <div>
        <MarkedSlider
          label="Minimum Cell Percentage (%)"
          helperText="Set the minimum cell percentage for cells in the datasets to represent the minimum expression level."
          value={minCellPercentage}
          min={0}
          max={10}
          marks={[0, 1, 2, 5, 10].map((m) => ({ value: m, label: m || '>0' }))}
          onChange={(e, val) => setMinCellPercentage(val)}
          id="min-cell-percentage"
        />
      </div>
      <div>
        <Button onClick={handleSubmit} disabled={cellVariableNames.length === 0} variant="contained" color="primary">
          Run Query
        </Button>
      </div>
      <Typography>{message}</Typography>
    </StyledDiv>
  );
}

export default DatasetsSelectedByExpression;
