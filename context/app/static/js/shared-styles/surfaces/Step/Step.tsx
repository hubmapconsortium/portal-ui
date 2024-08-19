import React, { PropsWithChildren, ReactElement } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface StepProps {
  index?: number;
  title: string;
  isRequired?: boolean;
}

interface RequiredVariant {
  text: string;
  color: string;
}

const requiredVariants = {
  true: {
    text: 'Required',
    color: 'secondary',
  },
  false: {
    text: 'Optional',
    color: 'secondaryContainer',
  },
};

function StepDescription({ blocks }: { blocks: (string | ReactElement)[] }) {
  return (
    <Stack gap={2} p={2} component={Paper} direction="column">
      {blocks.map((block) => (
        <Typography key={String(block)}>{block}</Typography>
      ))}
    </Stack>
  );
}
function Step({ index, title, isRequired = false, children }: PropsWithChildren<StepProps>) {
  const { color, text } = requiredVariants[isRequired.toString() as 'true' | 'false'] as RequiredVariant;
  return (
    <>
      <Paper
        sx={{
          backgroundColor: `${color}.main`,
          p: 2,
          mt: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: `${color}.contrastText` }}>
          {index !== undefined && `${index + 1}. `}
          {`${title} (${text})`}
        </Typography>
      </Paper>
      <Paper sx={{ p: 2 }}>{children}</Paper>
    </>
  );
}

export { StepDescription };
export default Step;
