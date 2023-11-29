import React, { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

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

function Step({ index, title, isRequired = false, children }: PropsWithChildren<StepProps>) {
  const { color, text } = requiredVariants[isRequired.toString() as 'true' | 'false'] as RequiredVariant;
  return (
    <>
      <Paper
        sx={{
          backgroundColor: `${color}.main`,
          p: 2,
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

export default Step;
