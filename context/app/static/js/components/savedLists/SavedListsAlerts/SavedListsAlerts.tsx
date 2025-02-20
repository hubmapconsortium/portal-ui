import React from 'react';
import Button from '@mui/material/Button';

import {
  SavedListsAlertsState,
  useSavedListsAlertsStore,
  SavedListsSuccessAlertType,
} from 'js/stores/useSavedListsAlertsStore';
import InternalLink from 'js/shared-styles/Links/InternalLink';
import { StyledAlert } from '../style';

const savedListsStoreSelector = (state: SavedListsAlertsState) => ({
  successAlert: state.successAlert,
  setSuccessAlert: state.setSuccessAlert,
  transferredToProfileAlert: state.transferredToProfileAlert,
  setTransferredToProfileAlert: state.setTransferredToProfileAlert,
});

function SavedListsSuccessAlert({ fromSavedLists }: { fromSavedLists?: boolean }) {
  const { successAlert, setSuccessAlert } = useSavedListsAlertsStore(savedListsStoreSelector);

  if (!successAlert) return null;

  const messages = {
    [SavedListsSuccessAlertType.SavedEntity]: (
      <>
        saved to <InternalLink href="/my-lists">My Saved Items</InternalLink>
      </>
    ),
    [SavedListsSuccessAlertType.DeletedEntity]: 'deleted from your saved items',
    [SavedListsSuccessAlertType.UpdatedLists]: 'updated lists',
    [SavedListsSuccessAlertType.DeletedList]: 'deleted list',
  };

  return (
    <StyledAlert
      severity="success"
      onClose={() => setSuccessAlert(undefined)}
      action={!fromSavedLists && <Button href="/my-lists">My Lists</Button>}
    >
      Successfully {messages[successAlert]}.{' '}
      {!fromSavedLists && (
        <>
          Visit your <InternalLink href="/my-lists">lists</InternalLink> to view your saved items.
        </>
      )}
    </StyledAlert>
  );
}

function SavedListsTransferAlert() {
  const { transferredToProfileAlert, setTransferredToProfileAlert } = useSavedListsAlertsStore(savedListsStoreSelector);

  if (!transferredToProfileAlert) return null;

  return (
    <StyledAlert severity="info" onClose={() => setTransferredToProfileAlert(false)}>
      Your local lists have been transferred to your profile.
    </StyledAlert>
  );
}

export { SavedListsSuccessAlert, SavedListsTransferAlert };
