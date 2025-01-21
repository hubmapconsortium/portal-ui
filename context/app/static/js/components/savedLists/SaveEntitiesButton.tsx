import React from 'react';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { SvgIcon } from '@mui/material';
import { generateCommaList } from 'js/helpers/functions';

export default function SaveEntitiesButton({
  entity_type,
  uuids,
  tooltip,
}: {
  entity_type: AllEntityTypes;
  uuids: Set<string>;
  tooltip?: string;
}) {
  const { savedEntities, saveEntities } = useSavedLists();

  const setShouldDisplaySavedOrEditedAlert = useEntityStore((state) => state.setShouldDisplaySavedOrEditedAlert);
  const trackSave = useTrackEntityPageEvent();

  const noEntities = uuids.size === 0;
  const allInSavedEntities = !noEntities && Array.from(uuids).every((uuid) => savedEntities[uuid]);

  const disabled = noEntities || allInSavedEntities;
  const disabledTooltip = allInSavedEntities
    ? `All ${entity_type.toLowerCase()}s are already saved.`
    : `Select ${entity_type.toLowerCase()}s to save.`;
  const enabledTooltip = tooltip ?? `Save ${entity_type.toLowerCase()}s.`;

  return (
    <WhiteBackgroundIconTooltipButton
      onClick={() => {
        saveEntities(uuids);
        trackSave({ action: 'Save To List', label: generateCommaList(Array.from(uuids)) });
        setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
      }}
      tooltip={disabled ? disabledTooltip : enabledTooltip}
      disabled={disabled}
    >
      <SvgIcon
        color={disabled ? 'disabled' : 'primary'}
        component={allInSavedEntities ? EditSavedEntityIcon : SaveEntityIcon}
      />
    </WhiteBackgroundIconTooltipButton>
  );
}
