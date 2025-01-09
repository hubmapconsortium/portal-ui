import React from 'react';

import AddToListItem from 'js/components/savedLists/AddToListItem';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { MaxHeightList } from './style';

interface AddToListProps {
  selectedLists: Set<string>;
  addToSelectedLists: (listUUID: string) => void;
  removeFromSelectedLists: (listUUID: string) => void;
}

function AddToList({ selectedLists, addToSelectedLists, removeFromSelectedLists }: AddToListProps) {
  const { savedLists } = useSavedLists();

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
