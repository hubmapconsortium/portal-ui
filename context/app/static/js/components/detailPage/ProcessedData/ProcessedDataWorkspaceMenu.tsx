import React from 'react';
import { useEventCallback } from '@mui/material/utils';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddRounded from '@mui/icons-material/AddRounded';

import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import { useOpenDialog } from 'js/components/workspaces/WorkspacesDropdownMenu/WorkspacesDropdownMenu';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useAppContext, useFlaskDataContext } from 'js/components/Contexts';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialog';

interface ProcessedDataWorkspaceMenuProps {
  button: React.ReactNode;
  datasetDetails: { hubmap_id: string; uuid: string; status: string };
}

function ProcessedDataWorkspaceMenu({
  button,
  datasetDetails: { hubmap_id, uuid, status },
}: ProcessedDataWorkspaceMenuProps) {
  const {
    entity: { mapped_data_access_level },
  } = useFlaskDataContext();

  const { isWorkspacesUser } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const track = useTrackEntityPageEvent();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
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
    initialSelectedDatasets: [uuid].filter(Boolean),
  });

  const openEditWorkspaceDialog = useOpenDialog('ADD_DATASETS_FROM_SEARCH', uuid);

  const createWorkspace = useEventCallback(() => {
    track({
      action: 'Start Creating Workspace',
      label: hubmap_id,
    });
    setOpenCreateWorkspace(true);
    handleClose();
  });

  const addToWorkspace = useEventCallback(() => {
    track({
      action: 'Start Adding Dataset to Existing Workspace',
      label: hubmap_id,
    });
    openEditWorkspaceDialog();
    handleClose();
  });

  // Clone the button element and add the onClick handler
  const buttonWithClickHandler = React.cloneElement(button as React.ReactElement, {
    onClick: handleOpen,
    'aria-controls': open ? 'basic-menu' : undefined,
    'aria-haspopup': 'true',
    'aria-expanded': open ? 'true' : undefined,
  });

  const showWorkspaceButton = mapped_data_access_level && hubmap_id && isWorkspacesUser && status === 'Published';

  if (!showWorkspaceButton) {
    return null;
  }

  const options = [
    {
      children: 'Launch New Workspace',
      onClick: createWorkspace,
      icon: <WorkspacesIcon color="primary" fontSize="1.25rem" />,
    },
    {
      children: 'Add to Workspace',
      onClick: addToWorkspace,
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
      </>
    </SelectableTableProvider>
  );
}

export default ProcessedDataWorkspaceMenu;
