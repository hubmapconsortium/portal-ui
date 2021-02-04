import React from 'react';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import { StyledSaveEntityButton, StyedEditSavedStatusButton } from './style';

const useSavedEntitiesSelector = (state) => state.savedEntities;

function SaveEditEntityButton({ uuid, entity_type }) {
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  return uuid in savedEntities ? (
    <StyedEditSavedStatusButton uuid={uuid} entity_type={entity_type} />
  ) : (
    <StyledSaveEntityButton uuid={uuid} entity_type={entity_type} />
  );
}

export default SaveEditEntityButton;
