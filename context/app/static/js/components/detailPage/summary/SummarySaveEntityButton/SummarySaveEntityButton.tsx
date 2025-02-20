import React, { useState } from 'react';
import { useAppContext } from 'js/components/Contexts';
import useSavedLists from 'js/components/savedLists/hooks';
import { Entity } from 'js/components/types';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import { WhiteRectangularTooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { EditSavedEntityIcon, SaveEntityIcon } from 'js/shared-styles/icons';

function SaveEntityButton({ uuid }: Pick<Entity, 'uuid'>) {
  const { useHandleSaveEntity } = useSavedLists();
  const handleSaveEntity = useHandleSaveEntity({ entityUUID: uuid });

  return (
    <WhiteRectangularTooltipIconButton onClick={handleSaveEntity} tooltip="Save to list">
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
  const { isHubmapUser } = useAppContext();

  if (!isHubmapUser) {
    return null;
  }

  return uuid in savedEntities.savedEntities ? <EditSavedEntityButton uuid={uuid} /> : <SaveEntityButton uuid={uuid} />;
}
