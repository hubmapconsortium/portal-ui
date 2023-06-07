import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';

function AddToListItem({ isSelected, addToSelectedLists, removeFromSelectedLists, title, listUUID }) {
  const labelId = `checkbox-list-${title}`;

  const handleClick = isSelected ? removeFromSelectedLists : addToSelectedLists;

  return (
    <ListItem onClick={() => handleClick(listUUID)}>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={isSelected}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <ListItemText id={labelId} primary={title} />
    </ListItem>
  );
}

export default AddToListItem;
