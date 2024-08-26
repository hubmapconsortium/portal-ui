import React, { useState, ElementType, useCallback } from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { IconButtonTypeMap } from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button, { ButtonProps } from '@mui/material/Button';
import UnfoldLessRoundedIcon from '@mui/icons-material/UnfoldLessRounded';

import { TooltipButtonProps, TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';
import { CheckIcon, EditSavedEntityIcon, FileIcon, SaveEntityIcon } from 'js/shared-styles/icons';
import useEntityStore, { savedAlertStatus, SummaryViewsType } from 'js/stores/useEntityStore';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import useSavedEntitiesStore, { SavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import { Entity } from 'js/components/types';
import { AllEntityTypes } from 'js/shared-styles/icons/entityIconMap';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useIsLargeDesktop } from 'js/hooks/media-queries';

function ActionButton<E extends ElementType = IconButtonTypeMap['defaultComponent']>({
  icon: Icon,
  ...rest
}: { icon: typeof SvgIcon | React.ComponentType<SvgIconProps> } & TooltipButtonProps<E>) {
  return (
    <TooltipIconButton {...rest}>
      <Icon color={rest.disabled ? 'disabled' : 'primary'} fontSize="1.5rem" />
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

function WorkspaceSVGIcon({ color = 'primary', ...props }: SvgIconProps) {
  return <SvgIcon component={WorkspacesIcon} color={color} {...props} />;
}

function CreateWorkspaceButton({
  uuid,
  hubmap_id,
  mapped_data_access_level,
}: Pick<Entity, 'uuid' | 'hubmap_id' | 'mapped_data_access_level'>) {
  const { setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    defaultName: hubmap_id,
    initialSelectedDatasets: [uuid],
  });

  const disabled = mapped_data_access_level === 'Protected';

  return (
    <>
      <ActionButton
        onClick={() => {
          setDialogIsOpen(true);
        }}
        icon={WorkspaceSVGIcon}
        tooltip={disabled ? 'Protected datasets are not available in workspaces.' : 'Launch a new workspace.'}
        disabled={disabled}
      />
      <NewWorkspaceDialog {...rest} />
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

function ViewSelectChip({
  startIcon,
  view,
  setView,
  selectedView,
}: {
  view: SummaryViewsType;
  selectedView: SummaryViewsType;
  setView: (v: SummaryViewsType) => void;
} & Pick<ButtonProps, 'startIcon'>) {
  const handleClick = useCallback(() => setView(view), [setView, view]);

  const isSelectedView = view === selectedView;
  return (
    <Button
      startIcon={startIcon}
      endIcon={isSelectedView ? <CheckIcon color="success" /> : undefined}
      variant="outlined"
      onClick={handleClick}
      sx={(theme) => ({
        borderRadius: theme.spacing(1),
        ...(isSelectedView && { boxShadow: theme.shadows[1] }),
      })}
    >
      {view} View
    </Button>
  );
}

const ProcessedDataIcon = sectionIconMap['processed-data'];

function ViewSelectChips({
  selectedView,
  setView,
  entity_type,
}: {
  selectedView: SummaryViewsType;
  setView: (v: SummaryViewsType) => void;
} & { entity_type: AllEntityTypes }) {
  if (!['Donor', 'Sample', 'Dataset', 'Publication'].includes(entity_type)) {
    return null;
  }

  const isDataset = entity_type === 'Dataset';

  return (
    <>
      <ViewSelectChip
        startIcon={<sectionIconMap.summary />}
        view="summary"
        setView={setView}
        selectedView={selectedView}
      />
      {isDataset && (
        <ViewSelectChip
          startIcon={<ProcessedDataIcon />}
          view="diagram"
          setView={setView}
          selectedView={selectedView}
        />
      )}
      <ViewSelectChip
        startIcon={<UnfoldLessRoundedIcon />}
        view="narrow"
        setView={setView}
        selectedView={selectedView}
      />
    </>
  );
}

function EntityHeaderActionButtons({
  entity_type,
  view,
  setView,
}: {
  view: SummaryViewsType;
  setView: (v: SummaryViewsType) => void;
  entity_type?: AllEntityTypes;
}) {
  const isLargeDesktop = useIsLargeDesktop();
  const { isWorkspacesUser } = useAppContext();

  const {
    entity: { mapped_data_access_level, hubmap_id, uuid },
  } = useFlaskDataContext();

  if (!(entity_type && uuid)) {
    return null;
  }

  const isDataset = entity_type === 'Dataset';
  const showWorkspaceButton = mapped_data_access_level && hubmap_id && isDataset && isWorkspacesUser;

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isLargeDesktop && <ViewSelectChips selectedView={view} setView={setView} entity_type={entity_type} />}
      <SaveEditEntityButton uuid={uuid} entity_type={entity_type} />
      <JSONButton entity_type={entity_type} uuid={uuid} />
      {showWorkspaceButton && (
        <CreateWorkspaceButton uuid={uuid} hubmap_id={hubmap_id} mapped_data_access_level={mapped_data_access_level} />
      )}
    </Stack>
  );
}

export default EntityHeaderActionButtons;
