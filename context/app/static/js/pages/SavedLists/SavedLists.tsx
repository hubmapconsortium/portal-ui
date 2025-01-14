import React, { useState, useEffect } from 'react';

import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { StyledAlert, StyledHeader, SpacingDiv, PageSpacing } from './style';

function SavedLists() {
  const { savedEntities, savedLists, listsToBeDeleted, deleteEntities, deleteQueuedLists } = useSavedLists();
  const [shouldDisplayDeleteAlert, setShouldDisplayDeleteAlert] = useState(false);
  const [shouldDisplaySaveAlert, setShouldDisplaySaveAlert] = useState(false);

  useEffect(() => {
    if (listsToBeDeleted.length > 0) {
      deleteQueuedLists();
      setShouldDisplayDeleteAlert(true);
    }
  }, [listsToBeDeleted, deleteQueuedLists]);

  return (
    <PageSpacing>
      {shouldDisplayDeleteAlert && (
        <StyledAlert severity="success" onClose={() => setShouldDisplayDeleteAlert(false)}>
          List successfully deleted.
        </StyledAlert>
      )}
      {shouldDisplaySaveAlert && (
        <StyledAlert severity="success" onClose={() => setShouldDisplaySaveAlert(false)}>
          Items successfully added to list.
        </StyledAlert>
      )}
      <StyledHeader variant="h2" data-testid="my-lists-title">
        My Lists
      </StyledHeader>
      <SpacingDiv>
        <LocalStorageDescription />
      </SpacingDiv>
      <SpacingDiv>
        <StyledHeader variant="h3">My Saved Items</StyledHeader>
        <SavedEntitiesTable
          savedEntities={savedEntities}
          deleteCallback={deleteEntities}
          setShouldDisplaySaveAlert={setShouldDisplaySaveAlert}
        />
      </SpacingDiv>
      <SavedListScrollbox savedLists={savedLists} />
    </PageSpacing>
  );
}

export default SavedLists;
