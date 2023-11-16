import React from 'react';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';

import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { StyledDropdownMenuButton } from './style';
import { DownloadTSVItem } from './DownloadTSVItem';
import LineupMenuItem from './LineupMenuItem';

const menuID = 'metadata-menu';

interface MetadataMenuProps {
  entityType: string;
}

function MetadataMenu({ entityType }: MetadataMenuProps) {
  const lcPluralType = `${entityType.toLowerCase()}s`;

  const { isWorkspacesUser } = useAppContext();

  const isDatasetSearch = entityType.toLowerCase() === 'dataset';

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <LineupMenuItem lcPluralType={lcPluralType} />
        <DownloadTSVItem lcPluralType={lcPluralType} />
        {isWorkspacesUser && isDatasetSearch && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
