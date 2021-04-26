import React from 'react';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

import EntityMenuList from 'js/components/home-revision/EntityMenuList';

function FacetSearchMenu({ anchorRef, matches }) {
  return matches.length === 3 ? (
    <Popper id="simple-menu" anchorEl={anchorRef.current} open placement="bottom-start">
      <Paper>
        <EntityMenuList entityType="Donor" matches={matches[0]} />
        <EntityMenuList entityType="Sample" matches={matches[1]} />
        <EntityMenuList entityType="Dataset" matches={matches[2]} />
      </Paper>
    </Popper>
  ) : null;
}

export default FacetSearchMenu;
