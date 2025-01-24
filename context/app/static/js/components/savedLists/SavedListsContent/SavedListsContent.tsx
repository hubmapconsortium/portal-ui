import React, { useState, useEffect } from 'react';

import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { useSavedListsAlertsStore } from 'js/stores/useSavedListsAlertsStore';
import { StyledAlert, StyledHeader, SpacingDiv, PageSpacing } from './style';

function SavedListsContent() {
  const { savedEntities, savedLists, listsToBeDeleted, deleteEntities, deleteQueuedLists } = useSavedLists();
  const { transferredToProfile, setTransferredToProfile } = useSavedListsAlertsStore();
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
      {transferredToProfile && (
        <StyledAlert severity="info" onClose={() => setTransferredToProfile(false)}>
          Your local lists have been transferred to your profile. Future lists saved while logged out will remain local
          and non-transferable, while logged-in lists will sync to your profile.
        </StyledAlert>
      )}
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

export default SavedListsContent;
