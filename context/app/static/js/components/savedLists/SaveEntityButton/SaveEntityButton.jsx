import React from 'react';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { SaveIcon } from 'js/shared-styles/icons';

const useSavedEntitiesStoreSelector = (state) => state.saveEntity;
const entityStoreSelector = (state) => state.setShouldDisplaySavedOrEditedAlert;

function SaveEntityButton({ uuid, ...rest }) {
  const saveEntity = useSavedEntitiesStore(useSavedEntitiesStoreSelector);
  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);
  return (
    <SecondaryBackgroundTooltip title="Save Dataset to a List">
      <WhiteBackgroundIconButton
        onClick={() => {
          saveEntity(uuid);
          setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
        }}
        {...rest}
      >
        <SaveIcon color="primary" />
      </WhiteBackgroundIconButton>
    </SecondaryBackgroundTooltip>
  );
}

export default SaveEntityButton;
