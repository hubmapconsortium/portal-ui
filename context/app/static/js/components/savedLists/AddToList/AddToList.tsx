import React from 'react';

import AddToListItem from 'js/components/savedLists/AddToListItem';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { MaxHeightList } from './style';

interface AddToListProps {
  selectedLists: Set<string>;
  allLists: Record<string, SavedEntitiesList>;
  addToSelectedLists: (listUUID: string) => void;
  removeFromSelectedLists: (listUUID: string) => void;
}

function AddToList({ selectedLists, allLists, addToSelectedLists, removeFromSelectedLists }: AddToListProps) {
  return (
    <MaxHeightList>
      {Object.entries(allLists).map(([listUUID, value]) => (
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
