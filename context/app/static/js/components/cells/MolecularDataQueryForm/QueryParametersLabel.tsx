import React from 'react';
import StepLabel from '@mui/material/StepLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCellVariableNames, useMolecularDataQueryFormState } from './hooks';
import QuerySubtitle from './QuerySubtitle';

function VariableText() {
  const { watch } = useMolecularDataQueryFormState();
  const queryType = watch('queryType');
  const queryMethod = watch('queryMethod');
  const cellVariableNames = useCellVariableNames();
  const expressionLevel = watch('minimumExpressionLevel');
  const threshold = watch('minimumCellPercentage');
  const pathway = watch('pathway');

  const variables = cellVariableNames.join(', ');
  switch (queryType) {
    case 'gene':
      if (queryMethod === 'scFind') {
        if (pathway) {
          return <QuerySubtitle additionalText={variables}>{`${queryMethod} | ${pathway.full}`}</QuerySubtitle>;
        }
        return <QuerySubtitle additionalText={variables}>{queryMethod}</QuerySubtitle>;
      }

      return (
        <QuerySubtitle additionalText={variables}>
          Expression Level 10<sup>{expressionLevel}</sup> | {threshold}% Cell
        </QuerySubtitle>
      );

    case 'cell-type':
      return <QuerySubtitle additionalText={variables}>{queryMethod}</QuerySubtitle>;
    case 'protein':
      return (
        <QuerySubtitle additionalText={variables}>
          Abundance Level 10<sup>{expressionLevel}</sup> | {threshold}% Cell
        </QuerySubtitle>
      );
    default:
      return '';
  }
}

interface QueryParametersLabelProps {
  activeStep: number;
  handleBackToParameters: () => void;
}

export default function QueryParametersLabel({ activeStep, handleBackToParameters }: QueryParametersLabelProps) {
  return (
    <StepLabel>
      <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" gap={2} useFlexGap>
        <Stack direction="column">
          <Typography variant="subtitle1">Parameters</Typography>
          {activeStep !== 0 && <VariableText />}
        </Stack>
        {activeStep !== 0 && (
          <Button variant="contained" onClick={handleBackToParameters} sx={{ maxWidth: 'fit-content' }}>
            Edit Parameters
          </Button>
        )}
      </Stack>
    </StepLabel>
  );
}
