import React, { PropsWithChildren, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ContainerProps } from '@mui/material/Container';

import RouteLoader from '../RouteLoader';
import { StyledContainer } from './style';

export const leftRouteBoundaryID = 'left-route-boundary';
export const rightRouteBoundaryID = 'right-route-boundary';

function Route({ children, disableWidthConstraint = false }: PropsWithChildren<{ disableWidthConstraint: boolean }>) {
  const constrainWidthProps: Partial<ContainerProps> = disableWidthConstraint
    ? { maxWidth: false, disableGutters: true }
    : { maxWidth: 'lg' };

  return (
    <Suspense fallback={<RouteLoader />}>
      <Stack direction="row">
        <Box id={leftRouteBoundaryID} flex={disableWidthConstraint ? 0 : 1} sx={{ width: 0 }} />
        <StyledContainer {...constrainWidthProps} component="div">
          {children}
        </StyledContainer>
        <Box id={rightRouteBoundaryID} flex={disableWidthConstraint ? 0 : 1} sx={{ width: 0 }} />
      </Stack>
    </Suspense>
  );
}

export default Route;
