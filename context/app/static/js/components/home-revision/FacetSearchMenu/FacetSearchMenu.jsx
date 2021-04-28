import React from 'react';

import EntityMenuList from 'js/components/home-revision/EntityMenuList';
import { StyledPaper, StyledPopper, StyledAlert } from './style';

function FacetSearchMenu({ anchorRef, matches, labels, searchInputWidth }) {
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
        {matchesExist &&
          Object.entries(matches).map(([k, v]) => <EntityMenuList entityType={k} matches={v} labels={labels} />)}
        {!matchesExist && (
          <StyledAlert severity="warning">No results found. Check your spelling or try a different term.</StyledAlert>
        )}
      </StyledPaper>
    </StyledPopper>
  );
}

export default FacetSearchMenu;
