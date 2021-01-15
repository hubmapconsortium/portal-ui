import React from 'react';
import Button from '@material-ui/core/Button';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const useSavedEntitiesStoreSelector = (state) => ({ savedEntities: state.savedEntities, saveEntity: state.saveEntity });

function SaveButton({ uuid }) {
  const { savedEntities, saveEntity } = useSavedEntitiesStore(useSavedEntitiesStoreSelector);
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => saveEntity(uuid)}
      disabled={savedEntities.includes(uuid)}
    >
      Save
    </Button>
  );
}

export default SaveButton;
