import React, { useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { StyledDropdownMenuButton } from 'js/components/searchPage/MetadataMenu/style';
import { DialogType, useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import { AddIcon } from 'js/shared-styles/icons';
import AddDatasetsFromSearchDialog from 'js/components/workspaces/AddDatasetsFromSearchDialog';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { useEventCallback } from '@mui/material';
import { trackEvent } from 'js/helpers/trackers';
import { WorkspacesEventCategories } from 'js/components/workspaces/types';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

const menuID = 'workspace-menu';

interface MetadataMenuProps {
  type: string;
}

const addDatasetsDialogType = 'ADD_DATASETS_FROM_SEARCH';

function WorkspaceSearchDialogs() {
  const { dialogType } = useEditWorkspaceStore();

  if (dialogType === addDatasetsDialogType) {
    return <AddDatasetsFromSearchDialog />;
  }
}

export function useOpenDialog(dialogType: DialogType) {
  const { open, setDialogType } = useEditWorkspaceStore();

  const onClick = useCallback(() => {
    setDialogType(dialogType);
    open();
  }, [dialogType, open, setDialogType]);
  return onClick;
}

function AddToWorkspaceDialogFromSelections() {
  const openEditWorkspaceDialog = useOpenDialog(addDatasetsDialogType);
  const { selectedRows } = useSelectableTableStore();

  const onClick = useEventCallback(() => {
    openEditWorkspaceDialog();
    trackEvent({
      category: WorkspacesEventCategories.WorkspaceDialog,
      action: 'Open Add to Workspace dialog',
      label: selectedRows,
    });
  });

  return (
    <MenuItem onClick={onClick}>
      <AddIcon sx={{ mr: 1, fontSize: '1.25rem' }} color="primary" />
      Add to Existing Workspace
    </MenuItem>
  );
}

function WorkspaceDropdownMenu({ type }: MetadataMenuProps) {
  const { isWorkspacesUser } = useAppContext();
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  if (!(isWorkspacesUser && isDatasetSearch)) {
    return null;
  }
  return (
    <>
      <StyledDropdownMenuButton menuID={menuID} variant="outlined">
        <SvgIcon component={WorkspacesIcon} sx={{ mr: 1, fontSize: '1.25rem' }} />
        Workspaces
      </StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <NewWorkspaceDialogFromSelections />
        <AddToWorkspaceDialogFromSelections />
      </DropdownMenu>
    </>
  );
}

export { WorkspaceSearchDialogs };
export default withDropdownMenuProvider(WorkspaceDropdownMenu, false);
