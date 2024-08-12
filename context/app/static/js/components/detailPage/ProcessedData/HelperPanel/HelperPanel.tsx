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
import { formatSectionHash } from 'js/shared-styles/sections/TableOfContents/utils';
import { useAnimatedSidebarPosition } from 'js/shared-styles/sections/TableOfContents/hooks';
import { animated } from '@react-spring/web';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useOpenDialog } from 'js/components/workspaces/WorkspacesDropdownMenu/WorkspacesDropdownMenu';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider/SelectableTableProvider';
import AddDatasetsFromSearchDialog from 'js/components/workspaces/AddDatasetsFromSearchDialog';
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
  return (
    <Typography variant="subtitle2" display="flex" alignItems="center" gap={0.5} whiteSpace="nowrap">
      <SchemaRounded fontSize="small" />
      <a href={`#${formatSectionHash(`section-${currentDataset?.hubmap_id}`)}`}>{currentDataset?.hubmap_id}</a>
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

const noWrapStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
};

function HelperPanelBodyItem({ label, children, noWrap }: HelperPanelBodyItemProps) {
  const valueStyles = noWrap ? noWrapStyles : {};
  return (
    <Stack direction="column">
      <Typography variant="overline">{label}</Typography>
      <Typography variant="body2" sx={valueStyles}>
        {children}
      </Typography>
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
    setDialogIsOpen: setOpenCreateWorkspace,
    dialogIsOpen: createWorkspaceIsOpen,
    ...rest
  } = useCreateWorkspaceForm({ defaultName: currentDataset?.hubmap_id });

  const openEditWorkspaceDialog = useOpenDialog('ADD_DATASETS_FROM_SEARCH');

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
        <MenuItem
          onClick={() => {
            track({
              action: 'Start Creating Workspace',
              label: currentDataset?.hubmap_id,
            });
            setOpenCreateWorkspace(true);
            handleClose();
          }}
        >
          <ListItemIcon>
            <WorkspacesIcon color="primary" fontSize="1.5rem" />
          </ListItemIcon>
          Launch New Workspace
        </MenuItem>
        <MenuItem
          onClick={() => {
            track({
              action: 'Start Adding Dataset to Existing Workspace',
              label: currentDataset?.hubmap_id,
            });
            openEditWorkspaceDialog();
            handleClose();
          }}
        >
          <ListItemIcon>
            <AddRounded />
          </ListItemIcon>
          Add to Workspace
        </MenuItem>
      </Menu>
      <NewWorkspaceDialog
        datasetUUIDs={new Set([currentDataset.uuid])}
        dialogIsOpen={createWorkspaceIsOpen}
        control={control}
        errors={errors}
        {...rest}
      />
      <AddDatasetsFromSearchDialog />
    </SelectableTableProvider>
  );
}

function HelperPanelActions() {
  const currentDataset = useCurrentDataset();
  const track = useTrackEntityPageEvent();
  return (
    <>
      <WorkspaceButton />
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
    </>
  );
}

const AnimatedStack = animated(Stack);

export default function HelperPanel() {
  const currentDataset = useCurrentDataset();
  const isDesktop = useIsDesktop();
  const style = useAnimatedSidebarPosition();
  if (!currentDataset || !isDesktop || !style) {
    return null;
  }
  return (
    <HelperPanelPortal>
      <AnimatedStack
        direction="column"
        maxWidth="12rem"
        padding={1}
        gap={1}
        bgcolor="secondaryContainer.main"
        boxShadow={2}
        style={style}
        position="sticky"
      >
        <HelperPanelHeader />
        <Divider />
        <HelperPanelStatus />
        <HelperPanelBody />
        <HelperPanelActions />
      </AnimatedStack>
    </HelperPanelPortal>
  );
}
