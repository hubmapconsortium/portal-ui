import React from 'react';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import { StyledSaveEntityButton, StyledEditSavedStatusButton } from './style';

const useSavedEntitiesSelector = (state) => state.savedEntities;

function SaveEditEntityButton({ uuid, entity_type, group_name, display_doi }) {
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  return uuid in savedEntities ? (
    <StyledEditSavedStatusButton uuid={uuid} entity_type={entity_type} />
  ) : (
    <StyledSaveEntityButton uuid={uuid} entity_type={entity_type} group_name={group_name} display_doi={display_doi} />
  );
}

export default SaveEditEntityButton;
