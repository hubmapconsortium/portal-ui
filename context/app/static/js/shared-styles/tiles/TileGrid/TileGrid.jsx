import React from 'react';

import { Grid } from './style';

function TileGrid({ children, ...rest }) {
  return <Grid {...rest}>{children}</Grid>;
}

export default TileGrid;
