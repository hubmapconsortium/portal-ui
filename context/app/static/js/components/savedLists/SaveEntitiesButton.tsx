import React from 'react';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSavedLists } from 'js/components/savedLists/hooks';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { SvgIcon } from '@mui/material';
import { generateCommaList } from 'js/helpers/functions';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

export default function SaveEntitiesButton({ entity_type }: { entity_type: AllEntityTypes }) {
  const { selectedRows } = useSelectableTableStore();
  const { savedEntities, saveEntities } = useSavedLists();

  const setShouldDisplaySavedOrEditedAlert = useEntityStore((state) => state.setShouldDisplaySavedOrEditedAlert);
  const trackSave = useTrackEntityPageEvent();

  const noSelectedRows = selectedRows.size === 0;
  const allInSavedEntities = !noSelectedRows && Array.from(selectedRows).every((uuid) => savedEntities[uuid]);

  const disabled = noSelectedRows || allInSavedEntities;
  const disabledTooltip = allInSavedEntities
    ? `All selected ${entity_type.toLowerCase()}s are already saved.`
    : `Select ${entity_type.toLowerCase()}s to save.`;

  return (
    <WhiteBackgroundIconTooltipButton
      onClick={() => {
        saveEntities(selectedRows);
        trackSave({ action: 'Save To List', label: generateCommaList(Array.from(selectedRows)) });
        setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
      }}
      tooltip={disabled ? disabledTooltip : `Save selected ${entity_type.toLowerCase()}s.`}
      disabled={disabled}
    >
      <SvgIcon
        color={disabled ? 'disabled' : 'primary'}
        component={allInSavedEntities ? EditSavedEntityIcon : SaveEntityIcon}
      />
    </WhiteBackgroundIconTooltipButton>
  );
}
