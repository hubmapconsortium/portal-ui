import React, { PropsWithChildren, Suspense } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { ContainerProps } from '@mui/material/Container';

import { useIsLargeDesktop } from 'js/hooks/media-queries';
import RouteLoader from '../RouteLoader';
import { StyledContainer } from './style';

export const leftRouteBoundaryID = 'left-route-boundary';
export const rightRouteBoundaryID = 'right-route-boundary';

function RouteBoundary({
  id,
  showBoundary,
}: {
  id: typeof leftRouteBoundaryID | typeof rightRouteBoundaryID;
  showBoundary: boolean;
}) {
  return <Box id={id} flex="1 0" padding={2} display={!showBoundary ? 'none' : 'block'} />;
}

function Route({ children, disableWidthConstraint = false }: PropsWithChildren<{ disableWidthConstraint: boolean }>) {
  const constrainWidthProps: Partial<ContainerProps> = disableWidthConstraint
    ? { maxWidth: false, disableGutters: true }
    : { maxWidth: 'lg' };

  const isDesktop = useIsLargeDesktop();
  const shouldShowBoundaries = !disableWidthConstraint && isDesktop;

  return (
    <Stack direction="row" width="100%" flexGrow={1}>
      <RouteBoundary id={leftRouteBoundaryID} showBoundary={shouldShowBoundaries} />
      <Suspense fallback={<RouteLoader />}>
        <StyledContainer {...constrainWidthProps} component="div">
          {children}
        </StyledContainer>
      </Suspense>
      <RouteBoundary id={rightRouteBoundaryID} showBoundary={shouldShowBoundaries} />
    </Stack>
  );
}

export default Route;
