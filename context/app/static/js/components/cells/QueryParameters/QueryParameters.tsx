import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import LogSlider from 'js/shared-styles/inputs/LogSlider';
import AutocompleteEntity from 'js/components/cells/AutocompleteEntity';
import { queryTypes } from 'js/components/cells/queryTypes';
import MarkedSlider from 'js/shared-styles/inputs/MarkedSlider';
import { StyledDiv } from './style';
import { useDatasetsSelectedByExpression } from './hooks';
import GenomicModality from './GenomicModality';

interface DatasetsSelectedByExpressionProps {
  defaultEntity?: string;
}

function BiomarkerParameters() {
  const { queryType, minExpressionLog, setMinExpressionLog, minCellPercentage, setMinCellPercentage } =
    useDatasetsSelectedByExpression();
  const queryMeasurement = queryTypes[queryType].measurement;
  return (
    <>
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
    </>
  );
}

function DatasetsSelectedByExpression({ defaultEntity }: DatasetsSelectedByExpressionProps) {
  const { message, queryType, setCellVariableNames, handleSubmit, cellVariableNames } =
    useDatasetsSelectedByExpression();

  const isBiomarker = queryType !== 'cell-type';

  return (
    <StyledDiv>
      <AutocompleteEntity targetEntity={queryType} setter={setCellVariableNames} defaultValue={defaultEntity} />
      {isBiomarker && <BiomarkerParameters />}
      <Box mt={2}>
        <Button
          onClick={() => {
            handleSubmit().catch(() => {
              /* do nothing since handleSubmit has its own error handling */
            });
          }}
          disabled={cellVariableNames.length === 0}
          variant="contained"
          color="primary"
          id="run-query-button"
        >
          Run Query
        </Button>
      </Box>
      <Typography>{message}</Typography>
    </StyledDiv>
  );
}

export default DatasetsSelectedByExpression;
