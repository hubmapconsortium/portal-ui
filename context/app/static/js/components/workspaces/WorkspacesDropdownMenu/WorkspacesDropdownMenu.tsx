import React, { PropsWithChildren, useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { StyledDropdownMenuButton } from 'js/components/searchPage/MetadataMenu/style';
import { DialogType, useEditWorkspaceStore } from 'js/stores/useWorkspaceModalStore';
import WorkspacesIcon from 'assets/svg/workspaces.svg';
import { AddIcon } from 'js/shared-styles/icons';
import AddDatasetsFromSearchOrDetailDialog from '../AddDatasetsFromSearchOrDetailDialog';

const menuID = 'workspace-menu';

interface MetadataMenuProps {
  type: string;
}

const addDatasetsDialogType = 'ADD_DATASETS_FROM_SEARCH';

function WorkspaceSearchDialogs() {
  const { dialogType } = useEditWorkspaceStore();

  if (dialogType === addDatasetsDialogType) {
    return <AddDatasetsFromSearchOrDetailDialog />;
  }
}

type DialogTypes = Extract<DialogType, typeof addDatasetsDialogType>;

interface WorkspaceDropdownMenuItemProps extends PropsWithChildren {
  dialogType: DialogTypes;
  icon: typeof SvgIcon;
}

export function useOpenDialog(dialogType: DialogTypes, uuid?: string) {
  const { open, setDialogType, setDialogDatasetUUIDs } = useEditWorkspaceStore();

  const onClick = useCallback(() => {
    setDialogType(dialogType);
    setDialogDatasetUUIDs(uuid ? [uuid] : []);
    open();
  }, [dialogType, open, setDialogType, uuid, setDialogDatasetUUIDs]);
  return onClick;
}

function WorkspaceDropdownMenuItem({ dialogType, children, icon: Icon }: WorkspaceDropdownMenuItemProps) {
  const onClick = useOpenDialog(dialogType);
  return (
    <MenuItem onClick={onClick}>
      <Icon sx={{ mr: 1, fontSize: '1.25rem' }} />
      {children}
    </MenuItem>
  );
}

const menuItems: {
  label: string;
  dialogType: DialogTypes;
  icon: typeof SvgIcon;
}[] = [{ label: 'Add to Existing Workspace', dialogType: addDatasetsDialogType, icon: AddIcon }];

function WorkspaceDropdownMenu({ type }: MetadataMenuProps) {
  const { isWorkspacesUser } = useAppContext();
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  if (!(isWorkspacesUser && isDatasetSearch)) {
    return null;
  }
  return (
    <>
      <StyledDropdownMenuButton menuID={menuID} variant="contained">
        <SvgIcon component={WorkspacesIcon} sx={{ mr: 1, fontSize: '1.25rem' }} />
        Workspaces
      </StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <NewWorkspaceDialogFromSelections />
        {menuItems.map(({ dialogType, label, icon }) => (
          <WorkspaceDropdownMenuItem dialogType={dialogType} key={label} icon={icon}>
            {label}
          </WorkspaceDropdownMenuItem>
        ))}
      </DropdownMenu>
    </>
  );
}

export { WorkspaceSearchDialogs };
export default withDropdownMenuProvider(WorkspaceDropdownMenu, false);
