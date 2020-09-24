import React from 'react';
import Typography from '@material-ui/core/Typography';

import { VerticalDivider } from './style';

function EntityHeaderItem({ text }) {
  return (
    <>
      <Typography variant="body1">{text}</Typography>
      <VerticalDivider orientation="vertical" flexItem />
    </>
  );
}

export default EntityHeaderItem;
