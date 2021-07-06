import React from 'react';
import Button from '@material-ui/core/Button';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';

const useSavedEntitiesStoreSelector = (state) => state.saveEntity;
const entityStoreSelector = (state) => state.setShouldDisplaySavedOrEditedAlert;

function SaveEntityButton({ uuid, entity_type, group_name, hubmap_id, ...rest }) {
  const saveEntity = useSavedEntitiesStore(useSavedEntitiesStoreSelector);
  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        saveEntity(uuid, entity_type, group_name, hubmap_id);
        setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
      }}
      {...rest}
    >
      Save
    </Button>
  );
}

export default SaveEntityButton;
