import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import { useAppContext } from 'js/components/Contexts';
import { useRemoteSavedEntities } from 'js/components/savedLists/api';
import { SavedEntitiesStore } from 'js/components/savedLists/types';

const usedSavedEntitiesSelector = (state: SavedEntitiesStore) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  deleteQueuedLists: state.deleteQueuedLists,
  deleteEntities: state.deleteEntities,
  saveEntity: state.saveEntity,
  createList: state.createList,
  editList: state.editList,
});

function useSavedLists() {
  const { groupsToken } = useAppContext();
  const unauthenticatedListsData = useSavedEntitiesStore(usedSavedEntitiesSelector);
  const authenticatedListsData = useRemoteSavedEntities();

  const isAuthenticated = groupsToken !== '';
  return isAuthenticated ? authenticatedListsData : unauthenticatedListsData;
}

export { useSavedLists };
