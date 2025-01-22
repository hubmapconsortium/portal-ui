import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import { useSavedListsAlertsStore, savedAlertStatus } from 'js/stores/useSavedListsAlertsStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSavedLists } from 'js/components/savedLists/hooks';

interface SaveEntityButtonProps extends ButtonProps {
  uuid: string;
}

function SaveEntityButton({ uuid, ...rest }: SaveEntityButtonProps) {
  const { saveEntity } = useSavedLists();
  const setSavedOrEditedList = useSavedListsAlertsStore((state) => state.setSavedOrEditedList);
  const trackSave = useTrackEntityPageEvent();

  return (
    <Button
      color="primary"
      variant="contained"
      onClick={() => {
        saveEntity(uuid);
        trackSave({ action: 'Save To List', label: uuid });
        setSavedOrEditedList(savedAlertStatus);
      }}
      {...rest}
    >
      Save
    </Button>
  );
}

export default SaveEntityButton;
