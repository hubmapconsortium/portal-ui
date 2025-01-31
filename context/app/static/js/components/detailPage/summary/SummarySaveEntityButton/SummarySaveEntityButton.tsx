import React, { useState } from 'react';
import useEventCallback from '@mui/material/utils/useEventCallback';
import { useAppContext } from 'js/components/Contexts';
import useSavedLists from 'js/components/savedLists/hooks';
import { Entity } from 'js/components/types';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import { WhiteRectangularTooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';

function SaveEntityButton({ uuid }: Pick<Entity, 'uuid'>) {
  const { handleSaveEntities } = useSavedLists();

  const handleClick = useEventCallback(() => {
    handleSaveEntities({ entityUUIDs: new Set([uuid]) }).catch((error) => {
      console.error(error);
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
