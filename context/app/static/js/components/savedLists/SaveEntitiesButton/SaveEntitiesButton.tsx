import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import useEventCallback from '@mui/material/utils/useEventCallback';

import { useAppContext } from 'js/components/Contexts';
import useSavedLists from 'js/components/savedLists/hooks';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

function createTooltip({
  entity_type,
  allInSavedEntities,
  disabled,
  enableSelectableTableTooltips,
}: {
  entity_type: AllEntityTypes;
  allInSavedEntities: boolean;
  disabled: boolean;
  enableSelectableTableTooltips?: boolean;
}) {
  const entityTypes = `${entity_type.toLowerCase()}s`;
  const entityLabel = enableSelectableTableTooltips ? `selected ${entityTypes}` : entityTypes;

  if (!disabled) {
    return `Save ${entityLabel}.`;
  }
  if (allInSavedEntities) {
    return `All ${entityLabel} are already saved.`;
  }
  return `Select ${entityTypes} to save.`;
}

export default function SaveEntitiesButton({
  entity_type,
  uuids,
  enableSelectableTableTooltips,
}: {
  entity_type: AllEntityTypes;
  uuids: Set<string>;
  enableSelectableTableTooltips?: boolean;
}) {
  const { isAuthenticated } = useAppContext();
  const { savedEntities, handleSaveEntities } = useSavedLists();

  const handleClick = useEventCallback(() => {
    handleSaveEntities({ entityUUIDs: uuids }).catch((error) => {
      console.error(error);
    });
  });

  if (!isAuthenticated) {
    return null;
  }

  const noEntities = uuids.size === 0;
  const allInSavedEntities = !noEntities && Array.from(uuids).every((uuid) => savedEntities.savedEntities[uuid]);
  const disabled = noEntities || allInSavedEntities;

  const tooltip = createTooltip({
    entity_type,
    allInSavedEntities,
    disabled,
    enableSelectableTableTooltips,
  });

  return (
    <WhiteBackgroundIconTooltipButton onClick={handleClick} tooltip={tooltip} disabled={disabled}>
      <SvgIcon
        color={disabled ? 'disabled' : 'primary'}
        component={allInSavedEntities ? EditSavedEntityIcon : SaveEntityIcon}
      />
    </WhiteBackgroundIconTooltipButton>
  );
}
