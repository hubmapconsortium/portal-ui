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
import { StyledTypography } from '../VisualizationShareButton/style';
import { StyledSecondaryBackgroundTooltip } from './style';

const title = 'Download Jupyter Notebook';

interface VisualizationNotebookButtonProps {
  uuid: string;
}

function VisualizationNotebookButton({ uuid }: VisualizationNotebookButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  return (
    <>
      <StyledSecondaryBackgroundTooltip title={title}>
        <WhiteBackgroundBlankDropdownMenuButton menuID="id">
          <SvgIcon component={WorkspacesIcon} />
        </WhiteBackgroundBlankDropdownMenuButton>
      </StyledSecondaryBackgroundTooltip>
      <DropdownMenu id="id">
        <MenuList id="preview-options">
          <MenuItem
            onClick={() => {
              trackEntityPageEvent({ action: `Vitessce / ${title}` });
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
              <SvgIcon component={WorkspacesIcon} color="primary" sx={{ height: `20px`, width: `20px` }} />
            </ListItemIcon>
            <StyledTypography variant="inherit">Launch New Workspace</StyledTypography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              trackEntityPageEvent({ action: `Vitessce / ${title}` });
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
