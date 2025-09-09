import React, { PropsWithChildren } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface QuerySubtitleProps extends PropsWithChildren {
  additionalText?: string;
}

export default function QuerySubtitle({ children, additionalText }: QuerySubtitleProps) {
  return (
    <Stack direction="column" spacing={0.5}>
      <Typography variant="body1">{children}</Typography>
      <Typography variant="caption">{additionalText}</Typography>
    </Stack>
  );
}
