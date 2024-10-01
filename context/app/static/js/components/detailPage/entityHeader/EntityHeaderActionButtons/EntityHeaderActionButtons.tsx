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
import { useFlaskDataContext } from 'js/components/Contexts';
import { sectionIconMap } from 'js/shared-styles/icons/sectionIconMap';
import { useIsLargeDesktop } from 'js/hooks/media-queries';
import ProcessedDataWorkspaceMenu from 'js/components/detailPage/ProcessedData/ProcessedDataWorkspaceMenu';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import AddDatasetsFromDetailDialog from 'js/components/workspaces/AddDatasetsFromDetailDialog';

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
        whiteSpace: 'nowrap',
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

  const {
    entity: { mapped_data_access_level, uuid, hubmap_id, status },
  } = useFlaskDataContext();

  if (!(entity_type && uuid)) {
    return null;
  }

  const disabled = mapped_data_access_level === 'Protected';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isLargeDesktop && <ViewSelectChips selectedView={view} setView={setView} entity_type={entity_type} />}
      <SaveEditEntityButton uuid={uuid} entity_type={entity_type} />
      <JSONButton entity_type={entity_type} uuid={uuid} />
      <ProcessedDataWorkspaceMenu
        button={
          <ActionButton
            icon={WorkspaceSVGIcon}
            tooltip={
              disabled
                ? 'Protected datasets are not available in workspaces.'
                : 'Launch new workspace or add dataset to an existing workspace.'
            }
            disabled={disabled}
          />
        }
        datasetDetails={{ hubmap_id, uuid, status }}
        dialogType="ADD_DATASETS_FROM_HEADER"
      />
      <AddDatasetsFromDetailDialog uuid={uuid} dialogType="ADD_DATASETS_FROM_HEADER" />
    </Stack>
  );
}

export default EntityHeaderActionButtons;
