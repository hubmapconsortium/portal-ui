import React from 'react';

import EntityMenuList from 'js/components/home-revision/EntityMenuList';
import { StyledPaper, StyledPopper } from './style';

function FacetSearchMenu({ anchorRef, matches, labels, searchInputWidth }) {
  return matches.length === 3 ? (
    <StyledPopper
      id="simple-menu"
      anchorEl={anchorRef.current}
      open
      placement="bottom-start"
      $searchInputWidth={searchInputWidth}
    >
      <StyledPaper>
        <EntityMenuList entityType="Donor" matches={matches[0]} labels={labels} />
        <EntityMenuList entityType="Sample" matches={matches[1]} labels={labels} />
        <EntityMenuList entityType="Dataset" matches={matches[2]} labels={labels} />
      </StyledPaper>
    </StyledPopper>
  ) : null;
}

export default FacetSearchMenu;
