import React, { PropsWithChildren, ReactNode } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { truncateText } from './utils';

function EntityHeaderItem({
  startIcon,
  endIcon,
  children,
}: PropsWithChildren<{ startIcon?: ReactNode; endIcon?: ReactNode }>) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ svg: { fontSize: '1.25rem' } }}>
      {startIcon}
      <Typography> {typeof children === 'string' ? truncateText(children) : children}</Typography>
      {endIcon}
    </Stack>
  );
}

export default EntityHeaderItem;
