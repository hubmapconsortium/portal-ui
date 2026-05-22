import React, { PropsWithChildren, ReactElement } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

interface StepProps {
  index?: number;
  title: string;
  isRequired?: boolean;
  hideRequiredText?: boolean;
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

function StepDescription({ blocks }: { blocks: (string | ReactElement<unknown>)[] }) {
  return (
    <Stack gap={2} p={2} component={Paper} direction="column">
      {blocks.map((block) => (typeof block === 'string' ? <Typography key={block}>{block}</Typography> : block))}
    </Stack>
  );
}
function Step({ index, title, isRequired = false, hideRequiredText, children }: PropsWithChildren<StepProps>) {
  const { color, text } = requiredVariants[isRequired.toString() as 'true' | 'false'];
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
          {title}
          {!hideRequiredText && ` (${text})`}
        </Typography>
      </Paper>
      <Paper sx={{ p: 2, mb: 2 }}>{children}</Paper>
    </>
  );
}

export { StepDescription };
export default Step;
