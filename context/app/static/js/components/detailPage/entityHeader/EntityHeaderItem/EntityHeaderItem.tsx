import React from 'react';
import Typography from '@mui/material/Typography';

import { VerticalDivider } from './style';
import { truncateText } from './utils';

interface EntityHeaderItemProps {
  text: React.ReactNode;
}

function EntityHeaderItem({ text }: EntityHeaderItemProps) {
  return (
    <>
      <Typography variant="body1">{typeof text === 'string' ? truncateText(text) : text}</Typography>
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

export default EntityHeaderItem;
