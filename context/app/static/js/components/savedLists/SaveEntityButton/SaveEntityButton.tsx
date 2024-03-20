import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';

interface SaveEntityButtonProps extends ButtonProps {
  uuid: string;
}

function SaveEntityButton({ uuid, ...rest }: SaveEntityButtonProps) {
  const saveEntity = useSavedEntitiesStore((state) => state.saveEntity);
  const setShouldDisplaySavedOrEditedAlert = useEntityStore((state) => state.setShouldDisplaySavedOrEditedAlert);

  const trackSave = useTrackEntityPageEvent();

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        saveEntity(uuid);
        trackSave({ action: 'Save To List', label: uuid });
        setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
      }}
      {...rest}
    >
      Save
    </Button>
  );
}

export default SaveEntityButton;
