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
      {Object.entries(savedLists).map(([listUUID, value]) => (
        <AddToListItem
          key={listUUID}
          title={value.title}
          listUUID={listUUID}
          isSelected={selectedLists.has(listUUID)}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      ))}
    </MaxHeightList>
  );
}

export default AddToList;
