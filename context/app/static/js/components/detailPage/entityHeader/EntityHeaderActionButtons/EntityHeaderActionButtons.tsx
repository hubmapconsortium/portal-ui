import React, { useState, ElementType } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { IconButtonTypeMap } from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { TooltipButtonProps, TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { EditSavedEntityIcon, FileIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import useEntityStore, { savedAlertStatus } from 'js/stores/useEntityStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import { Entity } from 'js/components/types';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useAppContext } from 'js/components/Contexts';
import WorkspacesIcon from 'assets/svg/workspaces.svg';

function ActionButton<E extends ElementType = IconButtonTypeMap['defaultComponent']>({
  icon: Icon,
  ...rest
}: { icon: typeof SvgIcon | React.ComponentType<SvgIconProps> } & TooltipButtonProps<E>) {
  return (
    <TooltipIconButton {...rest}>
      <Icon color="primary" fontSize="1.5rem" />
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

function WorkspaceSVGIcon(props: SvgIconProps) {
  return <SvgIcon component={WorkspacesIcon} color="primary" {...props} />;
}

function CreateWorkspaceButton({
  uuid,
  hubmap_id,
  mapped_data_access_level,
}: Pick<Entity, 'uuid' | 'hubmap_id' | 'mapped_data_access_level'>) {
  const { isWorkspacesUser } = useAppContext();
  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({ defaultName: hubmap_id });

  const disabled = mapped_data_access_level === 'Protected';

  if (!isWorkspacesUser) {
    return null;
  }
  return (
    <>
      <ActionButton
        onClick={() => {
          setDialogIsOpen(true);
        }}
        icon={WorkspaceSVGIcon}
        tooltip={disabled ? 'Protected datasets are not available in Workspaces.' : 'Launch a new workspace.'}
        disabled={disabled}
      />
      <NewWorkspaceDialog datasetUUIDs={new Set([uuid])} {...rest} />
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
  hubmap_id,
  mapped_data_access_level,
  entity_type,
}: { showJsonButton: boolean; entityCanBeSaved: boolean } & Partial<
  Pick<Entity, 'uuid' | 'hubmap_id' | 'mapped_data_access_level'> & { entity_type: AllEntityTypes }
>) {
  if (!(entity_type && uuid)) {
    return null;
  }

  const showWorkspaceButton = mapped_data_access_level && hubmap_id && entity_type === 'Dataset';

  return (
    <Stack direction="row" spacing={1}>
      {showJsonButton && <JSONButton entity_type={entity_type} uuid={uuid} />}
      {entityCanBeSaved && <SaveEditEntityButton uuid={uuid} entity_type={entity_type} />}
      {showWorkspaceButton && (
        <CreateWorkspaceButton uuid={uuid} hubmap_id={hubmap_id} mapped_data_access_level={mapped_data_access_level} />
      )}
    </Stack>
  );
}

export default EntityHeaderActionButtons;
