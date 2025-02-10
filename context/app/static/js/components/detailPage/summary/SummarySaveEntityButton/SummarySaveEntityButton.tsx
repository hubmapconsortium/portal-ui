import React, { useState } from 'react';
import useEventCallback from '@mui/material/utils/useEventCallback';
import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import useSavedLists from 'js/components/savedLists/hooks';
import { Entity } from 'js/components/types';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import { WhiteRectangularTooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import { useEntitiesData } from 'js/hooks/useEntityData';
import { trackEvent } from 'js/helpers/trackers';
import { SavedListsEventCategories } from 'js/components/savedLists/constants';

function SaveEntityButton({ uuid }: Pick<Entity, 'uuid'>) {
  const { handleSaveEntities } = useSavedLists();
  const {
    entity: { entity_type },
  } = useFlaskDataContext();
  const [entityData] = useEntitiesData([uuid], ['hubmap_id']);

  const handleClick = useEventCallback(() => {
    handleSaveEntities({ entityUUIDs: new Set([uuid]) }).catch((error) => {
      console.error(error);
    });

    if (!entityData?.length) {
      return;
    }

    trackEvent({
      category: SavedListsEventCategories.EntityDetailPage(entity_type),
      action: 'Save Entity to Items',
      label: entityData[0].hubmap_id,
    });
  });

  return (
    <WhiteRectangularTooltipIconButton onClick={handleClick} tooltip="Save to list">
      <SaveEntityIcon color="primary" />
    </WhiteRectangularTooltipIconButton>
  );
}

function EditSavedEntityButton({ uuid }: Pick<Entity, 'uuid'>) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <WhiteRectangularTooltipIconButton
        onClick={() => {
          setDialogIsOpen(true);
        }}
        tooltip="Edit saved status"
      >
        <EditSavedEntityIcon color="primary" />
      </WhiteRectangularTooltipIconButton>
      <EditSavedStatusDialog dialogIsOpen={dialogIsOpen} setDialogIsOpen={setDialogIsOpen} uuid={uuid} />
    </>
  );
}

export default function SummarySaveEntityButton({ uuid }: Pick<Entity, 'uuid'>) {
  const { savedEntities } = useSavedLists();
  const { isAuthenticated } = useAppContext();

  if (!isAuthenticated) {
    return null;
  }

  return uuid in savedEntities.savedEntities ? <EditSavedEntityButton uuid={uuid} /> : <SaveEntityButton uuid={uuid} />;
}
