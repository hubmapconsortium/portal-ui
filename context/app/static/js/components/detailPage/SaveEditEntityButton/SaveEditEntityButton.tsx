import React from 'react';

import { useSavedLists } from 'js/components/savedLists/hooks';
import { ESEntityType } from 'js/components/types';
import { StyledSaveEntityButton, StyledEditSavedStatusButton } from './style';

interface SaveEditEntityButtonProps {
  uuid: string;
  entity_type: ESEntityType;
}

function SaveEditEntityButton({ uuid, entity_type }: SaveEditEntityButtonProps) {
  const { savedEntities } = useSavedLists();

  return uuid in savedEntities ? (
    <StyledEditSavedStatusButton uuid={uuid} entity_type={entity_type} />
  ) : (
    <StyledSaveEntityButton uuid={uuid} />
  );
}

export default SaveEditEntityButton;
