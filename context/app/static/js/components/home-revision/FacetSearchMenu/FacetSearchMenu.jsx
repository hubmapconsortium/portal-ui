import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';

import FacetSearchEntityListItems from 'js/components/home-revision/FacetSearchEntityListItems';
import { StyledPaper, StyledPopper, StyledAlert, StyledTypography, HeaderSkeleton } from './style';

function FacetSearchMenu({ anchorRef, matches, labels, searchInputWidth, isLoading }) {
  const matchesExist = Object.keys(matches).length > 0;
  return (
    <StyledPopper
      id="simple-menu"
      anchorEl={anchorRef.current}
      open
      placement="bottom-start"
      $searchInputWidth={searchInputWidth}
    >
      <StyledPaper>
        {isLoading && (
          <>
            <StyledTypography variant="subtitle2">
              <HeaderSkeleton />
            </StyledTypography>
            <StyledTypography variant="body2">
              <Skeleton />
            </StyledTypography>
          </>
        )}
        {!isLoading && matchesExist && (
          <List>
            {Object.entries(matches).map(([k, v]) => (
              <FacetSearchEntityListItems entityType={k} matches={v} labels={labels} />
            ))}
          </List>
        )}
        {!isLoading && !matchesExist && (
          <StyledAlert severity="warning">No results found. Check your spelling or try a different term.</StyledAlert>
        )}
      </StyledPaper>
    </StyledPopper>
  );
}

export default FacetSearchMenu;
