import React from 'react';
import List from '@material-ui/core/List';

import useSavedListsStore from 'js/stores/useSavedListsStore';
import AddToListItem from 'js/components/savedLists/AddToListItem';

const useSavedListsSelector = (state) => ({
  savedLists: state.savedLists,
});

function AddToList({ selectedLists, addToSelectedLists }) {
  const { savedLists } = useSavedListsStore(useSavedListsSelector);

  return (
    <List>
      {Object.keys(savedLists).map((listName) => (
        <AddToListItem
          title={listName}
          isSelected={selectedLists.has(listName)}
          addToSelectedLists={addToSelectedLists}
        />
      ))}
    </List>
  );
}

export default AddToList;
