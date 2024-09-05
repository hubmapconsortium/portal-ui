import React from 'react';
import { useEventCallback } from '@mui/material/utils';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddRounded from '@mui/icons-material/AddRounded';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import { WorkspacesIcon } from 'js/shared-styles/icons';

import { useOpenDialog } from '../../workspaces/WorkspacesDropdownMenu/WorkspacesDropdownMenu';
import { useCreateWorkspaceForm } from '../../workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import NewWorkspaceDialog from '../../workspaces/NewWorkspaceDialog/NewWorkspaceDialog';
import AddDatasetsFromSearchDialog from '../../workspaces/AddDatasetsFromSearchDialog/AddDatasetsFromSearchDialog';
import { useAppContext, useFlaskDataContext } from '../../Contexts';
import { useTrackEntityPageEvent } from '../useTrackEntityPageEvent';

interface ProcessedDataWorkspaceMenuProps {
  button: React.ReactNode;
}

function ProcessedDataWorkspaceMenu({ button }: ProcessedDataWorkspaceMenuProps) {
  const {
    entity: { mapped_data_access_level, hubmap_id, uuid, entity_type, status },
  } = useFlaskDataContext();
  const isDataset = entity_type === 'Dataset';
  const { isWorkspacesUser } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const track = useTrackEntityPageEvent();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    track({
      action: 'Open Workspace Menu',
      label: hubmap_id,
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
    defaultName: hubmap_id,
    initialSelectedDatasets: [uuid] ?? [],
  });

  const openEditWorkspaceDialog = useOpenDialog('ADD_DATASETS_FROM_SEARCH');

  const trackCreateWorkspace = useEventCallback(() => {
    track({
      action: 'Start Creating Workspace',
      label: hubmap_id,
    });
    setOpenCreateWorkspace(true);
    handleClose();
  });

  const trackAddToWorkspace = useEventCallback(() => {
    track({
      action: 'Start Adding Dataset to Existing Workspace',
      label: hubmap_id,
    });
    openEditWorkspaceDialog();
    handleClose();
  });

  // Clone the button element and add the onClick handler
  const buttonWithClickHandler = React.cloneElement(button as React.ReactElement, {
    onClick: handleClick,
    'aria-controls': open ? 'basic-menu' : undefined,
    'aria-haspopup': 'true',
    'aria-expanded': open ? 'true' : undefined,
  });

  const showWorkspaceButton =
    mapped_data_access_level && hubmap_id && isDataset && isWorkspacesUser && status === 'Published';

  if (!showWorkspaceButton) {
    return null;
  }

  const options = [
    {
      children: 'Launch New Workspace',
      onClick: trackCreateWorkspace,
      icon: <WorkspacesIcon color="primary" fontSize="1.25rem" />,
    },
    {
      children: 'Add to Workspace',
      onClick: trackAddToWorkspace,
      icon: <AddRounded color="primary" />,
    },
  ];

  // The selectable table provider is used here since a lot of the workspace logic relies on the selected rows
  return (
    <SelectableTableProvider tableLabel="Current Dataset" selectedRows={new Set([uuid])}>
      {buttonWithClickHandler}
      <>
        <Menu
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          {options.map(({ children, onClick, icon }) => (
            <MenuItem key={children} onClick={onClick}>
              <ListItemIcon>{icon}</ListItemIcon>
              {children}
            </MenuItem>
          ))}
        </Menu>
        <NewWorkspaceDialog dialogIsOpen={createWorkspaceIsOpen} control={control} errors={errors} {...rest} />
        <AddDatasetsFromSearchDialog />
      </>
    </SelectableTableProvider>
  );
}

export default ProcessedDataWorkspaceMenu;
