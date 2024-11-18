import React, { useState, useEffect } from 'react';

import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { StyledAlert, StyledHeader, SpacingDiv, PageSpacing } from './style';

const usedSavedEntitiesSelector = (state) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  deleteQueuedLists: state.deleteQueuedLists,
  deleteEntities: state.deleteEntities,
});

function SavedLists() {
  const { savedLists, savedEntities, listsToBeDeleted, deleteQueuedLists, deleteEntities } =
    useSavedEntitiesStore(usedSavedEntitiesSelector);
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
      <StyledHeader variant="h2" component="h1" data-testid="my-lists-title">
        My Lists
      </StyledHeader>
      <SpacingDiv>
        <LocalStorageDescription />
      </SpacingDiv>
      <SpacingDiv>
        <StyledHeader variant="h3" component="h2">
          My Saved Items
        </StyledHeader>
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
