import React from 'react';

import { Grid } from './style';

function TileGrid({ children, ...rest }: React.ComponentProps<typeof Grid>) {
  return <Grid {...rest}>{children}</Grid>;
}

export default TileGrid;
