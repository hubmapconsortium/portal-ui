import React from 'react';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';

import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { StyledDropdownMenuButton, StyledMenuItem } from './style';
import { DownloadTSVItem } from './DownloadTSVItem';

const menuID = 'metadata-menu';

interface MetadataMenuProps {
  entityType: string;
}

function MetadataMenu({ entityType }: MetadataMenuProps) {
  const lcPluralType = `${entityType.toLowerCase()}s`;

  const { isWorkspacesUser } = useAppContext();

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <StyledMenuItem href={`/lineup/${lcPluralType}`} tooltip="Visualize all available metadata in Lineup.">
          Visualize
        </StyledMenuItem>
        <DownloadTSVItem lcPluralType={lcPluralType} />
        {isWorkspacesUser && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
