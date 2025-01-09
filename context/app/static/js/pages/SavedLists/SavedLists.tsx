import React from 'react';
import { useAppContext } from 'js/components/Contexts';
import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import { useRemoteSavedEntities } from 'js/components/savedLists/api';
import { SavedListsContent } from 'js/components/savedLists/SavedListsContent';

const usedSavedEntitiesSelector = (state: SavedEntitiesStore) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  deleteQueuedLists: state.deleteQueuedLists,
  deleteEntities: state.deleteEntities,
});

function SavedLists() {
  const { groupsToken } = useAppContext();
  const unauthenticatedListsData = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const authenticatedListsData = useRemoteSavedEntities();

  const listsData = groupsToken === '' ? unauthenticatedListsData : authenticatedListsData;

  return <SavedListsContent {...listsData} />;
}

export default SavedLists;
