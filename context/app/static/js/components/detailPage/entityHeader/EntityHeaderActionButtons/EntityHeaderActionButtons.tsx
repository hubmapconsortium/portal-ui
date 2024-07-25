import React, { useState, ElementType } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { IconButtonTypeMap } from '@mui/material/IconButton';

import { TooltipButtonProps, TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { EditSavedEntityIcon, FileIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import { Entity } from 'js/components/types';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';

function ActionButton<E extends ElementType = IconButtonTypeMap['defaultComponent']>({
  icon: Icon,
  ...rest
}: { icon: typeof SvgIcon } & TooltipButtonProps<E>) {
  return (
    <TooltipIconButton {...rest}>
      <Icon color="primary" />
    </TooltipIconButton>
  );
}

function JSONButton({ entity_type, uuid }: Pick<Entity, 'uuid'> & { entity_type: AllEntityTypes }) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  return (
    <ActionButton<'a'>
      tooltip="View JSON"
      href={`/browse/${entity_type.toLowerCase()}/${uuid}.json`}
      target="_blank"
      onClick={() => trackEntityPageEvent({ action: 'View JSON' })}
      icon={FileIcon}
    />
  );
}

function SaveEntityButton({ uuid }: Pick<Entity, 'uuid'>) {
  const saveEntity = useSavedEntitiesStore((state) => state.saveEntity);
  const setShouldDisplaySavedOrEditedAlert = useEntityStore((state) => state.setShouldDisplaySavedOrEditedAlert);

  const trackSave = useTrackEntityPageEvent();

  return (
    <ActionButton
      onClick={() => {
        saveEntity(uuid);
        trackSave({ action: 'Save To List', label: uuid });
        setShouldDisplaySavedOrEditedAlert(savedAlertStatus);
      }}
      icon={SaveEntityIcon}
      tooltip="Save to list"
    />
  );
}

function EditSavedEntityButton({ entity_type, uuid }: Pick<Entity, 'uuid'> & { entity_type: AllEntityTypes }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <ActionButton
        onClick={() => {
          setDialogIsOpen(true);
        }}
        icon={EditSavedEntityIcon}
        tooltip="Edit saved status"
      />
      <EditSavedStatusDialog
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        uuid={uuid}
        entity_type={entity_type}
      />
    </>
  );
}

const useSavedEntitiesSelector = (state: SavedEntitiesStore) => state.savedEntities;

function SaveEditEntityButton({ entity_type, uuid }: Pick<Entity, 'uuid'> & { entity_type: AllEntityTypes }) {
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  return uuid in savedEntities ? (
    <EditSavedEntityButton uuid={uuid} entity_type={entity_type} />
  ) : (
    <SaveEntityButton uuid={uuid} />
  );
}

function EntityHeaderActionButtons({
  showJsonButton,
  entityCanBeSaved,
  uuid,
  entity_type,
}: { showJsonButton: boolean; entityCanBeSaved: boolean } & Partial<
  Pick<Entity, 'uuid'> & { entity_type: AllEntityTypes }
>) {
  if (!(entity_type && uuid)) {
    return null;
  }
  return (
    <>
      {showJsonButton && <JSONButton entity_type={entity_type} uuid={uuid} />}
      {entityCanBeSaved && <SaveEditEntityButton uuid={uuid} entity_type={entity_type} />}
    </>
  );
}

export default EntityHeaderActionButtons;
