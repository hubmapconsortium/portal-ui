import React, { PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';

import { VerticalDivider } from './style';
import { truncateText } from './utils';

interface EntityHeaderItemProps {
  text: React.ReactNode;
}

function EntityHeaderItem({ text, children }: PropsWithChildren<EntityHeaderItemProps>) {
  return (
    <>
      <Typography display="flex" variant="body1">
        {typeof text === 'string' ? truncateText(text) : text}
      </Typography>
      {children}
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

export default EntityHeaderItem;
