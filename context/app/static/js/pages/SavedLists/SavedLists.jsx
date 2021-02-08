import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';

import SavedEntitiesTable from 'js/components/savedLists/SavedEntitiesTable';
import { LightBlueLink } from 'js/shared-styles/Links';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import LocalStorageDescription from 'js/components/savedLists/LocalStorageDescription';
import Description from 'js/shared-styles/sections/Description';
import SavedListScrollbox from 'js/components/savedLists/SavedListScrollbox';
import { StyledAlert } from './style';

const usedSavedEntitiesSelector = (state) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  deleteQueuedLists: state.deleteQueuedLists,
  deleteEntities: state.deleteEntities,
});

function SavedLists() {
  const { savedLists, savedEntities, listsToBeDeleted, deleteQueuedLists, deleteEntities } = useSavedEntitiesStore(
    usedSavedEntitiesSelector,
  );
  const [shouldDisplayDeleteAlert, setShouldDisplayDeleteAlert] = useState(false);

  useEffect(() => {
    if (listsToBeDeleted.length > 0) {
      deleteQueuedLists();
      setShouldDisplayDeleteAlert(true);
    }
  }, [listsToBeDeleted, deleteQueuedLists]);

  return (
    <>
      {shouldDisplayDeleteAlert && (
        <StyledAlert severity="success" onClose={() => setShouldDisplayDeleteAlert(false)}>
          List successfully deleted.
        </StyledAlert>
      )}
      <Typography variant="h2" component="h1">
        My Lists
      </Typography>
      <LocalStorageDescription />
      <Typography variant="h3" component="h2">
        My Saved Items
      </Typography>
      {Object.keys(savedEntities).length === 0 ? (
        <Description padding="20px 20px">
          No items saved. Navigate to <LightBlueLink href="/search?entity_type[0]=Donor">donors</LightBlueLink>,{' '}
          <LightBlueLink href="/search?entity_type[0]=Sample">samples</LightBlueLink> or{' '}
          <LightBlueLink href="/search?entity_type[0]=Dataset">datasets</LightBlueLink> search pages to explore data to
          save.
        </Description>
      ) : (
        <SavedEntitiesTable savedEntities={savedEntities} deleteCallback={deleteEntities} />
      )}
      <SavedListScrollbox savedLists={savedLists} />
    </>
  );
}

export default SavedLists;
