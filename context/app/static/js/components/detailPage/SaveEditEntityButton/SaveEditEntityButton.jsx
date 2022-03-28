import React from 'react';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import SaveEntityButton from 'js/components/savedLists/SaveEntityButton';
import EditSavedStatusButton from 'js/components/savedLists/EditSavedStatusButton';

const useSavedEntitiesSelector = (state) => state.savedEntities;

function SaveEditEntityButton({ uuid, entity_type }) {
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  return uuid in savedEntities ? (
    <EditSavedStatusButton uuid={uuid} entity_type={entity_type} />
  ) : (
    <SaveEntityButton uuid={uuid} />
  );
}

export default SaveEditEntityButton;
