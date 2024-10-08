import React from 'react';

import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import { ESEntityType } from 'js/components/types';
import { StyledSaveEntityButton, StyledEditSavedStatusButton } from './style';

const useSavedEntitiesSelector = (state: SavedEntitiesStore) => state.savedEntities;

interface SaveEditEntityButtonProps {
  uuid: string;
  entity_type: ESEntityType;
}

function SaveEditEntityButton({ uuid, entity_type }: SaveEditEntityButtonProps) {
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  return uuid in savedEntities ? (
    <StyledEditSavedStatusButton uuid={uuid} entity_type={entity_type} />
  ) : (
    <StyledSaveEntityButton uuid={uuid} />
  );
}

export default SaveEditEntityButton;
