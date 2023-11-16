import React from 'react';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { DownloadTSVItem } from 'js/components/entity-search/MetadataMenu/DownloadTSVItem';
import { StyledDropdownMenuButton } from 'js/components/entity-search/MetadataMenu/style';
import LineupMenuItem from 'js/components/entity-search/MetadataMenu/LineupMenuItem';

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
        <LineupMenuItem lcPluralType={lcPluralType} />
        <DownloadTSVItem lcPluralType={lcPluralType} analyticsCategory={analyticsCategory} />
        {isWorkspacesUser && isDatasetSearch && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
