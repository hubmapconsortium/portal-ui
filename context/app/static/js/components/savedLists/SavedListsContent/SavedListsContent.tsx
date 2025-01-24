import React from 'react';

import {
  SavedListsSuccessAlert,
  SavedListsTransferAlert,
} from 'js/components/savedLists/SavedListsAlerts/SavedListsAlerts';
import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { StyledHeader, SpacingDiv, PageSpacing } from './style';

function SavedListsContent() {
  const { savedEntities, savedLists, deleteEntities } = useSavedLists();

  return (
    <PageSpacing>
      <SavedListsTransferAlert />
      <SavedListsSuccessAlert fromSavedLists />
      <SpacingDiv>
        <StyledHeader variant="h3">My Saved Items</StyledHeader>
        <SavedEntitiesTable savedEntities={savedEntities} deleteCallback={deleteEntities} />
      </SpacingDiv>
      <SavedListScrollbox savedLists={savedLists} />
    </PageSpacing>
  );
}

export default SavedListsContent;
