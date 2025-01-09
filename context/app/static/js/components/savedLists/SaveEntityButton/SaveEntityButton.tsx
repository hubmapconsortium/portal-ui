import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSavedLists } from 'js/components/savedLists/hooks';

interface SaveEntityButtonProps extends ButtonProps {
  uuid: string;
}

function SaveEntityButton({ uuid, ...rest }: SaveEntityButtonProps) {
  const { saveEntity } = useSavedLists();
  const setShouldDisplaySavedOrEditedAlert = useEntityStore((state) => state.setShouldDisplaySavedOrEditedAlert);
  const trackSave = useTrackEntityPageEvent();

  async function handleSaveEntity(entityUUID: string) {
    await saveEntity(entityUUID);
  }

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        handleSaveEntity(uuid).catch((err) => {
          console.error(err);
        });
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
