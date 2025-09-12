import React, { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface FormFieldContainerProps extends PropsWithChildren {
  title: string;
}

export function FormFieldContainer({ title, children }: FormFieldContainerProps) {
  return (
    <Stack gap={2} py={2}>
      <Typography variant="subtitle2">{title}</Typography>
      {children}
    </Stack>
  );
}

export function FormFieldSubtitle({ children }: PropsWithChildren) {
  return <Typography variant="body2">{children}</Typography>;
}
