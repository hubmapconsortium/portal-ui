import React, { useState, useEffect } from 'react';

import Skeleton from '@mui/material/Skeleton';
import { SavedEntitiesStore } from 'js/components/savedLists/types';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { StyledAlert, StyledHeader, SpacingDiv, PageSpacing } from './style';

function SavedListsContent({
  savedLists,
  savedEntities,
  listsToBeDeleted,
  deleteQueuedLists,
  deleteEntities,
  isLoading,
}: Pick<
  SavedEntitiesStore,
  'savedLists' | 'savedEntities' | 'listsToBeDeleted' | 'deleteQueuedLists' | 'deleteEntities'
> & { isLoading?: boolean }) {
  const [shouldDisplayDeleteAlert, setShouldDisplayDeleteAlert] = useState(false);
  const [shouldDisplaySaveAlert, setShouldDisplaySaveAlert] = useState(false);

  useEffect(() => {
    if (listsToBeDeleted.length > 0) {
      deleteQueuedLists();
      setShouldDisplayDeleteAlert(true);
    }
  }, [listsToBeDeleted, deleteQueuedLists]);

  if (isLoading) {
    return <Skeleton variant="rectangular" height={400} />;
  }

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

export { SavedListsContent };
