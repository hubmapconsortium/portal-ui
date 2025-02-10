import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import useEventCallback from '@mui/material/utils/useEventCallback';

import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import useSavedLists from 'js/components/savedLists/hooks';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';
import { trackEvent } from 'js/helpers/trackers';
import { SavedListsEventCategories } from 'js/components/savedLists/types';
import { useEntitiesData } from 'js/hooks/useEntityData';
import { generateCommaList } from 'js/helpers/functions';

function createTooltip({
  entity_type,
  allInSavedEntities,
  disabled,
  fromSelectableTable,
}: {
  entity_type: AllEntityTypes;
  allInSavedEntities: boolean;
  disabled: boolean;
  fromSelectableTable?: boolean;
}) {
  const entityTypes = `${entity_type.toLowerCase()}s`;
  const entityLabel = fromSelectableTable ? `selected ${entityTypes}` : entityTypes;

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
  fromSelectableTable,
}: {
  entity_type: AllEntityTypes;
  uuids: Set<string>;
  fromSelectableTable?: boolean;
}) {
  const { isAuthenticated } = useAppContext();
  const { savedEntities, handleSaveEntities } = useSavedLists();
  const {
    entity: { entity_type: page_entity_type },
  } = useFlaskDataContext();

  const [entityData] = useEntitiesData(Array.from(uuids), ['hubmap_id']);

  const handleClick = useEventCallback(() => {
    handleSaveEntities({ entityUUIDs: uuids }).catch((error) => {
      console.error(error);
    });

    if (!entityData) {
      return;
    }

    trackEvent({
      category: fromSelectableTable
        ? SavedListsEventCategories.EntitySearchPage(entity_type)
        : SavedListsEventCategories.EntityDetailPage(page_entity_type),
      action: 'Save Entity to Items',
      label: generateCommaList(entityData.map((entity) => entity.hubmap_id)),
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
    fromSelectableTable,
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
