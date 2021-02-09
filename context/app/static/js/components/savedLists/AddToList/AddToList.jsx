import React from 'react';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import AddToListItem from 'js/components/savedLists/AddToListItem';
import { MaxHeightList } from './style';

const usedSavedEntitiesStoreSelector = (state) => ({
  savedLists: state.savedLists,
});

function AddToList({ selectedLists, addToSelectedLists, removeFromSelectedLists }) {
  const { savedLists } = useSavedEntitiesStore(usedSavedEntitiesStoreSelector);

  return (
    <MaxHeightList>
      {Object.keys(savedLists).map((listName) => (
        <AddToListItem
          key={listName}
          title={listName}
          isSelected={selectedLists.has(listName)}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      ))}
    </MaxHeightList>
  );
}

export default AddToList;
