import React from 'react';

import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import LogSlider from 'js/shared-styles/inputs/LogSlider';
import AutocompleteEntity from 'js/components/cells/AutocompleteEntity';
import { queryTypes } from 'js/components/cells/queryTypes';
import MarkedSlider from 'js/shared-styles/inputs/MarkedSlider';
import { StyledDiv, StyledTextField } from './style';
import { useDatasetsSelectedByExpression } from './hooks';

function GenomicModality() {
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

interface DatasetsSelectedByExpressionProps {
  runQueryButtonRef: React.RefObject<HTMLButtonElement>;
}

function DatasetsSelectedByExpression({ runQueryButtonRef }: DatasetsSelectedByExpressionProps) {
  const {
    handleSubmit,
    message,
    queryType,
    minExpressionLog,
    setMinExpressionLog,
    minCellPercentage,
    setMinCellPercentage,
    cellVariableNames,
    setCellVariableNames,
  } = useDatasetsSelectedByExpression();

  const queryMeasurement = queryTypes[queryType as keyof typeof queryTypes].measurement;

  return (
    <StyledDiv>
      <AutocompleteEntity targetEntity={`${queryType}s`} setter={setCellVariableNames} />
      <GenomicModality />
      <div>
        <LogSlider
          label={`Minimum ${queryMeasurement}`}
          helperText={`Set the minimum ${queryType} ${queryMeasurement.toLowerCase()} to refine your dataset selections.`}
          value={minExpressionLog}
          minLog={-4}
          maxLog={5}
          onChange={(e, val) => setMinExpressionLog(val as number)}
          id="min-measurement"
        />
      </div>
      <div>
        <MarkedSlider
          label="Minimum Cell Percentage (%)"
          helperText={`Set the minimum cell percentage for cells in the datasets to represent the minimum ${queryMeasurement.toLowerCase()}.`}
          value={minCellPercentage}
          min={0}
          max={10}
          marks={[0, 1, 2, 5, 10].map((m) => ({ value: m, label: m || '>0' }))}
          // using a type assertion below because the MUI type definition for onChange is incorrect
          // Since there can be multiple values for a slider, onChange's value can be an array
          // However, unlike other cases where this is the case, the type definition for onChange is
          // not written in a way where the `onChange` type is inferred from the `value` type 
          onChange={(_e, val) => setMinCellPercentage(val as number)}
          id="min-cell-percentage"
        />
      </div>
      <div>
        <Button
          onClick={handleSubmit}
          disabled={cellVariableNames.length === 0}
          variant="contained"
          color="primary"
          id="run-query-button"
          ref={runQueryButtonRef}
        >
          Run Query
        </Button>
      </div>
      <Typography>{message}</Typography>
    </StyledDiv>
  );
}

export default DatasetsSelectedByExpression;
