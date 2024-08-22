import React, { useCallback } from 'react';

import Download from '@mui/icons-material/Download';

import withDropdownMenuProvider from 'js/shared-styles/dropdowns/DropdownMenuProvider/withDropdownMenuProvider';
import { useTrackEntityPageEvent } from 'js/components/detailPage/useTrackEntityPageEvent';
import { useSnackbarActions } from 'js/shared-styles/snackbars';
import { WorkspacesIcon } from 'js/shared-styles/icons';
import postAndDownloadFile from 'js/helpers/postAndDownloadFile';
import NewWorkspaceDialog from 'js/components/workspaces/NewWorkspaceDialog';
import { useCreateWorkspaceForm } from 'js/components/workspaces/NewWorkspaceDialog/useCreateWorkspaceForm';
import IconDropdownMenu from 'js/shared-styles/dropdowns/IconDropdownMenu';
import { IconDropdownMenuItem } from 'js/shared-styles/dropdowns/IconDropdownMenu/IconDropdownMenu';

const tooltip = 'Launch new workspace or download a Jupyter notebook for this visualization.';

interface VisualizationNotebookButtonProps {
  uuid: string;
  hubmap_id: string;
  mapped_data_access_level: string;
}

function VisualizationNotebookButton({ uuid, hubmap_id, mapped_data_access_level }: VisualizationNotebookButtonProps) {
  const trackEntityPageEvent = useTrackEntityPageEvent();
  const { toastError } = useSnackbarActions();

  const { setDialogIsOpen, removeDatasets, ...rest } = useCreateWorkspaceForm({
    defaultName: hubmap_id,
    defaultTemplate: 'visualization',
    initialSelectedDatasets: [uuid],
  });

  const downloadNotebook = useCallback(() => {
    trackEntityPageEvent({ action: `Vitessce / ${tooltip}` });
    postAndDownloadFile({
      url: `/notebooks/entities/dataset/${uuid}.ws.ipynb`,
      body: {},
    })
      .then()
      .catch(() => {
        toastError('Failed to download Jupyter Notebook');
      });
  }, [uuid, toastError, trackEntityPageEvent]);

  const options = [
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
      <NewWorkspaceDialog {...rest} />
      <IconDropdownMenu tooltip={tooltip} icon={WorkspacesIcon}>
        {options.map((props) => (
          <IconDropdownMenuItem key={props.children} {...props} />
        ))}
      </IconDropdownMenu>
    </>
  );
}

export default withDropdownMenuProvider(VisualizationNotebookButton, false);
