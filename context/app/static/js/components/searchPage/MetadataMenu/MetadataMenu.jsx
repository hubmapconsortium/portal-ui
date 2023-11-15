import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';

import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { useAppContext } from 'js/components/Contexts';
import { NewWorkspaceDialogFromSelections } from 'js/components/workspaces/NewWorkspaceDialog';
import { DownloadTSVItem } from 'js/components/entity-search/MetadataMenu/DownloadTSVItem';

import { StyledDropdownMenuButton, StyledInfoIcon } from './style';

const menuID = 'metadata-menu';

function MetadataMenu({ type, analyticsCategory }) {
  const lcPluralType = `${type.toLowerCase()}s`;

  const { isWorkspacesUser } = useAppContext();

  return (
    <>
      <StyledDropdownMenuButton menuID={menuID}>Metadata</StyledDropdownMenuButton>
      <DropdownMenu id={menuID}>
        <Link underline="none" href={`/lineup/${lcPluralType}`}>
          <MenuItem href={`/lineup/${lcPluralType}`}>
            Visualize
            <SecondaryBackgroundTooltip title="Visualize all available metadata in Lineup." placement="bottom-start">
              <StyledInfoIcon color="primary" />
            </SecondaryBackgroundTooltip>
          </MenuItem>
        </Link>
        <DownloadTSVItem lcPluralType={lcPluralType} analyticsCategory={analyticsCategory} />
        {isWorkspacesUser && <NewWorkspaceDialogFromSelections />}
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(MetadataMenu, false);
