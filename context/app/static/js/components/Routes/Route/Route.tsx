import React, { PropsWithChildren, Suspense } from 'react';
import Box from '@mui/material/Box';
import { ContainerProps } from '@mui/material/Container';

import { useIsLargeDesktop } from 'js/hooks/media-queries';
import RouteLoader from '../RouteLoader';
import { StyledContainer, GridWrapper } from './style';

export const leftRouteBoundaryID = 'left-route-boundary';
export const rightRouteBoundaryID = 'right-route-boundary';

function RouteBoundary({
  id,
  showBoundary,
}: {
  id: typeof leftRouteBoundaryID | typeof rightRouteBoundaryID;
  showBoundary: boolean;
}) {
  return (
    <Box
      id={id}
      sx={{
        padding: 2,
        display: !showBoundary ? 'none' : 'block',
      }}
    />
  );
}

interface RouteProps {
  disableWidthConstraint?: boolean;
  /** Drops the 8px gap below the header, for pages whose content is meant to sit flush against it. */
  disableTopMargin?: boolean;
}

function Route({ children, disableWidthConstraint = false, disableTopMargin = false }: PropsWithChildren<RouteProps>) {
  const constrainWidthProps: Partial<ContainerProps> = disableWidthConstraint
    ? { maxWidth: false, disableGutters: true }
    : { maxWidth: 'lg' };

  const isDesktop = useIsLargeDesktop();
  const shouldShowBoundaries = !disableWidthConstraint && isDesktop;

  return (
    <GridWrapper $shouldShowBoundaries={shouldShowBoundaries} $disableTopMargin={disableTopMargin}>
      <RouteBoundary id={leftRouteBoundaryID} showBoundary={shouldShowBoundaries} />
      <Suspense fallback={<RouteLoader />}>
        <StyledContainer {...constrainWidthProps} component="div">
          {children}
        </StyledContainer>
      </Suspense>
      <RouteBoundary id={rightRouteBoundaryID} showBoundary={shouldShowBoundaries} />
    </GridWrapper>
  );
}

export default Route;
