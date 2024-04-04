import React, { PropsWithChildren } from 'react';
import MenuItem from '@mui/material/MenuItem';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { StyledDropdownMenuButton } from 'js/components/entity-search/MetadataMenu/style';
import { DialogType, useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import AddDatasetsFromSearchDialog from '../AddDatasetsFromSearchDialog';

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

type DialogTypes = Extract<DialogType, typeof addDatasetsDialogType>;

interface WorkspaceDropdownMenuItemProps extends PropsWithChildren {
  dialogType: DialogTypes;
}

function WorkspaceDropdownMenuItem({ dialogType, children }: WorkspaceDropdownMenuItemProps) {
  const { open, setDialogType } = useEditWorkspaceStore();

  return (
    <MenuItem
      onClick={() => {
        setDialogType(dialogType);
        open();
      }}
    >
      {children}
    </MenuItem>
  );
}

const menuItems: {
  label: string;
  dialogType: DialogTypes;
}[] = [{ label: 'Add to Existing Workspace', dialogType: addDatasetsDialogType }];

function WorkspaceDropdownMenu({ type }: MetadataMenuProps) {
  const { isWorkspacesUser } = useAppContext();
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  if (!(isWorkspacesUser && isDatasetSearch)) {
    return null;
  }
  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Workspaces</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <NewWorkspaceDialogFromSelections />
        {menuItems.map(({ dialogType, label }) => (
          <WorkspaceDropdownMenuItem dialogType={dialogType} key={label}>
            {label}
          </WorkspaceDropdownMenuItem>
        ))}
      </DropdownMenu>
    </>
  );
}

export { WorkspaceSearchDialogs };
export default withDropdownMenuProvider(WorkspaceDropdownMenu, false);
