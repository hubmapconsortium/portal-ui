import React from 'react';

import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import AddToListItem from 'js/components/savedLists/AddToListItem';
import { MaxHeightList } from './style';

const usedSavedEntitiesStoreSelector = (state: SavedEntitiesStore) => state.savedLists;

interface AddToListProps {
  selectedLists: Set<string>;
  addToSelectedLists: (listUUID: string) => void;
  removeFromSelectedLists: (listUUID: string) => void;
}

function AddToList({ selectedLists, addToSelectedLists, removeFromSelectedLists }: AddToListProps) {
  const savedLists = useSavedEntitiesStore(usedSavedEntitiesStoreSelector);

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
