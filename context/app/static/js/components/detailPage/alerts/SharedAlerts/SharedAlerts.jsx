import React from 'react';

import useEntityStore, { savedAlertStatus, editedAlertStatus } from 'js/stores/useEntityStore';
import { Alert } from 'js/shared-styles/alerts';

const entityStoreSelector = (state) => ({
  shouldDisplaySavedOrEditedAlert: state.shouldDisplaySavedOrEditedAlert,
  setShouldDisplaySavedOrEditedAlert: state.setShouldDisplaySavedOrEditedAlert,
});

function SharedAlerts({ additionalAlerts }) {
  const { shouldDisplaySavedOrEditedAlert, setShouldDisplaySavedOrEditedAlert } = useEntityStore(entityStoreSelector);

  return (
    <>
      {shouldDisplaySavedOrEditedAlert === savedAlertStatus && (
        <Alert severity="success" onClose={() => setShouldDisplaySavedOrEditedAlert(false)} $marginBottom="16">
          Successfully added to My Saves List. All lists are currently stored on local storage and are not transferable
          between devices.
        </Alert>
      )}
      {shouldDisplaySavedOrEditedAlert === editedAlertStatus && (
        <Alert severity="success" onClose={() => setShouldDisplaySavedOrEditedAlert(false)} $marginBottom="16">
          Successfully updated save status. All lists are currently stored on local storage and are not transferable
          between devices.
        </Alert>
      )}
      {additionalAlerts}
    </>
  );
}

export default SharedAlerts;
