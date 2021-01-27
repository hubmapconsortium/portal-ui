import React from 'react';

import SaveEntityButton from 'js/components/savedLists/SaveEntityButton';
import EditSavedStatusButton from 'js/components/savedLists/EditSavedStatusButton';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const useSavedEntitiesSelector = (state) => state.savedEntities;

function SaveEditEntityButton({ uuid, entity_type }) {
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  return uuid in savedEntities ? (
    <EditSavedStatusButton uuid={uuid} />
  ) : (
    <SaveEntityButton uuid={uuid} entity_type={entity_type} />
  );
}

export default SaveEditEntityButton;
