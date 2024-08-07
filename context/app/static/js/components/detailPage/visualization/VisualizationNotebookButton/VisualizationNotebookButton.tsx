import React, { PropsWithChildren, useMemo } from 'react';

import SvgIcon from '@mui/icons-material/GetAppRounded';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Download from '@mui/icons-material/Download';

import { WhiteBackgroundBlankDropdownMenuButton } from 'js/shared-styles/buttons';
import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import DropdownMenu from 'js/shared-styles/dropdowns/DropdownMenu';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';

import { StyledTypography } from '../VisualizationShareButton/style';
import { StyledSecondaryBackgroundTooltip, StyledSvgIcon } from './style';

interface VisualizationNotebookMenuItemProps extends PropsWithChildren {
  icon: typeof SvgIcon;
  onClick: () => void;
  disabled?: boolean;
}

function VisualizationNotebookMenuItem({ icon, onClick, disabled, children }: VisualizationNotebookMenuItemProps) {
  return (
    <MenuItem onClick={onClick} disabled={disabled}>
      <ListItemIcon>
        <StyledSvgIcon component={icon} color="primary" />
      </ListItemIcon>
      <StyledTypography variant="inherit">{children}</StyledTypography>
    </MenuItem>
  );
}

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

  const downloadNotebook = useMemo(() => {
    return () => {
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
    };
  }, [uuid, toastError, trackEntityPageEvent]);

  const menuOptions = [
    {
      children: 'Launch New Workspace',
      onClick: () => setDialogIsOpen(true),
      disabled: mapped_data_access_level === 'Protected',
      icon: WorkspacesIcon,
    },
    {
      children: 'Download Jupyter Notebook',
      onClick: downloadNotebook,
      icon: Download,
    },
  ];

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
          {menuOptions.map((props) => (
            <VisualizationNotebookMenuItem key={props.children} {...props} />
          ))}
        </MenuList>
      </DropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(VisualizationNotebookButton, false);
