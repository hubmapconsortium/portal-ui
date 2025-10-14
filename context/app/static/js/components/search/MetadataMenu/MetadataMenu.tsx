import React from 'react';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { StyledDropdownMenuButton } from 'js/shared-styles/dropdowns/DropdownMenuButton/DropdownMenuButton';
import LineupMenuItem from './LineupMenuItem';
import { DownloadTSVItem } from './DownloadTSVItem';
import { isDevSearch } from '../utils';

const menuID = 'metadata-menu';

interface MetadataMenuProps {
  type: string;
  analyticsCategory?: string;
}

function MetadataMenu({ type, analyticsCategory }: MetadataMenuProps) {
  const lcPluralType = isDevSearch(type) ? 'entities' : `${type.toLowerCase()}s`;

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <LineupMenuItem lcPluralType={lcPluralType} analyticsCategory={analyticsCategory} />
        <DownloadTSVItem lcPluralType={lcPluralType} analyticsCategory={analyticsCategory} />
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
