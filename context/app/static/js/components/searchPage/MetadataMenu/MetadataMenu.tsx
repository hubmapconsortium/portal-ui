import React from 'react';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { DownloadTSVItem } from 'js/components/entity-search/MetadataMenu/DownloadTSVItem';
import { StyledDropdownMenuButton, StyledMenuItem } from 'js/components/entity-search/MetadataMenu/style';

const menuID = 'metadata-menu';

interface MetadataMenuProps {
  type: string;
  analyticsCategory?: string;
}

function MetadataMenu({ type, analyticsCategory }: MetadataMenuProps) {
  const lcPluralType = `${type.toLowerCase()}s`;

  const { isWorkspacesUser } = useAppContext();
  const isDatasetSearch = type.toLowerCase() === 'dataset';

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <StyledMenuItem href={`/lineup/${lcPluralType}`} tooltip="Visualize all available metadata in Lineup">
          Visualize
        </StyledMenuItem>
        <DownloadTSVItem lcPluralType={lcPluralType} analyticsCategory={analyticsCategory} />
        {isWorkspacesUser && isDatasetSearch && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
