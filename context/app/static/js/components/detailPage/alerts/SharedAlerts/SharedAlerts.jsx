import React from 'react';

import useEntityStore, { savedAlertStatus, editedAlertStatus } from 'js/stores/useEntityStore';
import { DetailPageAlert } from '../style';

const entityStoreSelector = (state) => ({
  shouldDisplaySavedOrEditedAlert: state.shouldDisplaySavedOrEditedAlert,
  setShouldDisplaySavedOrEditedAlert: state.setShouldDisplaySavedOrEditedAlert,
});

function SharedAlerts({ additionalAlerts }) {
  const { shouldDisplaySavedOrEditedAlert, setShouldDisplaySavedOrEditedAlert } = useEntityStore(entityStoreSelector);

  return (
    <>
      {shouldDisplaySavedOrEditedAlert === savedAlertStatus && (
        <DetailPageAlert
          severity="success"
          onClose={() => setShouldDisplaySavedOrEditedAlert(false)}
          $marginBottom="16"
        >
          Successfully added to My Saves List. All lists are currently stored on local storage and are not transferable
          between devices.
        </DetailPageAlert>
      )}
      {shouldDisplaySavedOrEditedAlert === editedAlertStatus && (
        <DetailPageAlert
          severity="success"
          onClose={() => setShouldDisplaySavedOrEditedAlert(false)}
          $marginBottom="16"
        >
          Successfully updated save status. All lists are currently stored on local storage and are not transferable
          between devices.
        </DetailPageAlert>
      )}
      {additionalAlerts}
    </>
  );
}

export default SharedAlerts;
