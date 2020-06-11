import React from 'react';
import MaterialMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function Menu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" aria-haspopup="true" onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <MaterialMenu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {['Donor', 'Sample', 'Dataset'].map((type) => (
          <MenuItem key={type}>
            <a href={`/search?entity_type[0]=${type}`}>{`${type}s`}</a>
          </MenuItem>
        ))}
      </MaterialMenu>
    </>
  );
}

export default Menu;
