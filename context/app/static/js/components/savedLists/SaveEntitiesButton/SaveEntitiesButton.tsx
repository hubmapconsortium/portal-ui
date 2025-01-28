import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useAppContext } from 'js/components/Contexts';
import useSavedLists from 'js/components/savedLists/hooks';
import { generateCommaList } from 'js/helpers/functions';
import { useSavedListsAlertsStore, SavedListsSuccessAlertType } from 'js/stores/useSavedListsAlertsStore';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

export default function SaveEntitiesButton({
  entity_type,
  uuids,
  useSelectableTableTooltips,
}: {
  entity_type: AllEntityTypes;
  uuids: Set<string>;
  useSelectableTableTooltips?: boolean;
}) {
  const { isAuthenticated } = useAppContext();
  const { savedEntities, handleSaveEntities } = useSavedLists();
  const trackSave = useTrackEntityPageEvent();
  const setSuccessAlert = useSavedListsAlertsStore((state) => state.setSuccessAlert);

  if (!isAuthenticated) {
    return null;
  }

  const noEntities = uuids.size === 0;
  const allInSavedEntities = !noEntities && Array.from(uuids).every((uuid) => savedEntities.savedEntities[uuid]);

  const disabled = noEntities || allInSavedEntities;
  const entityTypes = `${entity_type.toLowerCase()}s`;

  let tooltip = '';
  const entityLabel = useSelectableTableTooltips ? `selected ${entityTypes}` : entityTypes;

  if (disabled) {
    tooltip = allInSavedEntities ? `All ${entityLabel} are already saved.` : `Select ${entityTypes} to save.`;
  } else {
    tooltip = `Save ${entityLabel}.`;
  }

  return (
    <WhiteBackgroundIconTooltipButton
      onClick={() => {
        trackSave({ action: 'Save To List', label: generateCommaList(Array.from(uuids)) });
        handleSaveEntities({ entityUUIDs: uuids }).catch((error) => {
          console.error(error);
        });
        setSuccessAlert(SavedListsSuccessAlertType.SavedEntity);
      }}
      tooltip={tooltip}
      disabled={disabled}
    >
      <SvgIcon
        color={disabled ? 'disabled' : 'primary'}
        component={allInSavedEntities ? EditSavedEntityIcon : SaveEntityIcon}
      />
    </WhiteBackgroundIconTooltipButton>
  );
}
