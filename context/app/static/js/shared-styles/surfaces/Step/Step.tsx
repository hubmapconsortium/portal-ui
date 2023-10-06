import React, { PropsWithChildren } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface StepProps {
  index: number;
  title: string;
  isRequired: boolean;
}

function Step({ index, title, isRequired, children }: PropsWithChildren<StepProps>) {
  return (
    <>
      <Paper
        sx={({ palette, spacing }) => ({
          backgroundColor: palette.secondary[isRequired ? 'main' : 'light'],
          padding: spacing(2),
        })}
      >
        <Typography variant="subtitle2" sx={({ palette }) => ({ color: palette.secondary.contrastText })}>{`${
          index + 1
        }. ${title} (${isRequired ? 'Required' : 'Optional'})`}</Typography>
      </Paper>
      <Paper sx={({ spacing }) => ({ padding: spacing(2) })}>{children}</Paper>
    </>
  );
}

export default Step;
