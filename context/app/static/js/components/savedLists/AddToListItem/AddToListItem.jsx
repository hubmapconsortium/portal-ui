import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

function AddToListItem({ isSelected, addToSelectedLists, removeFromSelectedLists, title }) {
  const labelId = `checkbox-list-${title}`;

  const handleClick = isSelected ? removeFromSelectedLists : addToSelectedLists;

  return (
    <ListItem onClick={() => handleClick(title)}>
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
