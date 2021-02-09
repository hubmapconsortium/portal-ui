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
      {Object.values(savedLists).map(([listUuid, value]) => (
        <AddToListItem
          key={listUuid}
          title={value.title}
          listUuid={listUuid}
          isSelected={selectedLists.has(listUuid)}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      ))}
    </MaxHeightList>
  );
}

export default AddToList;
