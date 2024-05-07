import React from 'react';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
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

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <LineupMenuItem lcPluralType={lcPluralType} />
        <DownloadTSVItem lcPluralType={lcPluralType} analyticsCategory={analyticsCategory} />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
