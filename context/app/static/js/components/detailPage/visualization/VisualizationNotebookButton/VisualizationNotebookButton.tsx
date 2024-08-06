import React from 'react';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';

import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import SvgIcon from '@mui/icons-material/GetAppRounded';
import { WhiteBackgroundBlankDropdownMenuButton } from 'js/shared-styles/buttons';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Download from '@mui/icons-material/Download';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import { StyledTypography } from '../VisualizationShareButton/style';
import { StyledSecondaryBackgroundTooltip, StyledSvgIcon } from './style';

const tooltip = 'Launch new workspace or download a Jupyter notebook for this visualization.';

interface VisualizationNotebookButtonProps {
  uuid: string;
  hubmap_id: string;
  mapped_data_access_level: string;
}

function VisualizationNotebookButton({ uuid, hubmap_id, mapped_data_access_level }: VisualizationNotebookButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  const { setDialogIsOpen, ...rest } = useCreateWorkspaceForm({ defaultName: hubmap_id });

  return (
    <>
      <NewWorkspaceDialog datasetUUIDs={new Set([uuid])} {...rest} />
      <StyledSecondaryBackgroundTooltip title={tooltip}>
        <WhiteBackgroundBlankDropdownMenuButton menuID="id">
          <SvgIcon component={WorkspacesIcon} />
        </WhiteBackgroundBlankDropdownMenuButton>
      </StyledSecondaryBackgroundTooltip>
      <DropdownMenu id="id">
        <MenuList id="preview-options">
          <MenuItem onClick={() => setDialogIsOpen(true)} disabled={mapped_data_access_level === 'Protected'}>
            <ListItemIcon>
              <StyledSvgIcon component={WorkspacesIcon} color="primary" />
            </ListItemIcon>
            <StyledTypography variant="inherit">Launch New Workspace</StyledTypography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              trackEntityPageEvent({ action: `Vitessce / ${tooltip}` });
              postAndDownloadFile({
                url: `/notebooks/entities/dataset/${uuid}.ws.ipynb`,
                body: {},
              })
                .then(() => {
                  // Do nothing
                })
                .catch(() => {
                  toastError('Failed to download Jupyter Notebook');
                });
            }}
          >
            <ListItemIcon>
              <Download color="primary" />
            </ListItemIcon>
            <StyledTypography variant="inherit">Download Jupyter Notebook</StyledTypography>
          </MenuItem>
        </MenuList>
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(VisualizationNotebookButton, false);
