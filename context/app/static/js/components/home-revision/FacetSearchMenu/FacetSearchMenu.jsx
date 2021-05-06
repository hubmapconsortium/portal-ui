import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import FacetSearchEntityListItems from 'js/components/home-revision/FacetSearchEntityListItems';
import { StyledPaper, StyledPopper, StyledAlert, StyledTypography, HeaderSkeleton } from './style';

function FacetSearchMenu({ anchorRef, matches, labels, searchInputWidth, isLoading, menuIsOpen, setMenuIsOpen }) {
  const matchesExist = Object.keys(matches).length > 0;

  return (
    <ClickAwayListener onClickAway={() => setMenuIsOpen(false)}>
      <StyledPopper
        id="facet-search-menu"
        anchorEl={anchorRef.current}
        open={menuIsOpen}
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
          {!isLoading &&
            (matchesExist ? (
              <List>
                {Object.entries(matches).map(([k, v]) => (
                  <FacetSearchEntityListItems key={k} entityType={k} matches={v} labels={labels} />
                ))}
              </List>
            ) : (
              <StyledAlert severity="warning">
                No results found. Check your spelling or try a different term.
              </StyledAlert>
            ))}
        </StyledPaper>
      </StyledPopper>
    </ClickAwayListener>
  );
}

export default FacetSearchMenu;
