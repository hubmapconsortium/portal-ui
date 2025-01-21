import React from 'react';
import useEntityStore, { EntityStore, savedAlertStatus } from 'js/stores/useEntityStore';
import { useAppContext } from 'js/components/Contexts';
import Button from '@mui/material/Button';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import { StyledAlert } from './style';

const entityStoreSelector = (state: EntityStore) => ({
  shouldDisplaySavedOrEditedAlert: state.shouldDisplaySavedOrEditedAlert,
  setShouldDisplaySavedOrEditedAlert: state.setShouldDisplaySavedOrEditedAlert,
});

function SavedListsSuccessAlert() {
  const { shouldDisplaySavedOrEditedAlert, setShouldDisplaySavedOrEditedAlert } = useEntityStore(entityStoreSelector);
  const { isAuthenticated } = useAppContext();

  const showSavedAlert = shouldDisplaySavedOrEditedAlert === savedAlertStatus;

  if (!shouldDisplaySavedOrEditedAlert) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <StyledAlert
        severity="success"
        onClose={() => setShouldDisplaySavedOrEditedAlert(false)}
        action={<Button href="/my-lists">My Lists</Button>}
      >
        Successfully{' '}
        {showSavedAlert ? (
          <>
            added to <InternalLink href="/my-lists">My Saved Items</InternalLink>
          </>
        ) : (
          'updated lists'
        )}
        . Visit your <InternalLink href="/my-lists">lists</InternalLink> to view your saved items.
      </StyledAlert>
    );
  }

  return (
    <StyledAlert
      severity="success"
      onClose={() => setShouldDisplaySavedOrEditedAlert(false)}
      action={<Button href="/login">Log in</Button>}
    >
      Successfully{' '}
      {showSavedAlert ? (
        <>
          saved to <InternalLink href="/my-lists">My Saved Items</InternalLink>
        </>
      ) : (
        'updated lists'
      )}{' '}
      locally. <InternalLink href="/login">Log in</InternalLink> to save lists to your profile for easy access across
      devices.
    </StyledAlert>
  );
}

export { SavedListsSuccessAlert };
