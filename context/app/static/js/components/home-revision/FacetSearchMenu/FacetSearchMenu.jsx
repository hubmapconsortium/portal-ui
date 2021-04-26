import React from 'react';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

function FacetSearchMenu({ anchorRef, matches }) {
  return (
    <div>
      <Popper id="simple-menu" anchorEl={anchorRef.current} open={matches.length} placement="bottom-start">
        <Paper>
          <MenuList>
            {matches.map((match) => (
              <MenuItem key={match}>{match}</MenuItem>
            ))}
          </MenuList>
        </Paper>
      </Popper>
    </div>
  );
}

export default FacetSearchMenu;
