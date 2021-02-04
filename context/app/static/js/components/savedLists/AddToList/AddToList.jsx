import React from 'react';
import List from '@material-ui/core/List';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import AddToListItem from 'js/components/savedLists/AddToListItem';

const usedSavedEntitiesStoreSelector = (state) => ({
  savedLists: state.savedLists,
});

function AddToList({ selectedLists, addToSelectedLists, removeFromSelectedLists }) {
  const { savedLists } = useSavedEntitiesStore(usedSavedEntitiesStoreSelector);

  return (
    <List>
      {Object.keys(savedLists).map((listName) => (
        <AddToListItem
          key={listName}
          title={listName}
          isSelected={selectedLists.has(listName)}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      ))}
    </List>
  );
}

export default AddToList;
