import React from 'react';
import Button from '@mui/material/Button';

import { SavedListsAlertsState, useSavedListsAlertsStore, savedAlertStatus } from 'js/stores/useSavedListsAlertsStore';
import { useAppContext } from 'js/components/Contexts';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import { StyledAlert } from '../style';

const savedListsStoreSelector = (state: SavedListsAlertsState) => ({
  savedOrEditedList: state.savedOrEditedList,
  setSavedOrEditedList: state.setSavedOrEditedList,
});

export default function SavedListsSuccessAlert() {
  const { savedOrEditedList, setSavedOrEditedList } = useSavedListsAlertsStore(savedListsStoreSelector);
  const { isAuthenticated } = useAppContext();

  if (!savedOrEditedList) return null;

  const isSaved = savedOrEditedList === savedAlertStatus;
  const alertMessage = isSaved ? (
    <>
      saved to <InternalLink href="/my-lists">My Saved Items</InternalLink>
    </>
  ) : (
    'updated lists'
  );

  const actionButton = isAuthenticated ? (
    <Button href="/my-lists">My Lists</Button>
  ) : (
    <Button href="/login">Log in</Button>
  );

  const additionalMessage = isAuthenticated ? (
    <>
      . Visit your <InternalLink href="/my-lists">lists</InternalLink> to view your saved items.
    </>
  ) : (
    <>
      {' '}
      locally. <InternalLink href="/login">Log in</InternalLink> to save lists to your profile for easy access across
      devices.
    </>
  );

  return (
    <StyledAlert severity="success" onClose={() => setSavedOrEditedList(false)} action={actionButton}>
      Successfully {alertMessage}
      {additionalMessage}
    </StyledAlert>
  );
}
