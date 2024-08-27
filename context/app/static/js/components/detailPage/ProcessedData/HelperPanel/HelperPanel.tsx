import React, { PropsWithChildren } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { formatDate } from 'date-fns/format';
import Divider from '@mui/material/Divider';
import { useIsDesktop } from 'js/hooks/media-queries';
import SchemaRounded from '@mui/icons-material/SchemaRounded';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import CloudDownloadRounded from '@mui/icons-material/CloudDownloadRounded';
import { useAppContext } from 'js/components/Contexts';
import { useAnimatedSidebarPosition } from 'js/shared-styles/sections/TableOfContents/hooks';
import { animated } from '@react-spring/web';
import { useEventCallback } from '@mui/material/utils';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddRounded from '@mui/icons-material/AddRounded';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useOpenDialog } from 'js/components/workspaces/WorkspacesDropdownMenu/WorkspacesDropdownMenu';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider/SelectableTableProvider';
import AddDatasetsFromSearchDialog from 'js/components/workspaces/AddDatasetsFromSearchDialog';
import { LineClamp } from 'js/shared-styles/text';
import Fade from '@mui/material/Fade';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { HelperPanelPortal } from '../../DetailLayout/DetailLayout';
import useProcessedDataStore from '../store';
import StatusIcon from '../../StatusIcon';
import { getDateLabelAndValue } from '../../utils';
import { HelperPanelButton } from './styles';
import { useTrackEntityPageEvent } from '../../useTrackEntityPageEvent';

function useCurrentDataset() {
  return useProcessedDataStore((state) => state.currentDataset);
}

function HelperPanelHeader() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  return (
    <Typography variant="subtitle2" display="flex" alignItems="center" gap={0.5} whiteSpace="nowrap">
      <SchemaRounded fontSize="small" />
      {currentDataset?.hubmap_id}
    </Typography>
  );
}

function HelperPanelStatus() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  return (
    <Stack direction="row" alignItems="center">
      <StatusIcon status={currentDataset.status} />
      <Typography variant="body2">{currentDataset.status}</Typography>
    </Stack>
  );
}

interface HelperPanelBodyItemProps extends PropsWithChildren {
  label: string;
  noWrap?: boolean;
}

function HelperPanelBodyItem({ label, children, noWrap }: HelperPanelBodyItemProps) {
  const body = noWrap ? <LineClamp lines={3}>{children}</LineClamp> : children;
  return (
    <Stack direction="column">
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body2">{body}</Typography>
    </Stack>
  );
}

function HelperPanelBody() {
  const currentDataset = useCurrentDataset();
  if (!currentDataset) {
    return null;
  }
  const [dateLabel, date] = getDateLabelAndValue(currentDataset);
  return (
    <>
      {currentDataset.title && (
        <HelperPanelBodyItem label="Title" noWrap>
          {currentDataset.title}
        </HelperPanelBodyItem>
      )}
      {currentDataset.description && (
        <HelperPanelBodyItem label="Description" noWrap>
          {currentDataset.description}
        </HelperPanelBodyItem>
      )}
      <HelperPanelBodyItem label="Pipeline">{currentDataset.pipeline}</HelperPanelBodyItem>
      <HelperPanelBodyItem label="Consortium">{currentDataset.group_name}</HelperPanelBodyItem>
      <HelperPanelBodyItem label={dateLabel}>{date && formatDate(date, 'yyyy-MM-dd')}</HelperPanelBodyItem>
    </>
  );
}

function WorkspaceButton() {
  const currentDataset = useCurrentDataset();
  const { isWorkspacesUser } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const track = useTrackEntityPageEvent();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    track({
      action: 'Open Workspace Menu',
      label: currentDataset?.hubmap_id,
    });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    control,
    errors,
    removeDatasets,
    setDialogIsOpen: setOpenCreateWorkspace,
    dialogIsOpen: createWorkspaceIsOpen,
    ...rest
  } = useCreateWorkspaceForm({
    defaultName: currentDataset?.hubmap_id,
    initialSelectedDatasets: currentDataset ? [currentDataset.uuid] : [],
  });

  const openEditWorkspaceDialog = useOpenDialog('ADD_DATASETS_FROM_SEARCH');

  const trackCreateWorkspace = useEventCallback(() => {
    track({
      action: 'Start Creating Workspace',
      label: currentDataset?.hubmap_id,
    });
    setOpenCreateWorkspace(true);
    handleClose();
  });

  const trackAddToWorkspace = useEventCallback(() => {
    track({
      action: 'Start Adding Dataset to Existing Workspace',
      label: currentDataset?.hubmap_id,
    });
    openEditWorkspaceDialog();
    handleClose();
  });

  if (!isWorkspacesUser || currentDataset?.status !== 'Published') {
    return null;
  }
  // The selectable table provider is used here since a lot of the workspace logic relies on the selected rows
  return (
    <SelectableTableProvider tableLabel="Current Dataset" selectedRows={new Set([currentDataset.uuid])}>
      <HelperPanelButton
        startIcon={<WorkspacesIcon color="primary" />}
        onClick={handleClick}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Workspace
      </HelperPanelButton>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={trackCreateWorkspace}>
          <ListItemIcon>
            <WorkspacesIcon color="primary" fontSize="1.5rem" />
          </ListItemIcon>
          Launch New Workspace
        </MenuItem>
        <MenuItem onClick={trackAddToWorkspace}>
          <ListItemIcon>
            <AddRounded />
          </ListItemIcon>
          Add to Workspace
        </MenuItem>
      </Menu>
      <NewWorkspaceDialog dialogIsOpen={createWorkspaceIsOpen} control={control} errors={errors} {...rest} />
      <AddDatasetsFromSearchDialog />
    </SelectableTableProvider>
  );
}

function HelperPanelActions() {
  const currentDataset = useCurrentDataset();
  const track = useTrackEntityPageEvent();
  if (!currentDataset) {
    return null;
  }
  return (
    <>
      <WorkspaceButton />
      <SecondaryBackgroundTooltip title="Scroll down to the Bulk Data Transfer Section.">
        <HelperPanelButton
          startIcon={<CloudDownloadRounded />}
          href="#bulk-data-transfer"
          onClick={() => {
            track({
              action: 'Navigate to Bulk Download',
              label: currentDataset?.hubmap_id,
            });
          }}
        >
          Bulk Download
        </HelperPanelButton>
      </SecondaryBackgroundTooltip>
    </>
  );
}

const AnimatedStack = animated(Stack);

export default function HelperPanel() {
  const currentDataset = useCurrentDataset();
  const isDesktop = useIsDesktop();
  const style = useAnimatedSidebarPosition();
  return (
    <HelperPanelPortal>
      <Fade
        in={Boolean(currentDataset && isDesktop && style)}
        timeout={{
          appear: 300,
          enter: 300,
          exit: 0,
        }}
      >
        <AnimatedStack
          direction="column"
          maxWidth="12rem"
          padding={1}
          gap={1}
          bgcolor="secondaryContainer.main"
          boxShadow={2}
          style={style!}
          position="sticky"
        >
          <HelperPanelHeader />
          <Divider />
          <HelperPanelStatus />
          <HelperPanelBody />
          <HelperPanelActions />
        </AnimatedStack>
      </Fade>
    </HelperPanelPortal>
  );
}
