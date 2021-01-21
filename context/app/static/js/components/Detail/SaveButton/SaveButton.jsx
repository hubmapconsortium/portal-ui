import React from 'react';
import Button from '@material-ui/core/Button';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore from 'js/stores/useEntityStore';

const useSavedEntitiesStoreSelector = (state) => ({ savedEntities: state.savedEntities, saveEntity: state.saveEntity });
const entityStoreSelector = (state) => state.toggleShouldDisplaySavedListsAlert;

function SaveButton({ uuid }) {
  const { savedEntities, saveEntity } = useSavedEntitiesStore(useSavedEntitiesStoreSelector);
  const toggleShouldDisplaySavedListsAlert = useEntityStore(entityStoreSelector);

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        saveEntity(uuid);
        toggleShouldDisplaySavedListsAlert();
      }}
      disabled={uuid in savedEntities}
    >
      Save
    </Button>
  );
}

export default SaveButton;
