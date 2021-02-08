import React from 'react';
import Button from '@material-ui/core/Button';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';

const useSavedEntitiesStoreSelector = (state) => state.saveEntity;
const entityStoreSelector = (state) => state.setShouldDisplaySavedOrEditedAlert;

function SaveEntityButton({ uuid, entity_type, group_name, display_doi, ...rest }) {
  const saveEntity = useSavedEntitiesStore(useSavedEntitiesStoreSelector);
  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        saveEntity(uuid, entity_type, group_name, display_doi);
        setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
      }}
      {...rest}
    >
      Save
    </Button>
  );
}

export default SaveEntityButton;
