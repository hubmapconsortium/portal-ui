import React, { useState } from 'react';
import { useEventCallback } from '@mui/material/utils';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddRounded from '@mui/icons-material/AddRounded';

import { WorkspacesIcon } from 'js/shared-styles/icons';
import { useOpenDialog } from 'js/components/workspaces/WorkspacesDropdownMenu/WorkspacesDropdownMenu';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog/NewWorkspaceDialog';
import { DialogType } from 'js/stores/useWorkspaceModalStore';
import AddDatasetsFromDetailDialog from 'js/components/workspaces/AddDatasetsFromDetailDialog';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { trackEvent } from 'js/helpers/trackers';
import { useAppContext } from 'js/components/Contexts';
import { useDatasetAccess } from 'js/hooks/useDatasetPermissions';

interface ProcessedDataWorkspaceMenuProps {
  button: React.ReactNode;
  hubmap_id: string;
  uuid: string;
  dialogType: DialogType;
}

function ProcessedDataWorkspaceMenu({ button, hubmap_id, uuid, dialogType }: ProcessedDataWorkspaceMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
    initialSelectedDatasets: [uuid].filter(Boolean),
  });

  const openEditWorkspaceDialog = useOpenDialog(dialogType);

  const createWorkspace = useEventCallback(() => {
    trackEvent({
      category: WorkspacesEventCategories.WorkspaceDialog,
      action: 'Open Create Workspace Dialog',
      label: uuid,
    });
    setOpenCreateWorkspace(true);
    handleClose();
  });

  const addToWorkspace = useEventCallback(() => {
    trackEvent({
      category: WorkspacesEventCategories.WorkspaceDialog,
      action: 'Open Add to Workspace Dialog',
      label: uuid,
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

  const { isWorkspacesUser } = useAppContext();
  const { accessAllowed, isLoading } = useDatasetAccess(uuid);

  if (!isWorkspacesUser || !accessAllowed || isLoading) {
    return null;
  }

  // The selectable table provider is used here since a lot of the workspace logic relies on the selected rows
  return (
    <>
      {buttonWithClickHandler}
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
      <AddDatasetsFromDetailDialog uuid={uuid} dialogType={dialogType} />
      <NewWorkspaceDialog dialogIsOpen={createWorkspaceIsOpen} control={control} errors={errors} {...rest} />
    </>
  );
}

export default ProcessedDataWorkspaceMenu;
